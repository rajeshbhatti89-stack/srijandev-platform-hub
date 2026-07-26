const { dbGet } = require('../database');

/**
 * Middleware: Dynamic Subdomain Router & Multi-Tenant Isolator
 * Resolves incoming HTTP host header or fallback dev query parameter to a validated Tenant context.
 */
async function tenantResolver(req, res, next) {
  try {
    const host = req.headers.host || '';
    const queryTenant = req.query.tenant; // Fallback for local dev testing e.g. http://localhost:3000/?tenant=apex
    const headerTenant = req.headers['x-tenant-id'];

    let detectedSubdomain = null;

    if (queryTenant) {
      detectedSubdomain = queryTenant.toLowerCase().trim();
    } else if (headerTenant) {
      detectedSubdomain = headerTenant.toLowerCase().trim();
    } else if (host) {
      const hostname = host.split(':')[0].toLowerCase();

      // Main Domain Bypass Check: If host is root platform, localhost, IP, or cloud host app name (e.g. srijandev-platform-hub.onrender.com)
      const isMainSiteHost =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === 'srijandev.in' ||
        hostname === 'www.srijandev.in' ||
        hostname.includes('srijandev-platform-hub') ||
        (hostname.endsWith('.onrender.com') && hostname.startsWith('srijandev-platform-hub')) ||
        (hostname.endsWith('.vercel.app') && hostname.startsWith('srijandev-platform-hub')) ||
        (hostname.endsWith('.railway.app') && hostname.startsWith('srijandev-platform-hub'));

      if (!isMainSiteHost) {
        const parts = hostname.split('.');

        if (
          parts.length > 1 &&
          !['www', 'localhost', 'srijandev', 'srijandev-platform-hub', '127', '0'].includes(parts[0])
        ) {
          detectedSubdomain = parts[0];
        }
      }
    }

    if (!detectedSubdomain) {
      req.isMainHub = true;
      req.isMainSite = true;
      req.tenant = null;
      return next();
    }

    // Lookup Tenant in SQLite Database
    const tenant = await dbGet(
      'SELECT id, name, subdomain, contact_email, enable_workforce, enable_patrol, status FROM tenants WHERE lower(subdomain) = ?',
      [detectedSubdomain]
    );

    if (!tenant) {
      if (req.accepts('json')) {
        return res.status(404).json({
          error: 'Tenant Not Found',
          message: `The client portal '${detectedSubdomain}.srijandev.in' does not exist or is inactive.`
        });
      }
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Client Portal Not Found - SrijanDev</title>
          <style>
            body { background: #0b0f19; color: #f9fafb; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1f2937; padding: 2.5rem; border-radius: 14px; max-width: 500px; text-align: center; border: 1px solid #374151; }
            h1 { color: #f43f5e; margin-top: 0; }
            p { color: #9ca3af; line-height: 1.6; }
            a { color: #3b82f6; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Portal Not Found</h1>
            <p>The client portal <strong>${detectedSubdomain}.srijandev.in</strong> was not found or has been disabled.</p>
            <p><a href="http://localhost:3000">Return to SrijanDev Showcase Site</a></p>
          </div>
        </body>
        </html>
      `);
    }

    if (tenant.status !== 'active') {
      return res.status(403).json({
        error: 'Portal Suspended',
        message: 'Your client portal is currently suspended. Please contact SrijanDev support.'
      });
    }

    // Attach Tenant Context to Request
    req.isMainHub = false;
    req.isMainSite = false;
    req.isTenantPortal = true;
    req.tenant = {
      ...tenant,
      enable_workforce: Boolean(tenant.enable_workforce),
      enable_patrol: Boolean(tenant.enable_patrol)
    };
    req.tenantId = tenant.id;

    next();
  } catch (err) {
    console.error('[Tenant Resolver Error]:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

/**
 * Middleware: Enforces Feature Flag Access
 */
function requireFeature(featureName) {
  return (req, res, next) => {
    if (!req.tenant) {
      return res.status(400).json({ error: 'Feature check requires a tenant context.' });
    }
    if (!req.tenant[featureName]) {
      return res.status(403).json({
        error: 'Feature Disabled',
        message: `This feature suite ('${featureName}') is not enabled for your client portal tier.`
      });
    }
    next();
  };
}

module.exports = {
  tenantResolver,
  requireFeature
};
