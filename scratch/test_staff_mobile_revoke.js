const http = require('http');
const { seedDatabase } = require('../services/seed');
const { dbGet, dbAll } = require('../database');

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING STAFF MOBILE REVOKE VALIDATION SUITE');
  console.log('======================================================\n');

  // Step 1: Verify Seed Execution
  console.log('[Test 1] Executing Database Seed...');
  await seedDatabase();
  console.log('✓ Database seeded successfully.');

  // Start Server
  require('../server');
  await new Promise(res => setTimeout(res, 1000));

  // Step 2: Super-Admin Login to create lead
  console.log('\n[Test 2] Testing Super-Admin Login (POST /api/admin/login)...');
  const adminLoginRes = await makeRequest('POST', '/api/admin/login', {
    email: 'rajeshbhatti89@gmail.com',
    password: 'SuperAdmin123!'
  });

  if (adminLoginRes.status !== 200 || !adminLoginRes.body.success) {
    throw new Error(`Super-Admin login failed: ${JSON.stringify(adminLoginRes.body)}`);
  }
  const adminCookie = adminLoginRes.headers['set-cookie'];
  console.log('✓ Super-Admin authenticated successfully.');

  // Create a lead
  const testSubdomain = `testrevoke${Date.now().toString().slice(-4)}`;
  const leadRes = await makeRequest('POST', '/api/leads', {
    full_name: 'Test Name',
    company_name: 'Test Company',
    email: 'test@company.com',
    phone: '+91 1234567890',
    employee_count: 50,
    preferred_subdomain: testSubdomain,
    required_suites: 'Workforce & Security Patrol Suites'
  });

  // Step 3: Provision Tenant
  console.log('\n[Test 3] Provisioning Tenant...');
  const testEmail = `admin@${testSubdomain}.com`;
  const provRes = await makeRequest('POST', '/api/admin/provision', {
    name: 'Test Security Services',
    subdomain: testSubdomain,
    contact_email: testEmail,
    admin_name: 'Test Admin',
    admin_password: 'AdminPass123!',
    enable_workforce: 1,
    enable_patrol: 1,
    lead_id: leadRes.body.leadId
  }, adminCookie);

  if (provRes.status !== 201 || !provRes.body.success) {
    throw new Error(`Tenant provisioning failed: ${JSON.stringify(provRes.body)}`);
  }

  // Verify Admin Email
  const newAdminUser = await dbGet('SELECT verification_token FROM users WHERE email = ?', [testEmail]);
  await makeRequest('GET', `/api/auth/verify-email?token=${newAdminUser.verification_token}`);
  console.log('✓ Tenant provisioned and admin verified.');

  // Step 4: Login as Tenant Admin
  console.log('\n[Test 4] Tenant Admin Login...');
  const tenantAdminLoginRes = await makeRequest('POST', `/api/auth/login?tenant=${testSubdomain}`, {
    email: testEmail,
    password: 'AdminPass123!'
  });
  if (tenantAdminLoginRes.status !== 200 || !tenantAdminLoginRes.body.success) {
    throw new Error('Tenant Admin login failed');
  }
  const clientCookie = tenantAdminLoginRes.headers['set-cookie'];
  console.log('✓ Tenant Admin logged in successfully.');

  // Step 5: Add Staff
  console.log('\n[Test 5] Add Staff Member...');
  const addStaffRes = await makeRequest('POST', `/api/staff/add?tenant=${testSubdomain}`, {
    name: 'Mobile Guard',
    email: `guard@${testSubdomain}.com`,
    password: 'GuardPass123!'
  }, clientCookie);

  if (addStaffRes.status !== 201) {
    throw new Error('Failed to add staff: ' + JSON.stringify(addStaffRes.body));
  }
  const staffId = addStaffRes.body.id;
  console.log('✓ Staff member added successfully.');

  // Step 6: Login as Staff (Mobile App simulation)
  console.log('\n[Test 6] Staff Mobile Login...');
  const staffLoginRes = await makeRequest('POST', `/api/auth/login?tenant=${testSubdomain}`, {
    email: `guard@${testSubdomain}.com`,
    password: 'GuardPass123!'
  });
  if (staffLoginRes.status !== 200) {
    throw new Error('Staff login failed: ' + JSON.stringify(staffLoginRes.body));
  }
  const staffToken = staffLoginRes.body.token; // JWT Token
  console.log('✓ Staff logged in successfully (JWT received).');

  // Verify access with staff JWT
  console.log('\n[Test 7] Verify API access with Staff JWT...');
  const accessRes = await makeRequest('GET', `/api/tenant/attendance?tenant=${testSubdomain}`, null, null, `Bearer ${staffToken}`);
  if (accessRes.status !== 200) {
    throw new Error('Staff API access failed: ' + accessRes.status);
  }
  console.log('✓ Staff API access granted.');

  // Step 8: Tenant Admin deletes Staff
  console.log('\n[Test 8] Tenant Admin Deletes Staff...');
  const deleteStaffRes = await makeRequest('DELETE', `/api/staff/delete/${staffId}?tenant=${testSubdomain}`, null, clientCookie);
  if (deleteStaffRes.status !== 200) {
    throw new Error('Failed to delete staff: ' + JSON.stringify(deleteStaffRes.body));
  }
  console.log('✓ Staff deleted successfully.');

  // Step 9: Staff attempts to access API with revoked token
  console.log('\n[Test 9] Verify Instant Revocation (Staff uses existing JWT)...');
  const revokedAccessRes = await makeRequest('GET', `/api/tenant/attendance?tenant=${testSubdomain}`, null, null, `Bearer ${staffToken}`);
  if (revokedAccessRes.status !== 401) {
    throw new Error(`Revocation failed! Expected 401 Unauthorized, got ${revokedAccessRes.status}`);
  }
  console.log('✓ INSTANT REVOCATION SUCCESSFUL! 401 Unauthorized returned.');

  console.log('\n======================================================');
  console.log('🎉 ALL REVOCATION TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
  process.exit(0);
}

function makeRequest(method, path, body = null, cookie = null, authHeader = null) {
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

    if (cookie) options.headers['Cookie'] = cookie;
    if (authHeader) options.headers['Authorization'] = authHeader;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, body: json, rawBody: data });
      });
    });

    req.on('error', reject);
    if (body) req.write(postData);
    req.end();
  });
}

runTests().catch(err => {
  console.error('\n❌ REVOCATION TEST FAILED:', err);
  process.exit(1);
});
