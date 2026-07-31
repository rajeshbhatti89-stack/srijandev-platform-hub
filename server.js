const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { dbRun, dbGet, dbAll } = require('./database');
const { tenantResolver, requireFeature } = require('./middleware/tenant');
const { requireAuth, requireSuperAdmin } = require('./middleware/auth');
const { sendVerificationEmail } = require('./services/mailer');
const { seedDatabase } = require('./services/seed');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts and styles for local dev UI
}));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Dynamic Subdomain & Tenant Resolver
app.use(tenantResolver);

// Service Worker Cache Buster
app.get('/sw.js', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    self.addEventListener('install', () => self.skipWaiting());
    self.addEventListener('activate', (event) => {
      event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
          .then(() => self.registration.unregister())
      );
    });
  `);
});

// Explicit Raw XML Sitemap Route (Explicit HTTP 200 OK & Unrestricted CORS for Googlebot)
app.get('/sitemap.xml', (req, res) => {
  res.status(200);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// Explicit Robots.txt Route
app.get('/robots.txt', (req, res) => {
  res.status(200);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// Explicit Page Routes
app.get(['/services', '/services.html'], (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get(['/tech-stack', '/tech-stack.html'], (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'tech-stack.html'));
});

app.get(['/security', '/security.html'], (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'security.html'));
});

app.get(['/contact', '/contact.html'], (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Explicit Root Landing Page Route (Executed BEFORE express.static)
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  if (req.isTenantPortal || req.query.tenant) {
    return res.sendFile(path.join(__dirname, 'public', 'portal.html'));
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Explicit Redirect for /auth.html -> /
app.get('/auth.html', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.redirect(301, '/');
});

// Serve Static Public Assets (with index disabled for dynamic tenant routing)
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

/* ==========================================================================
   1. PUBLIC MARKETING HUB & LEAD CAPTURE API
   ========================================================================== */

// Lead Capture Endpoint ("Get Quotation" Modal)
app.post('/api/leads', async (req, res) => {
  try {
    const { full_name, company_name, email, phone, employee_count, preferred_subdomain, required_suites } = req.body;

    if (!full_name || !company_name || !email || !phone || !preferred_subdomain) {
      return res.status(400).json({ error: 'Missing Required Fields', message: 'Please complete all required fields.' });
    }

    const cleanedSubdomain = preferred_subdomain.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check if subdomain is already taken
    const existingTenant = await dbGet('SELECT id FROM tenants WHERE subdomain = ?', [cleanedSubdomain]);
    if (existingTenant) {
      return res.status(409).json({ error: 'Subdomain Unavailable', message: `The subdomain prefix '${cleanedSubdomain}' is already taken.` });
    }

    const result = await dbRun(
      `INSERT INTO leads (full_name, company_name, email, phone, employee_count, preferred_subdomain, required_suites, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
      [full_name, company_name, email, phone, parseInt(employee_count) || 10, cleanedSubdomain, required_suites || 'Workforce & Security Patrol Suites']
    );

    console.log(`[Lead Capture] Quotation request received from ${full_name} (${company_name}) for subdomain '${cleanedSubdomain}'`);

    res.status(201).json({
      success: true,
      message: 'Quotation request submitted successfully. Admin team will verify and provision your portal shortly.',
      leadId: result.lastID
    });
  } catch (err) {
    console.error('[Lead Capture Error]:', err);
    res.status(500).json({ error: 'Failed to process lead request', details: err.message });
  }
});

/* ==========================================================================
   2. SUPER-ADMIN PANEL API (/admin & /super-admin)
   ========================================================================== */

// Super-Admin Login
app.post(['/api/admin/login', '/api/super-admin/login'], async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' });
    }

    const user = await dbGet(
      'SELECT id, name, email, password_hash, role, email_verified FROM users WHERE lower(email) = lower(?) AND role = "super_admin"',
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid Super-Admin credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid Super-Admin credentials.' });
    }

    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenant_id: null
    };

    res.cookie('srijan_user', JSON.stringify(userSession), { path: '/', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ success: true, user: userSession });
  } catch (err) {
    console.error('[Super-Admin Login Error]:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get Leads List
app.get(['/api/admin/leads', '/api/super-admin/leads'], requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const leads = await dbAll('SELECT * FROM leads ORDER BY created_at DESC');
    res.json({ leads });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load leads', details: err.message });
  }
});

// Get Tenants List
app.get(['/api/admin/tenants', '/api/super-admin/tenants'], requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const tenants = await dbAll(`
      SELECT t.*, COUNT(u.id) as user_count 
      FROM tenants t 
      LEFT JOIN users u ON u.tenant_id = t.id 
      GROUP BY t.id 
      ORDER BY t.created_at DESC
    `);
    res.json({ tenants });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load tenants', details: err.message });
  }
});

// Manual Client Provisioner Endpoint
app.post(['/api/admin/provision', '/api/super-admin/provision'], requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const {
      name,
      subdomain,
      contact_email,
      admin_name,
      admin_password,
      enable_workforce,
      enable_patrol,
      lead_id
    } = req.body;

    if (!name || !subdomain || !contact_email || !admin_name) {
      return res.status(400).json({ error: 'Missing required tenant provisioning parameters.' });
    }

    const cleanedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9]/g, '');

    const existing = await dbGet('SELECT id FROM tenants WHERE subdomain = ?', [cleanedSubdomain]);
    if (existing) {
      return res.status(409).json({ error: `Subdomain '${cleanedSubdomain}' is already assigned.` });
    }

    // Insert Tenant Record
    const tenantRes = await dbRun(
      `INSERT INTO tenants (name, subdomain, contact_email, enable_workforce, enable_patrol, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [
        name,
        cleanedSubdomain,
        contact_email,
        enable_workforce ? 1 : 0,
        enable_patrol ? 1 : 0
      ]
    );

    const tenantId = tenantRes.lastID;

    // Generate Verification Token & Temporary Password
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const rawPassword = admin_password || 'WelcomeSrijan123!';
    const passwordHash = await bcrypt.hash(rawPassword, 12);

    // Create Initial Client Admin User (email_verified = 0)
    await dbRun(
      `INSERT INTO users (tenant_id, name, email, password_hash, role, email_verified, verification_token, verification_token_expires)
       VALUES (?, ?, ?, ?, 'client_admin', 0, ?, ?)`,
      [tenantId, admin_name, contact_email, passwordHash, verificationToken, tokenExpires]
    );

    // Send Verification Email
    const verifyUrl = await sendVerificationEmail(contact_email, admin_name, verificationToken, cleanedSubdomain);

    // Update Lead status if provisioned from lead
    if (lead_id) {
      await dbRun("UPDATE leads SET status = 'provisioned' WHERE id = ?", [lead_id]);
    }

    res.status(201).json({
      success: true,
      message: `Tenant '${name}' (${cleanedSubdomain}.srijandev.in) provisioned successfully. Verification link dispatched.`,
      tenant: {
        id: tenantId,
        name,
        subdomain: cleanedSubdomain,
        contact_email
      },
      verificationUrl: verifyUrl
    });
  } catch (err) {
    console.error('[Tenant Provisioning Error]:', err);
    res.status(500).json({ error: 'Provisioning failed', details: err.message });
  }
});

// Toggle Tenant Status (Active / Suspended)
app.patch(['/api/admin/tenants/:id/status', '/api/super-admin/tenants/:id/status'], requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const tenantId = req.params.id;
    const { status } = req.body;

    if (!status || !['active', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Status must be "active" or "suspended".' });
    }

    const tenant = await dbGet('SELECT id, name, subdomain FROM tenants WHERE id = ?', [tenantId]);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found.' });
    }

    await dbRun('UPDATE tenants SET status = ? WHERE id = ?', [status, tenantId]);

    console.log(`[Admin Action] Tenant '${tenant.name}' (${tenant.subdomain}) status updated to '${status}'`);

    res.json({
      success: true,
      message: `Tenant '${tenant.name}' status updated to '${status}'.`,
      tenant: { id: tenant.id, subdomain: tenant.subdomain, status }
    });
  } catch (err) {
    console.error('[Tenant Status Toggle Error]:', err);
    res.status(500).json({ error: 'Failed to update tenant status', details: err.message });
  }
});

// Permanently Delete Tenant Endpoint
app.delete(['/api/admin/tenants/:id', '/api/super-admin/tenants/:id'], requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const tenantId = req.params.id;

    const tenant = await dbGet('SELECT id, name, subdomain FROM tenants WHERE id = ?', [tenantId]);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found.' });
    }

    // Delete associated logs & records explicitly
    await dbRun('DELETE FROM attendance_logs WHERE tenant_id = ?', [tenantId]);
    await dbRun('DELETE FROM leave_requests WHERE tenant_id = ?', [tenantId]);
    await dbRun('DELETE FROM patrol_scans WHERE tenant_id = ?', [tenantId]);
    await dbRun('DELETE FROM patrol_checkpoints WHERE tenant_id = ?', [tenantId]);
    await dbRun('DELETE FROM incident_reports WHERE tenant_id = ?', [tenantId]);
    await dbRun('DELETE FROM users WHERE tenant_id = ?', [tenantId]);
    await dbRun('DELETE FROM tenants WHERE id = ?', [tenantId]);

    console.log(`[Admin Action] Tenant '${tenant.name}' (${tenant.subdomain}) permanently deleted`);

    res.json({
      success: true,
      message: `Tenant '${tenant.name}' (${tenant.subdomain}.srijandev.in) and all associated records permanently deleted.`
    });
  } catch (err) {
    console.error('[Tenant Delete Error]:', err);
    res.status(500).json({ error: 'Failed to delete tenant', details: err.message });
  }
});

/* ==========================================================================
   3. AUTHENTICATION & EMAIL VERIFICATION GUARDRAILS
   ========================================================================== */

// Client Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' });
    }

    let user;
    if (req.isTenantPortal && req.tenant) {
      user = await dbGet(
        'SELECT u.*, t.name as tenant_name, t.subdomain, t.status as tenant_status FROM users u JOIN tenants t ON u.tenant_id = t.id WHERE lower(u.email) = lower(?) AND u.tenant_id = ?',
        [email, req.tenant.id]
      );
    } else {
      user = await dbGet(
        'SELECT u.*, t.name as tenant_name, t.subdomain, t.status as tenant_status FROM users u LEFT JOIN tenants t ON u.tenant_id = t.id WHERE lower(u.email) = lower(?)',
        [email]
      );
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password for this portal.' });
    }

    // MANDATORY GUARDRAIL 1: Email Verification
    if (user.email_verified !== 1) {
      return res.status(403).json({
        error: 'Email Not Verified',
        message: 'Account pending activation. Check your email inbox for the activation link.'
      });
    }

    // MANDATORY GUARDRAIL 2: Tenant Suspension Check
    if (user.role !== 'super_admin' && user.tenant_status === 'suspended') {
      return res.status(403).json({
        error: 'Portal Suspended',
        message: 'Your client portal is currently suspended. Please contact SrijanDev support.'
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenant_id: user.tenant_id,
      tenant_subdomain: user.subdomain
    };

    res.cookie('srijan_user', JSON.stringify(userSession), { path: '/', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ success: true, user: userSession });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    res.status(500).json({ error: 'Login failure', details: err.message });
  }
});

// Logout Endpoint
app.post(['/api/auth/logout', '/api/admin/logout'], (req, res) => {
  res.clearCookie('srijan_user', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Email Verification Endpoint (/api/auth/verify-email?token=xyz)
app.get('/api/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send('<h3>Verification token is missing.</h3>');
    }

    const user = await dbGet('SELECT * FROM users WHERE verification_token = ?', [token]);
    if (!user) {
      return res.status(404).send(`
        <div style="font-family: sans-serif; background:#0b0f19; color:#f9fafb; padding:40px; text-align:center;">
          <h2 style="color:#f43f5e;">Verification Link Invalid or Expired</h2>
          <p>This activation token is invalid or has already been used.</p>
          <a href="/" style="color:#3b82f6;">Return to Home</a>
        </div>
      `);
    }

    // Activate Account
    await dbRun(
      'UPDATE users SET email_verified = 1, verification_token = NULL, verification_token_expires = NULL WHERE id = ?',
      [user.id]
    );

    const tenant = user.tenant_id ? await dbGet('SELECT subdomain FROM tenants WHERE id = ?', [user.tenant_id]) : null;
    const portalSubdomain = tenant ? tenant.subdomain : null;

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Account Verified - SrijanDev</title>
        <style>
          body { background: #0b0f19; color: #f9fafb; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: #1f2937; padding: 3rem; border-radius: 14px; max-width: 500px; text-align: center; border: 1px solid #3b82f6; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          h1 { color: #3b82f6; margin-top: 0; }
          p { color: #9ca3af; line-height: 1.6; }
          .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Account Verified!</h1>
          <p>Welcome to <strong>SrijanDev Operations & Management Portal</strong>.</p>
          <p>Your email address (<strong>${user.email}</strong>) has been verified. You can now log into your client portal.</p>
          <a href="${portalSubdomain ? `/?tenant=${portalSubdomain}` : '/'}" class="btn">Proceed to Login</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('[Verify Email Error]:', err);
    res.status(500).send('Server Error processing verification.');
  }
});

// Logout Endpoint
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('srijan_user');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Current User Details
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user, tenant: req.tenant });
});

/* ==========================================================================
   4. CLIENT TENANT PORTAL FEATURE APIS
   ========================================================================== */

app.get('/api/tenant/info', (req, res) => {
  if (!req.tenant) {
    return res.status(400).json({ error: 'No tenant context present.' });
  }
  res.json({ tenant: req.tenant });
});

// ----- SMART FIELD WORKFORCE SUITE -----

app.get('/api/tenant/attendance', requireAuth, requireFeature('enable_workforce'), async (req, res) => {
  try {
    const logs = await dbAll(
      `SELECT a.*, u.name as user_name, u.email as user_email 
       FROM attendance_logs a 
       JOIN users u ON a.user_id = u.id 
       WHERE a.tenant_id = ? 
       ORDER BY a.timestamp DESC`,
      [req.tenantId]
    );
    res.json({ attendance: logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance logs', details: err.message });
  }
});

app.post('/api/tenant/attendance/clock', requireAuth, requireFeature('enable_workforce'), async (req, res) => {
  try {
    const { type, latitude, longitude, location_name } = req.body;
    if (!type || !['clock_in', 'clock_out'].includes(type)) {
      return res.status(400).json({ error: 'Invalid clock type. Must be clock_in or clock_out.' });
    }

    const resRun = await dbRun(
      `INSERT INTO attendance_logs (tenant_id, user_id, type, latitude, longitude, location_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.tenantId, req.user.id, type, latitude || 28.6139, longitude || 77.2090, location_name || 'Field Location']
    );

    res.status(201).json({ success: true, id: resRun.lastID, type, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record clock event', details: err.message });
  }
});

app.get('/api/tenant/leaves', requireAuth, requireFeature('enable_workforce'), async (req, res) => {
  try {
    const leaves = await dbAll(
      `SELECT l.*, u.name as user_name 
       FROM leave_requests l 
       JOIN users u ON l.user_id = u.id 
       WHERE l.tenant_id = ? 
       ORDER BY l.created_at DESC`,
      [req.tenantId]
    );
    res.json({ leaves });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaves', details: err.message });
  }
});

app.post('/api/tenant/leaves', requireAuth, requireFeature('enable_workforce'), async (req, res) => {
  try {
    const { leave_type, start_date, end_date, reason } = req.body;
    if (!leave_type || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required leave fields.' });
    }

    const resRun = await dbRun(
      `INSERT INTO leave_requests (tenant_id, user_id, leave_type, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [req.tenantId, req.user.id, leave_type, start_date, end_date, reason || '']
    );

    res.status(201).json({ success: true, id: resRun.lastID, message: 'Leave request submitted for approval.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit leave request', details: err.message });
  }
});

// ----- SECURITY & PATROL OPERATIONS SUITE -----

app.get('/api/tenant/checkpoints', requireAuth, requireFeature('enable_patrol'), async (req, res) => {
  try {
    const checkpoints = await dbAll(
      'SELECT * FROM patrol_checkpoints WHERE tenant_id = ? ORDER BY created_at DESC',
      [req.tenantId]
    );
    res.json({ checkpoints });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch checkpoints', details: err.message });
  }
});

app.post('/api/tenant/checkpoints', requireAuth, requireFeature('enable_patrol'), async (req, res) => {
  try {
    const { name, qr_code_data, latitude, longitude, location_description } = req.body;
    if (!name || !qr_code_data) {
      return res.status(400).json({ error: 'Checkpoint name and QR code string are required.' });
    }

    const resRun = await dbRun(
      `INSERT INTO patrol_checkpoints (tenant_id, name, qr_code_data, latitude, longitude, location_description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.tenantId, name, qr_code_data, latitude || 28.6139, longitude || 77.2090, location_description || '']
    );

    res.status(201).json({ success: true, checkpointId: resRun.lastID, name, qr_code_data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create checkpoint', details: err.message });
  }
});

app.post('/api/tenant/scans', requireAuth, requireFeature('enable_patrol'), async (req, res) => {
  try {
    const { checkpoint_id, notes } = req.body;
    if (!checkpoint_id) {
      return res.status(400).json({ error: 'Checkpoint ID is required.' });
    }

    const cp = await dbGet('SELECT id FROM patrol_checkpoints WHERE id = ? AND tenant_id = ?', [checkpoint_id, req.tenantId]);
    if (!cp) {
      return res.status(404).json({ error: 'Checkpoint not found for this tenant.' });
    }

    const resRun = await dbRun(
      `INSERT INTO patrol_scans (tenant_id, user_id, checkpoint_id, notes, status)
       VALUES (?, ?, ?, ?, 'verified')`,
      [req.tenantId, req.user.id, checkpoint_id, notes || 'Patrol checkpoint scan verified']
    );

    res.status(201).json({ success: true, scanId: resRun.lastID, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record scan', details: err.message });
  }
});

app.get('/api/tenant/scans', requireAuth, requireFeature('enable_patrol'), async (req, res) => {
  try {
    const scans = await dbAll(
      `SELECT s.*, u.name as guard_name, c.name as checkpoint_name, c.qr_code_data 
       FROM patrol_scans s 
       JOIN users u ON s.user_id = u.id 
       JOIN patrol_checkpoints c ON s.checkpoint_id = c.id 
       WHERE s.tenant_id = ? 
       ORDER BY s.timestamp DESC`,
      [req.tenantId]
    );
    res.json({ scans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patrol scans', details: err.message });
  }
});

app.get('/api/tenant/incidents', requireAuth, requireFeature('enable_patrol'), async (req, res) => {
  try {
    const incidents = await dbAll(
      `SELECT i.*, u.name as reporter_name 
       FROM incident_reports i 
       JOIN users u ON i.user_id = u.id 
       WHERE i.tenant_id = ? 
       ORDER BY i.timestamp DESC`,
      [req.tenantId]
    );
    res.json({ incidents });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch incident reports', details: err.message });
  }
});

app.post('/api/tenant/incidents', requireAuth, requireFeature('enable_patrol'), async (req, res) => {
  try {
    const { title, description, severity } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }

    const resRun = await dbRun(
      `INSERT INTO incident_reports (tenant_id, user_id, title, description, severity, status)
       VALUES (?, ?, ?, ?, ?, 'open')`,
      [req.tenantId, req.user.id, title, description, severity || 'medium']
    );

    res.status(201).json({ success: true, incidentId: resRun.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit incident report', details: err.message });
  }
});

// Dashboard Analytics Endpoint (Strictly scoped by tenant_id)
app.get('/api/tenant/analytics', requireAuth, async (req, res) => {
  try {
    const attendanceCount = await dbGet('SELECT COUNT(*) as count FROM attendance_logs WHERE tenant_id = ?', [req.tenantId]);
    const leaveCount = await dbGet('SELECT COUNT(*) as count FROM leave_requests WHERE tenant_id = ?', [req.tenantId]);
    const checkpointCount = await dbGet('SELECT COUNT(*) as count FROM patrol_checkpoints WHERE tenant_id = ?', [req.tenantId]);
    const scanCount = await dbGet('SELECT COUNT(*) as count FROM patrol_scans WHERE tenant_id = ?', [req.tenantId]);
    const incidentCount = await dbGet('SELECT COUNT(*) as count FROM incident_reports WHERE tenant_id = ?', [req.tenantId]);

    res.json({
      analytics: {
        tenant_id: req.tenantId,
        subdomain: req.tenant ? req.tenant.subdomain : null,
        attendance_logs: attendanceCount.count,
        leave_requests: leaveCount.count,
        patrol_checkpoints: checkpointCount.count,
        patrol_scans: scanCount.count,
        incident_reports: incidentCount.count
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load analytics', details: err.message });
  }
});

/* ==========================================================================
   5. PAGE ROUTER (Modular HTML Files)
   ========================================================================== */

// Explicit Root Route
app.get('/', (req, res) => {
  if (req.isTenantPortal || req.query.tenant) {
    return res.sendFile(path.join(__dirname, 'public', 'portal.html'));
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Explicit Redirect for deprecated /auth.html -> /
app.get('/auth.html', (req, res) => {
  res.redirect(301, '/');
});

// Admin Dashboard Route
app.get(['/admin', '/super-admin'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Client Portal & Root Catch-all Route
app.get('*', (req, res) => {
  if (req.isMainSite || req.isMainHub) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  if (req.isTenantPortal || req.query.tenant) {
    return res.sendFile(path.join(__dirname, 'public', 'portal.html'));
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server & Seed Initial Data
async function startServer() {
  await seedDatabase();
  app.listen(PORT, () => {
    console.log('\n==================================================================');
    console.log('🚀 SRIJANDEV OPERATIONS & MANAGEMENT PORTAL ONLINE');
    console.log(`- Public Marketing Site:     http://localhost:${PORT}`);
    console.log(`- Super-Admin Dashboard:    http://localhost:${PORT}/admin`);
    console.log(`- Demo Client 1 (Apex):     http://localhost:${PORT}/?tenant=apex`);
    console.log(`- Demo Client 2 (Shield):   http://localhost:${PORT}/?tenant=shield`);
    console.log(`- Demo Client 3 (Logistics): http://localhost:${PORT}/?tenant=logistics`);
    console.log('==================================================================\n');
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
