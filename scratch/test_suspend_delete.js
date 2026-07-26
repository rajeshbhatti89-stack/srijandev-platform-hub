const http = require('http');
const { seedDatabase } = require('../services/seed');
const { dbGet, dbAll } = require('../database');

async function runSuspendDeleteTests() {
  console.log('\n======================================================================');
  console.log('🧪 VERIFYING CLIENT SUSPEND (DISABLE) & PERMANENT DELETE FEATURE');
  console.log('======================================================================\n');

  await seedDatabase();

  // 1. Super-Admin Login
  const adminLoginRes = await makeRequest('POST', '/api/admin/login', {
    email: 'rajeshbhatti89@gmail.com',
    password: 'SuperAdmin123!'
  });
  const adminCookie = adminLoginRes.headers['set-cookie'];
  console.log('✓ Super-Admin logged in.');

  // 2. Provision Test Tenant
  const testSubdomain = `testtenant${Date.now().toString().slice(-4)}`;
  const testEmail = `admin@${testSubdomain}.com`;
  const testPass = 'TestPass123!';

  const provRes = await makeRequest('POST', '/api/admin/provision', {
    name: 'Test Suspend Company',
    subdomain: testSubdomain,
    contact_email: testEmail,
    admin_name: 'Test Admin',
    admin_password: testPass,
    enable_workforce: 1,
    enable_patrol: 1
  }, adminCookie);

  const tenantId = provRes.body.tenant.id;
  console.log(`✓ Test tenant provisioned: '${testSubdomain}' (ID: ${tenantId})`);

  // 3. Verify Email to activate user
  const userInDb = await dbGet('SELECT verification_token FROM users WHERE email = ?', [testEmail]);
  await makeRequest('GET', `/api/auth/verify-email?token=${userInDb.verification_token}`);
  console.log('✓ Email verified and account activated.');

  // Verify Active Login Works
  const activeLoginRes = await makeRequest('POST', `/api/auth/login?tenant=${testSubdomain}`, {
    email: testEmail,
    password: testPass
  });
  if (activeLoginRes.status !== 200) {
    throw new Error('Active login failed!');
  }
  console.log('✓ Active portal login succeeded.');

  // 4. Suspend Tenant (PATCH /api/admin/tenants/:id/status -> status = 'suspended')
  console.log('\n[Test 4] Executing Tenant Suspension (PATCH /api/admin/tenants/:id/status)...');
  const suspendRes = await makeRequest('PATCH', `/api/admin/tenants/${tenantId}/status`, { status: 'suspended' }, adminCookie);

  if (suspendRes.status !== 200 || !suspendRes.body.success) {
    throw new Error(`Suspension API failed: ${JSON.stringify(suspendRes.body)}`);
  }
  console.log('✓ Tenant status updated to "suspended" in database.');

  // 5. Verify Suspended Tenant Login Block (Must return HTTP 403 and exact error message)
  console.log('\n[Test 5] Verifying Login Attempt on Suspended Tenant Portal...');
  const suspendedLoginRes = await makeRequest('POST', `/api/auth/login?tenant=${testSubdomain}`, {
    email: testEmail,
    password: testPass
  });

  if (suspendedLoginRes.status !== 403) {
    throw new Error(`Suspension block failed! Got status: ${suspendedLoginRes.status}`);
  }
  if (suspendedLoginRes.body.message !== 'Your client portal is currently suspended. Please contact SrijanDev support.') {
    throw new Error(`Suspension response message mismatch: ${JSON.stringify(suspendedLoginRes.body)}`);
  }
  console.log('✓ SUSPENSION GUARDRAIL VERIFIED: Login blocked with 403 Forbidden ("Your client portal is currently suspended. Please contact SrijanDev support.")');

  // 6. Re-enable Tenant Status (PATCH status -> 'active')
  console.log('\n[Test 6] Re-enabling Tenant Status...');
  const enableRes = await makeRequest('PATCH', `/api/admin/tenants/${tenantId}/status`, { status: 'active' }, adminCookie);
  if (enableRes.status !== 200) {
    throw new Error('Re-enable failed!');
  }

  const reEnableLoginRes = await makeRequest('POST', `/api/auth/login?tenant=${testSubdomain}`, {
    email: testEmail,
    password: testPass
  });
  if (reEnableLoginRes.status !== 200) {
    throw new Error('Re-enabled portal login failed!');
  }
  console.log('✓ Tenant successfully re-enabled & portal login verified.');

  // 7. Permanent Delete Tenant (DELETE /api/admin/tenants/:id)
  console.log('\n[Test 7] Executing Permanent Tenant Delete (DELETE /api/admin/tenants/:id)...');
  const deleteRes = await makeRequest('DELETE', `/api/admin/tenants/${tenantId}`, null, adminCookie);
  if (deleteRes.status !== 200 || !deleteRes.body.success) {
    throw new Error(`Delete API failed: ${JSON.stringify(deleteRes.body)}`);
  }

  // Verify deletion in SQLite DB
  const deletedTenantInDb = await dbGet('SELECT * FROM tenants WHERE id = ?', [tenantId]);
  const deletedUserInDb = await dbGet('SELECT * FROM users WHERE tenant_id = ?', [tenantId]);

  if (deletedTenantInDb || deletedUserInDb) {
    throw new Error('Tenant or user records still exist in database after deletion!');
  }
  console.log('✓ PERMANENT DELETE VERIFIED: Tenant and all associated users purged from SQLite database.');

  console.log('\n======================================================================');
  console.log('🎉 CLIENT SUSPEND & PERMANENT DELETE FEATURE VERIFIED 100% CLEAN!');
  console.log('======================================================================\n');
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

runSuspendDeleteTests().catch(err => {
  console.error('\n❌ SUSPEND/DELETE TEST FAILED:', err);
  process.exit(1);
});
