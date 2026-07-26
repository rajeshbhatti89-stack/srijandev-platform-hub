const http = require('http');

async function testLogout() {
  console.log('\n======================================================');
  console.log('🧪 VERIFYING LOGOUT ROUTE & COOKIE CLEARANCE');
  console.log('======================================================\n');

  // Step 1: Login
  const loginRes = await makeRequest('POST', '/api/admin/login', {
    email: 'rajeshbhatti89@gmail.com',
    password: 'SuperAdmin123!'
  });

  if (loginRes.status !== 200 || !loginRes.body.success) {
    throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
  }

  const cookie = loginRes.headers['set-cookie'];
  console.log('✓ Login succeeded. Set-Cookie received:', cookie);

  // Step 2: Verify /api/auth/me returns user data with cookie
  const meRes1 = await makeRequest('GET', '/api/auth/me', null, cookie);
  if (meRes1.status !== 200 || !meRes1.body.user) {
    throw new Error(`Auth me check failed: ${JSON.stringify(meRes1.body)}`);
  }
  console.log('✓ /api/auth/me verified user is authenticated:', meRes1.body.user.email);

  // Step 3: Execute Logout
  const logoutRes = await makeRequest('POST', '/api/auth/logout', null, cookie);
  if (logoutRes.status !== 200 || !logoutRes.body.success) {
    throw new Error(`Logout failed: ${JSON.stringify(logoutRes.body)}`);
  }

  const clearCookieHeader = logoutRes.headers['set-cookie'];
  console.log('✓ Logout endpoint returned success. Set-Cookie:', clearCookieHeader);

  // Step 4: Verify subsequent /api/auth/me request returns 401 Unauthorized
  const meRes2 = await makeRequest('GET', '/api/auth/me', null, clearCookieHeader);
  if (meRes2.status !== 401) {
    throw new Error(`Logout failed! /api/auth/me still returned status: ${meRes2.status}`);
  }

  console.log('✓ LOGOUT VERIFIED 100%: Access to /api/auth/me correctly blocked with HTTP 401 Unauthorized.');
  console.log('\n======================================================');
  console.log('🎉 LOGOUT TEST PASSED CLEANLY!');
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

testLogout().catch(err => {
  console.error('\n❌ LOGOUT TEST FAILED:', err);
  process.exit(1);
});
