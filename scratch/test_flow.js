const http = require('http');
const { seedDatabase } = require('../services/seed');
const { dbGet, dbAll } = require('../database');

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING FRESH SRIJANDEV PLATFORM HUB VERIFICATION SUITE');
  console.log('======================================================\n');

  // Step 1: Verify Seed Execution
  console.log('[Test 1] Executing Database Seed...');
  await seedDatabase();

  const superAdmin = await dbGet('SELECT * FROM users WHERE role = "super_admin"');
  if (!superAdmin || superAdmin.email !== 'rajeshbhatti89@gmail.com') {
    throw new Error('Super-Admin seed check failed!');
  }
  console.log('✓ Super-Admin Rajesh Bhatti verified in SQLite database.');

  const tenants = await dbAll('SELECT subdomain, enable_workforce, enable_patrol FROM tenants');
  console.log(`✓ Seeded Tenants count: ${tenants.length}`);
  tenants.forEach(t => {
    console.log(`  - Tenant '${t.subdomain}': Workforce=${t.enable_workforce}, Patrol=${t.enable_patrol}`);
  });

  // Step 2: Test API Server Routes
  require('../server');
  await new Promise(res => setTimeout(res, 1000));

  console.log('\n[Test 2] Testing Inbound Lead Capture API (POST /api/leads)...');
  const leadRes = await makeRequest('POST', '/api/leads', {
    full_name: 'Rohan Sharma',
    company_name: 'Titan Defense & Operations',
    email: 'rohan@titandefense.com',
    phone: '+91 91234 56789',
    employee_count: 50,
    preferred_subdomain: 'titandefense',
    required_suites: 'Workforce & Security Patrol Suites'
  });

  if (leadRes.status !== 201 || !leadRes.body.success) {
    throw new Error(`Lead capture failed: ${JSON.stringify(leadRes.body)}`);
  }
  console.log('✓ Lead capture API working cleanly. Lead ID created:', leadRes.body.leadId);

  // Step 3: Test Super-Admin Login
  console.log('\n[Test 3] Testing Super-Admin Login (POST /api/admin/login)...');
  const adminLoginRes = await makeRequest('POST', '/api/admin/login', {
    email: 'rajeshbhatti89@gmail.com',
    password: 'SuperAdmin123!'
  });

  if (adminLoginRes.status !== 200 || !adminLoginRes.body.success) {
    throw new Error(`Super-Admin login failed: ${JSON.stringify(adminLoginRes.body)}`);
  }
  const adminCookie = adminLoginRes.headers['set-cookie'];
  console.log('✓ Super-Admin authenticated successfully.');

  // Step 4: Test Manual Tenant Provisioning
  console.log('\n[Test 4] Testing Manual Client Provisioner API (POST /api/admin/provision)...');
  const testSubdomain = `vanguard${Date.now().toString().slice(-4)}`;
  const testEmail = `admin@${testSubdomain}.com`;
  const provRes = await makeRequest('POST', '/api/admin/provision', {
    name: 'Vanguard Security Services',
    subdomain: testSubdomain,
    contact_email: testEmail,
    admin_name: 'Vanguard Admin',
    admin_password: 'VanguardPass123!',
    enable_workforce: 1,
    enable_patrol: 0,
    lead_id: leadRes.body.leadId
  }, adminCookie);

  if (provRes.status !== 201 || !provRes.body.success) {
    throw new Error(`Tenant provisioning failed: ${JSON.stringify(provRes.body)}`);
  }
  console.log('✓ Client Portal provisioned successfully!');
  console.log('✓ Nodemailer Verification Link:', provRes.body.verificationUrl);

  // Step 5: Test Unverified User Login Guardrail Block
  console.log('\n[Test 5] Testing Unverified User Login Guardrail Block...');
  const unverifiedLoginRes = await makeRequest('POST', `/api/auth/login?tenant=${testSubdomain}`, {
    email: testEmail,
    password: 'VanguardPass123!'
  });

  if (unverifiedLoginRes.status !== 403 || unverifiedLoginRes.body.error !== 'Email Not Verified') {
    throw new Error(`Guardrail failure! Unverified login should be blocked with 403, got: ${unverifiedLoginRes.status}`);
  }
  console.log(`✓ MANDATORY GUARDRAIL VERIFIED: Unverified account ${testEmail} blocked from logging in.`);

  // Step 6: Test Email Verification Endpoint
  console.log('\n[Test 6] Executing Email Verification Link...');
  const newAdminUser = await dbGet('SELECT verification_token FROM users WHERE email = ?', [testEmail]);
  if (!newAdminUser || !newAdminUser.verification_token) {
    throw new Error('Verification token not stored in user record!');
  }

  const verifyPath = `/api/auth/verify-email?token=${newAdminUser.verification_token}`;
  const verifyRes = await makeRequest('GET', verifyPath);

  if (verifyRes.status !== 200 || !verifyRes.rawBody.includes('Account Verified!')) {
    throw new Error('Email verification link failed!');
  }

  const updatedUser = await dbGet('SELECT email_verified FROM users WHERE email = ?', [testEmail]);
  if (updatedUser.email_verified !== 1) {
    throw new Error('User email_verified flag not set to 1!');
  }
  console.log('✓ Email verification executed successfully! Account activated in SQLite database.');

  // Step 7: Test Verified User Login
  console.log('\n[Test 7] Testing Verified User Login...');
  const verifiedLoginRes = await makeRequest('POST', `/api/auth/login?tenant=${testSubdomain}`, {
    email: testEmail,
    password: 'VanguardPass123!'
  });

  if (verifiedLoginRes.status !== 200 || !verifiedLoginRes.body.success) {
    throw new Error(`Verified login failed: ${JSON.stringify(verifiedLoginRes.body)}`);
  }
  const clientCookie = verifiedLoginRes.headers['set-cookie'];
  console.log('✓ Verified client user logged in successfully.');

  // Step 8: Test Dynamic Feature Switch Guardrails
  console.log('\n[Test 8] Testing Dynamic Feature Switch Engine Guardrails...');
  const attRes = await makeRequest('GET', `/api/tenant/attendance?tenant=${testSubdomain}`, null, clientCookie);
  if (attRes.status !== 200) {
    throw new Error(`Workforce attendance fetch failed for authorized tenant: ${attRes.status}`);
  }
  console.log('✓ Smart Field Workforce suite endpoint accessible for Vanguard tenant.');

  const patrolRes = await makeRequest('GET', `/api/tenant/checkpoints?tenant=${testSubdomain}`, null, clientCookie);
  if (patrolRes.status !== 403 || patrolRes.body.error !== 'Feature Disabled') {
    throw new Error(`Feature switch engine failure! Disabled patrol suite was accessed: ${patrolRes.status}`);
  }
  console.log('✓ FEATURE SWITCH ENGINE VERIFIED: Access to disabled Security Patrol suite correctly blocked (403 Forbidden).');

  console.log('\n======================================================');
  console.log('🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
  process.exit(0);
}

function makeRequest(method, path, body = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    if (cookie) {
      options.headers['Cookie'] = cookie;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, body: json, rawBody: data });
      });
    });

    req.on('error', reject);
    if (body) req.write(postData);
    req.end();
  });
}

runTests().catch(err => {
  console.error('\n❌ VERIFICATION TEST FAILED:', err);
  process.exit(1);
});
