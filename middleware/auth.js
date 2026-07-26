const { dbGet } = require('../database');

/**
 * Middleware: Verifies Authentication & Email Verification Status
 */
async function requireAuth(req, res, next) {
  try {
    const cookieUser = req.cookies ? req.cookies.srijan_user : null;
    const authHeader = req.headers.authorization;

    let sessionUser = null;
    if (cookieUser) {
      try {
        sessionUser = typeof cookieUser === 'string' ? JSON.parse(cookieUser) : cookieUser;
      } catch (e) {
        sessionUser = null;
      }
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
        sessionUser = JSON.parse(decoded);
      } catch (e) {
        sessionUser = null;
      }
    }

    if (!sessionUser || !sessionUser.id) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication session required. Please log in.'
      });
    }

    // Refresh user record from database
    const dbUser = await dbGet(
      'SELECT id, tenant_id, name, email, role, email_verified FROM users WHERE id = ?',
      [sessionUser.id]
    );

    if (!dbUser) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User account not found.' });
    }

    // MANDATORY GUARDRAIL 1: Email Verification
    if (dbUser.email_verified !== 1) {
      return res.status(403).json({
        error: 'Email Not Verified',
        message: 'Your email address has not been verified. Please check your inbox for the activation link.'
      });
    }

    // MANDATORY GUARDRAIL 2: Strict Tenant Isolation
    if (dbUser.role !== 'super_admin') {
      if (!req.tenantId) {
        req.tenantId = dbUser.tenant_id;
      } else if (dbUser.tenant_id !== req.tenantId) {
        return res.status(403).json({
          error: 'Cross-Tenant Access Denied',
          message: 'Your account is not authorized to access this client portal.'
        });
      }
    }

    // MANDATORY GUARDRAIL 3: Tenant Suspension Check
    if (dbUser.role !== 'super_admin' && req.tenant && req.tenant.status === 'suspended') {
      return res.status(403).json({
        error: 'Portal Suspended',
        message: 'Your client portal is currently suspended. Please contact SrijanDev support.'
      });
    }

    req.user = dbUser;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

/**
 * Middleware: Restricts access strictly to Super-Admin (Rajesh Bhatti)
 */
function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Restricted to SrijanDev Super-Admin only.'
    });
  }
  next();
}

module.exports = {
  requireAuth,
  requireSuperAdmin
};
