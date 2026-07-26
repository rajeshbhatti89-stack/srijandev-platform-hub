const http = require('http');

async function testMainHostRouting() {
  console.log('\n======================================================');
  console.log('🧪 VERIFYING MAIN HOST DOMAIN ROUTING FIX');
  console.log('======================================================\n');

  // Test 1: srijandev-platform-hub.onrender.com
  const renderHostRes = await makeHostRequest('srijandev-platform-hub.onrender.com', '/');
  if (renderHostRes.status !== 200 || !renderHostRes.rawBody.includes('SrijanDev SaaS Operations & Field Management Hub')) {
    throw new Error(`Render host bypass failed! Status: ${renderHostRes.status}`);
  }
  console.log('✓ Main Host `srijandev-platform-hub.onrender.com` correctly served Public Marketing Hub (index.html).');

  // Test 2: srijandev-platform-hub.up.railway.app
  const railwayHostRes = await makeHostRequest('srijandev-platform-hub.up.railway.app', '/');
  if (railwayHostRes.status !== 200 || !railwayHostRes.rawBody.includes('SrijanDev SaaS Operations & Field Management Hub')) {
    throw new Error(`Railway host bypass failed! Status: ${railwayHostRes.status}`);
  }
  console.log('✓ Main Host `srijandev-platform-hub.up.railway.app` correctly served Public Marketing Hub (index.html).');

  // Test 3: srijandev.in
  const domainHostRes = await makeHostRequest('srijandev.in', '/');
  if (domainHostRes.status !== 200 || !domainHostRes.rawBody.includes('SrijanDev SaaS Operations & Field Management Hub')) {
    throw new Error(`Root domain bypass failed! Status: ${domainHostRes.status}`);
  }
  console.log('✓ Root Domain `srijandev.in` correctly served Public Marketing Hub (index.html).');

  // Test 4: localhost:3000
  const localhostRes = await makeHostRequest('localhost:3000', '/');
  if (localhostRes.status !== 200 || !localhostRes.rawBody.includes('SrijanDev SaaS Operations & Field Management Hub')) {
    throw new Error(`Localhost bypass failed! Status: ${localhostRes.status}`);
  }
  console.log('✓ Localhost `localhost:3000` correctly served Public Marketing Hub (index.html).');

  // Test 5: apex.srijandev.in (Valid Tenant Subdomain)
  const tenantHostRes = await makeHostRequest('apex.srijandev.in', '/');
  if (tenantHostRes.status !== 200 || !tenantHostRes.rawBody.includes('Client Portal | SrijanDev Operations & Management')) {
    throw new Error(`Tenant subdomain resolution failed! Status: ${tenantHostRes.status}`);
  }
  console.log('✓ Valid Tenant Subdomain `apex.srijandev.in` correctly resolved Client Portal (portal.html).');

  // Test 6: nonexistent.srijandev.in (Unknown Tenant Subdomain)
  const unknownTenantRes = await makeHostRequest('nonexistent.srijandev.in', '/');
  if (unknownTenantRes.status !== 404 || !unknownTenantRes.rawBody.includes('Client Portal Not Found')) {
    throw new Error(`Unknown tenant handling failed! Status: ${unknownTenantRes.status}`);
  }
  // Test 7: /auth.html -> 301 Redirect to /
  const authRedirectRes = await makeHostRequest('srijandev.in', '/auth.html');
  if (authRedirectRes.status !== 301 || authRedirectRes.headers.location !== '/') {
    throw new Error(`/auth.html redirect failed! Got status: ${authRedirectRes.status}, Location: ${authRedirectRes.headers.location}`);
  }
  console.log('✓ Request for `/auth.html` correctly redirected with 301 to `/`.');

  console.log('\n======================================================');
  console.log('🎉 MAIN HOST DOMAIN ROUTING FIX VERIFIED 100% CLEAN!');
  console.log('======================================================\n');
  process.exit(0);
}

function makeHostRequest(hostHeader, path = '/') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Host': hostHeader,
        'Accept': 'text/html'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, rawBody: data });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

testMainHostRouting().catch(err => {
  console.error('\n❌ MAIN HOST ROUTING TEST FAILED:', err);
  process.exit(1);
});
