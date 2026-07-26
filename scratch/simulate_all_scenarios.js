const http = require('http');
const { seedDatabase } = require('../services/seed');
const { dbGet, dbAll } = require('../database');

async function runSimulationSuite() {
  console.log('\n======================================================================');
  console.log('🛡️ SRIJANDEV PLATFORM HUB: END-TO-END SIMULATION & SECURITY SUITE');
  console.log('======================================================================\n');

  // Initialize DB & Server
  await seedDatabase();

  let overallSuccess = true;
  const results = [];

  function recordResult(scenario, step, status, details) {
    results.push({ scenario, step, status, details });
    const icon = status === 'PASSED' ? '✅' : '❌';
    console.log(`${icon} [${scenario}] ${step} -> ${status}`);
    if (details) console.log(`   └─ ${details}`);
    if (status === 'FAILED') overallSuccess = false;
  }

  /* ==========================================================================
     👤 SCENARIO 1: SUPER-ADMIN FLOW (Rajesh Bhatti Persona)
     ========================================================================== */
  console.log('\n----------------------------------------------------------------------');
  console.log('👤 SCENARIO 1: SUPER-ADMIN FLOW (Rajesh Bhatti Persona)');
  console.log('----------------------------------------------------------------------');

  const testSubdomain = `apexlogistics${Date.now().toString().slice(-4)}`;
  const clientEmail = `clientadmin@${testSubdomain}.com`;
  const clientPass = 'ApexSecurePass123!';

  // Step 1.1: Submit Public Lead Quotation
  const leadRes = await makeRequest('POST', '/api/leads', {
    full_name: 'Rahul Varma',
    company_name: 'Apex Logistics & Security Solutions',
    email: clientEmail,
    phone: '+91 98765 00001',
    employee_count: 75,
    preferred_subdomain: testSubdomain,
    required_suites: 'Workforce & Security Patrol Suites'
  });

  if (leadRes.status === 201 && leadRes.body.success) {
    recordResult('SCENARIO 1', 'Public Quotation Lead Submission', 'PASSED', `Lead ID ${leadRes.body.leadId} created for '${testSubdomain}'`);
  } else {
    recordResult('SCENARIO 1', 'Public Quotation Lead Submission', 'FAILED', JSON.stringify(leadRes.body));
  }

  // Step 1.2: Super-Admin Login
  const adminLoginRes = await makeRequest('POST', '/api/admin/login', {
    email: 'rajeshbhatti89@gmail.com',
    password: 'SuperAdmin123!'
  });

  let adminCookie = null;
  if (adminLoginRes.status === 200 && adminLoginRes.body.success) {
    adminCookie = adminLoginRes.headers['set-cookie'];
    recordResult('SCENARIO 1', 'Super-Admin Login (Rajesh Bhatti)', 'PASSED', 'Authenticated with Super-Admin privileges');
  } else {
    recordResult('SCENARIO 1', 'Super-Admin Login (Rajesh Bhatti)', 'FAILED', JSON.stringify(adminLoginRes.body));
  }

  // Step 1.3: Fetch & Review Inbound Leads
  const leadsRes = await makeRequest('GET', '/api/admin/leads', null, adminCookie);
  if (leadsRes.status === 200 && Array.isArray(leadsRes.body.leads)) {
    recordResult('SCENARIO 1', 'Inbound Leads Review', 'PASSED', `Fetched ${leadsRes.body.leads.length} lead inquiries`);
  } else {
    recordResult('SCENARIO 1', 'Inbound Leads Review', 'FAILED', JSON.stringify(leadsRes.body));
  }

  // Step 1.4: Manual Client Tenant Provisioning
  const provRes = await makeRequest('POST', '/api/admin/provision', {
    name: 'Apex Logistics & Security Solutions',
    subdomain: testSubdomain,
    contact_email: clientEmail,
    admin_name: 'Rahul Varma',
    admin_password: clientPass,
    enable_workforce: 1,
    enable_patrol: 1,
    lead_id: leadRes.body.leadId
  }, adminCookie);

  let activationTokenUrl = null;
  if (provRes.status === 201 && provRes.body.success) {
    activationTokenUrl = provRes.body.verificationUrl;
    recordResult('SCENARIO 1', 'Manual Client Portal Provisioning', 'PASSED', `Subdomain '${testSubdomain}.srijandev.in' provisioned with Dual Suites`);
  } else {
    recordResult('SCENARIO 1', 'Manual Client Portal Provisioning', 'FAILED', JSON.stringify(provRes.body));
  }

  // Step 1.5: Verification Check (Unverified in DB & Blocked Login)
  const unverifiedUserInDb = await dbGet('SELECT email_verified, verification_token FROM users WHERE email = ?', [clientEmail]);
  if (unverifiedUserInDb && unverifiedUserInDb.email_verified === 0) {
    recordResult('SCENARIO 1', 'Database Verification Status Check', 'PASSED', `User email_verified is strictly 0 in SQLite`);
  } else {
    recordResult('SCENARIO 1', 'Database Verification Status Check', 'FAILED', `User email_verified state incorrect`);
  }

  /* ==========================================================================
     👥 SCENARIO 2: AUTHORIZED CLIENT FLOW (Client Persona)
     ========================================================================== */
  console.log('\n----------------------------------------------------------------------');
  console.log('👥 SCENARIO 2: AUTHORIZED CLIENT FLOW (Client Persona)');
  console.log('----------------------------------------------------------------------');

  // Step 2.1: Open Onboarding Verification Link
  const token = unverifiedUserInDb ? unverifiedUserInDb.verification_token : '';
  const verifyRes = await makeRequest('GET', `/api/auth/verify-email?token=${token}`);
  if (verifyRes.status === 200 && verifyRes.rawBody.includes('Account Verified!')) {
    recordResult('SCENARIO 2', 'Email Verification Activation', 'PASSED', 'Token executed & activation page returned');
  } else {
    recordResult('SCENARIO 2', 'Email Verification Activation', 'FAILED', `HTTP ${verifyRes.status}`);
  }

  // Step 2.2: Confirm DB email_verified = 1
  const verifiedUserInDb = await dbGet('SELECT email_verified FROM users WHERE email = ?', [clientEmail]);
  if (verifiedUserInDb && verifiedUserInDb.email_verified === 1) {
    recordResult('SCENARIO 2', 'DB Activated State Check', 'PASSED', 'User email_verified switched to 1');
  } else {
    recordResult('SCENARIO 2', 'DB Activated State Check', 'FAILED', 'Database state did not update to 1');
  }

  // Step 2.3: Isolated Tenant Login
  const clientLoginRes = await makeRequest('POST', `/api/auth/login?tenant=${testSubdomain}`, {
    email: clientEmail,
    password: clientPass
  });

  let clientCookie = null;
  if (clientLoginRes.status === 200 && clientLoginRes.body.success) {
    clientCookie = clientLoginRes.headers['set-cookie'];
    recordResult('SCENARIO 2', 'Client Isolated Login', 'PASSED', `Logged into portal '${testSubdomain}.srijandev.in'`);
  } else {
    recordResult('SCENARIO 2', 'Client Isolated Login', 'FAILED', JSON.stringify(clientLoginRes.body));
  }

  // Step 2.4: Smart Field Workforce Suite Execution
  const clockRes = await makeRequest('POST', `/api/tenant/attendance/clock?tenant=${testSubdomain}`, {
    type: 'clock_in',
    latitude: 28.6139,
    longitude: 77.2090,
    location_name: 'Delhi Logistics Hub Gate 1'
  }, clientCookie);

  const leaveRes = await makeRequest('POST', `/api/tenant/leaves?tenant=${testSubdomain}`, {
    leave_type: 'casual',
    start_date: '2026-08-10',
    end_date: '2026-08-12',
    reason: 'Family Event'
  }, clientCookie);

  if (clockRes.status === 201 && leaveRes.status === 201) {
    recordResult('SCENARIO 2', 'Smart Field Workforce Suite Execution', 'PASSED', 'Clock-in log & leave request recorded');
  } else {
    recordResult('SCENARIO 2', 'Smart Field Workforce Suite Execution', 'FAILED', `Clock: ${clockRes.status}, Leave: ${leaveRes.status}`);
  }

  // Step 2.5: Security & Patrol Operations Suite Execution
  const cpRes = await makeRequest('POST', `/api/tenant/checkpoints?tenant=${testSubdomain}`, {
    name: 'Checkpoint Gate-1 Main Entrance',
    qr_code_data: 'QR_APEX_GATE_01',
    latitude: 28.6145,
    longitude: 77.2095,
    location_description: 'Building A Perimeter'
  }, clientCookie);

  const cpId = cpRes.body ? cpRes.body.checkpointId : 1;

  const scanRes = await makeRequest('POST', `/api/tenant/scans?tenant=${testSubdomain}`, {
    checkpoint_id: cpId,
    notes: 'Verified main gate lock & perimeter sensors clear'
  }, clientCookie);

  const incidentRes = await makeRequest('POST', `/api/tenant/incidents?tenant=${testSubdomain}`, {
    title: 'Broken Fence Wire',
    description: 'East boundary fence wire damaged near loading bay',
    severity: 'high'
  }, clientCookie);

  if (cpRes.status === 201 && scanRes.status === 201 && incidentRes.status === 201) {
    recordResult('SCENARIO 2', 'Security Patrol Operations Suite Execution', 'PASSED', 'Checkpoint created, QR scan verified & Incident report logged');
  } else {
    recordResult('SCENARIO 2', 'Security Patrol Operations Suite Execution', 'FAILED', `CP: ${cpRes.status}, Scan: ${scanRes.status}, Inc: ${incidentRes.status}`);
  }

  // Step 2.6: Dashboard Analytics Operations
  const analyticsRes = await makeRequest('GET', `/api/tenant/analytics?tenant=${testSubdomain}`, null, clientCookie);
  if (analyticsRes.status === 200 && analyticsRes.body.analytics) {
    const a = analyticsRes.body.analytics;
    recordResult('SCENARIO 2', 'Dashboard Analytics Data Operations', 'PASSED', `Analytics: Attendance=${a.attendance_logs}, Checkpoints=${a.patrol_checkpoints}, Incidents=${a.incident_reports}`);
  } else {
    recordResult('SCENARIO 2', 'Dashboard Analytics Data Operations', 'FAILED', JSON.stringify(analyticsRes.body));
  }

  /* ==========================================================================
     🕵️ SCENARIO 3: UNKNOWN / SECURITY ATTACK SIMULATION (Hacker Persona)
     ========================================================================== */
  console.log('\n----------------------------------------------------------------------');
  console.log('🕵️ SCENARIO 3: UNKNOWN / SECURITY ATTACK SIMULATION (Hacker Persona)');
  console.log('----------------------------------------------------------------------');

  // Step 3.1: Unregistered Email Attack
  const fakeAttackRes = await makeRequest('POST', `/api/auth/login?tenant=${testSubdomain}`, {
    email: 'hacker@unknown.com',
    password: 'WrongPassword123!'
  });

  if (fakeAttackRes.status === 401) {
    recordResult('SCENARIO 3', 'Unregistered Email Attack Block', 'PASSED', 'Access strictly denied with HTTP 401 Unauthorized');
  } else {
    recordResult('SCENARIO 3', 'Unregistered Email Attack Block', 'FAILED', `Unexpected status: ${fakeAttackRes.status}`);
  }

  // Step 3.2: Unverified Account Attack
  const ghostSubdomain = `ghost${Date.now().toString().slice(-4)}`;
  const ghostEmail = `unverified@${ghostSubdomain}.com`;

  await makeRequest('POST', '/api/admin/provision', {
    name: 'Ghost Company',
    subdomain: ghostSubdomain,
    contact_email: ghostEmail,
    admin_name: 'Ghost Admin',
    admin_password: 'GhostPassword123!',
    enable_workforce: 1,
    enable_patrol: 1
  }, adminCookie);

  const unverifiedAttackRes = await makeRequest('POST', `/api/auth/login?tenant=${ghostSubdomain}`, {
    email: ghostEmail,
    password: 'GhostPassword123!'
  });

  if (unverifiedAttackRes.status === 403 && unverifiedAttackRes.body.error === 'Email Not Verified') {
    recordResult('SCENARIO 3', 'Unverified Account Attack Block', 'PASSED', 'Unverified account strictly blocked with HTTP 403 Forbidden');
  } else {
    recordResult('SCENARIO 3', 'Unverified Account Attack Block', 'FAILED', `Unexpected status: ${unverifiedAttackRes.status}`);
  }

  // Step 3.3: Cross-Tenant Access Attack
  const crossTenantAttackRes = await makeRequest('POST', '/api/auth/login?tenant=shield', {
    email: clientEmail, // Credentials for testSubdomain (apexlogistics)
    password: clientPass
  });

  if (crossTenantAttackRes.status === 401 || crossTenantAttackRes.status === 403) {
    recordResult('SCENARIO 3', 'Cross-Tenant Access Attack Block', 'PASSED', `Cross-tenant login blocked with HTTP ${crossTenantAttackRes.status}`);
  } else {
    recordResult('SCENARIO 3', 'Cross-Tenant Access Attack Block', 'FAILED', `Cross-tenant leak detected! HTTP ${crossTenantAttackRes.status}`);
  }

  /* ==========================================================================
     OUTPUT SUMMARY
     ========================================================================== */
  console.log('\n======================================================================');
  console.log('📋 COMPREHENSIVE END-TO-END SIMULATION & SECURITY TEST SUMMARY');
  console.log('======================================================================');

  results.forEach(r => {
    const statusFormatted = r.status === 'PASSED' ? '\x1b[32m[PASSED]\x1b[0m' : '\x1b[31m[FAILED]\x1b[0m';
    console.log(`${r.scenario} | ${r.step.padEnd(45, '.')} ${statusFormatted}`);
  });

  console.log('======================================================================');
  if (overallSuccess) {
    console.log('🎉 ALL 3 SCENARIO SIMULATIONS & SECURITY ATTACK CHECKS PASSED CLEANLY!');
  } else {
    console.log('❌ AT LEAST ONE SIMULATION STEP FAILED. SEE DETAILS ABOVE.');
  }
  console.log('======================================================================\n');

  process.exit(overallSuccess ? 0 : 1);
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

runSimulationSuite().catch(err => {
  console.error('\n❌ SIMULATION SUITE EXECUTION ERROR:', err);
  process.exit(1);
});
