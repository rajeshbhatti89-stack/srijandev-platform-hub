const http = require('http');

async function testAllLogins() {
  console.log('\n======================================================================');
  console.log('🧪 TESTING CLIENT PORTAL & SUPER-ADMIN LOGIN FLOWS');
  console.log('======================================================================\n');

  // Test 1: Super-Admin Login
  console.log('[Test 1] Testing Super-Admin Login (/api/admin/login)...');
  const adminRes = await makeRequest('POST', '/api/admin/login', {
    email: 'rajeshbhatti89@gmail.com',
    password: 'SuperAdmin123!'
  });

  if (adminRes.status !== 200 || !adminRes.body.success) {
    throw new Error(`Super-Admin login failed! Got status: ${adminRes.status}, Body: ${JSON.stringify(adminRes.body)}`);
  }
  console.log(`✓ Super-Admin Login PASSED: Welcome ${adminRes.body.user.name} (${adminRes.body.user.role})`);

  // Test 2: Client Portal Login (Apex Admin)
  console.log('\n[Test 2] Testing Client Portal Login (/api/auth/login?tenant=apex)...');
  const clientRes = await makeRequest('POST', '/api/auth/login?tenant=apex', {
    email: 'admin@apex.com',
    password: 'ApexAdmin123!'
  });

  if (clientRes.status !== 200 || !clientRes.body.success) {
    throw new Error(`Client login failed! Got status: ${clientRes.status}, Body: ${JSON.stringify(clientRes.body)}`);
  }
  console.log(`✓ Client Portal Login PASSED: Welcome ${clientRes.body.user.name} (${clientRes.body.user.tenant_subdomain})`);

  // Test 3: Auth Me Session Check with Cookie
  console.log('\n[Test 3] Testing /api/auth/me Session Validation...');
  const meRes = await makeRequest('GET', '/api/auth/me', null, clientRes.headers['set-cookie']);
  if (meRes.status !== 200 || !meRes.body.user) {
    throw new Error(`Session check failed! Status: ${meRes.status}`);
  }
  console.log(`✓ Session Validation PASSED: Authenticated user is ${meRes.body.user.email}`);

  // Test 4: Tenant Analytics API Call
  console.log('\n[Test 4] Testing Tenant Analytics API (/api/tenant/analytics)...');
  const analyticsRes = await makeRequest('GET', '/api/tenant/analytics?tenant=apex', null, clientRes.headers['set-cookie']);
  if (analyticsRes.status !== 200 || !analyticsRes.body.analytics) {
    throw new Error(`Analytics API failed! Status: ${analyticsRes.status}`);
  }
  console.log(`✓ Tenant Analytics PASSED: ${JSON.stringify(analyticsRes.body.analytics)}`);

  console.log('\n======================================================================');
  console.log('🎉 ALL CLIENT PORTAL & SUPER-ADMIN LOGIN FLOWS 100% VERIFIED!');
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

testAllLogins().catch(err => {
  console.error('\n❌ LOGIN TEST FAILED:', err);
  process.exit(1);
});
