const bcrypt = require('bcryptjs');
const { dbRun, dbGet } = require('../database');

async function seedDatabase() {
  console.log('[Seed] Starting database seeding process...');

  const passwordSaltCost = 12;

  // 1. Seed Super-Admin (Rajesh Bhatti)
  const superAdminEmail = 'rajeshbhatti89@gmail.com';
  const existingSuperAdmin = await dbGet('SELECT id FROM users WHERE lower(email) = lower(?) AND role = "super_admin"', [superAdminEmail]);

  if (!existingSuperAdmin) {
    const hash = await bcrypt.hash('SuperAdmin123!', passwordSaltCost);
    await dbRun(
      `INSERT INTO users (tenant_id, name, email, password_hash, role, email_verified)
       VALUES (NULL, ?, ?, ?, 'super_admin', 1)`,
      ['Rajesh Bhatti', superAdminEmail, hash]
    );
    console.log(`[Seed] Super-Admin created: ${superAdminEmail}`);
  }

  // 2. Seed Sample Tenants
  const sampleTenants = [
    {
      name: 'Apex Field & Security Solutions',
      subdomain: 'apex',
      email: 'admin@apex.com',
      enable_workforce: 1,
      enable_patrol: 1,
      adminName: 'Apex Tenant Admin',
      adminPass: 'ApexAdmin123!',
      primary_color: '#00f2fe',
      enabled_modules: '["dashboard", "staff_management", "patrols", "multi_site_selector"]',
      role_menu_config: '{"staff_management": "Workforce on Duty"}',
      seed_staff: false
    },
    {
      name: 'Shield Patrol Operations',
      subdomain: 'shield',
      email: 'admin@shield.com',
      enable_workforce: 0,
      enable_patrol: 1,
      adminName: 'Shield Patrol Admin',
      adminPass: 'ShieldAdmin123!',
      primary_color: '#a855f7',
      enabled_modules: '["dashboard", "patrols"]',
      role_menu_config: '{}',
      seed_staff: true
    },
    {
      name: 'Logistics Force Operations',
      subdomain: 'logistics',
      email: 'admin@logistics.com',
      enable_workforce: 1,
      enable_patrol: 0,
      adminName: 'Logistics Admin',
      adminPass: 'LogisticsAdmin123!',
      primary_color: '#00f5a0',
      enabled_modules: '["dashboard", "staff_management"]',
      role_menu_config: '{}',
      seed_staff: true
    }
  ];

  for (const t of sampleTenants) {
    let tenant = await dbGet('SELECT id FROM tenants WHERE subdomain = ?', [t.subdomain]);
    if (!tenant) {
      const res = await dbRun(
        `INSERT INTO tenants (name, subdomain, contact_email, enable_workforce, enable_patrol, primary_color, enabled_modules, role_menu_config, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [t.name, t.subdomain, t.email, t.enable_workforce, t.enable_patrol, t.primary_color, t.enabled_modules, t.role_menu_config]
      );
      tenant = { id: res.lastID };
      console.log(`[Seed] Tenant created: ${t.name} (${t.subdomain}.srijandev.in)`);
    }

    // Seed Tenant Admin User
    const existingAdmin = await dbGet(
      'SELECT id FROM users WHERE tenant_id = ? AND lower(email) = lower(?)',
      [tenant.id, t.email]
    );

    if (!existingAdmin) {
      const adminHash = await bcrypt.hash(t.adminPass, passwordSaltCost);
      const userRes = await dbRun(
        `INSERT INTO users (tenant_id, name, email, password_hash, role, email_verified)
         VALUES (?, ?, ?, ?, 'client_admin', 1)`,
        [tenant.id, t.adminName, t.email, adminHash]
      );

      const userId = userRes.lastID;

      // Seed Workforce suite data if enabled and seed_staff is true
      if (t.enable_workforce && t.seed_staff !== false) {
        await dbRun(
          `INSERT INTO attendance_logs (tenant_id, user_id, type, latitude, longitude, location_name)
           VALUES (?, ?, 'clock_in', 28.6139, 77.2090, 'Delhi HQ Main Gate')`,
          [tenant.id, userId]
        );
        await dbRun(
          `INSERT INTO leave_requests (tenant_id, user_id, leave_type, start_date, end_date, reason, status)
           VALUES (?, ?, 'sick', '2026-08-01', '2026-08-02', 'Medical checkup', 'approved')`,
          [tenant.id, userId]
        );
      }

      // Seed Patrol suite data if enabled and seed_staff is true
      if (t.enable_patrol && t.seed_staff !== false) {
        const cpRes = await dbRun(
          `INSERT INTO patrol_checkpoints (tenant_id, name, qr_code_data, latitude, longitude, location_description)
           VALUES (?, 'Checkpoint Alpha - Server Room', 'QR_APEX_CP_001', 28.6145, 77.2095, 'Building A, 2nd Floor')`,
          [tenant.id]
        );

        await dbRun(
          `INSERT INTO patrol_scans (tenant_id, user_id, checkpoint_id, notes, status)
           VALUES (?, ?, ?, 'All clear during night shift patrol', 'verified')`,
          [tenant.id, userId, cpRes.lastID]
        );

        await dbRun(
          `INSERT INTO incident_reports (tenant_id, user_id, title, description, severity, status)
           VALUES (?, ?, 'Minor Water Leak', 'Subtle pipe leak detected near east corridor', 'low', 'open')`,
          [tenant.id, userId]
        );
      }
    }
  }

  // 3. Seed Sample Leads
  const leadCount = await dbGet('SELECT COUNT(*) as count FROM leads');
  if (leadCount.count === 0) {
    await dbRun(
      `INSERT INTO leads (full_name, company_name, email, phone, employee_count, preferred_subdomain, required_suites, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
      ['Amit Kumar', 'Metro Facilities & Security Ltd', 'amit@metrofacilities.com', '+91 98765 43210', 45, 'metro', 'Workforce & Patrol Suites']
    );
    console.log('[Seed] Sample lead created: Metro Facilities');
  }

  console.log('[Seed] Seeding completed successfully.');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Failed]:', err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
