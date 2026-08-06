let tenants = [];

async function apiCall(url, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    console.error('Failed to parse JSON response', text);
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || `Server Error (${response.status})`);
  }
  return data;
}

function showToast(message, type = 'success') {
  const alertContainer = document.getElementById('alertContainer');
  const alert = document.createElement('div');
  alert.style.padding = '1rem';
  alert.style.marginBottom = '1rem';
  alert.style.borderRadius = '8px';
  alert.style.color = '#fff';
  alert.style.background = type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)';
  alert.innerText = message;
  alertContainer.appendChild(alert);
  setTimeout(() => alert.remove(), 4000);
}

// Ensure login works and we are super admin
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    await apiCall('/api/admin/login', 'POST', { email, password });
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('superAdminView').style.display = 'block';
    document.getElementById('btnLogout').style.display = 'block';
    fetchTenants();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleLogout() {
  try {
    await apiCall('/api/auth/logout', 'POST');
    localStorage.clear();
    window.location.reload();
  } catch (err) {
    showToast('Logout failed: ' + err.message, 'error');
  }
}

// Verify session on load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await apiCall('/api/auth/me');
    if (data.user && data.user.role === 'super_admin') {
      document.getElementById('loginModal').style.display = 'none';
      document.getElementById('superAdminView').style.display = 'block';
      document.getElementById('btnLogout').style.display = 'block';
      fetchTenants();
    }
  } catch (e) {
    // Not logged in, modal remains visible
  }
});

function switchAdminTab(tab) {
  // We only have one tab right now, but for future proofing
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('adminTab' + (tab.charAt(0).toUpperCase() + tab.slice(1))).classList.add('active');
}

async function fetchTenants() {
  try {
    const res = await apiCall('/api/admin/tenants');
    tenants = res.tenants || [];
    renderTenants();
  } catch (e) {
    showToast('Failed to fetch tenants', 'error');
  }
}

function renderTenants() {
  const tbody = document.getElementById('tenantsTableBody');
  tbody.innerHTML = '';
  tenants.forEach(t => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.id}</td>
      <td><strong>${t.name}</strong></td>
      <td>${t.subdomain}.srijandev.in</td>
      <td>
        <div style="width:24px; height:24px; border-radius:50%; background:${t.primary_color || '#3b82f6'}"></div>
      </td>
      <td><span class="badge ${t.status === 'active' ? 'badge-emerald' : 'badge-rose'}">${t.status}</span></td>
      <td>
        <button class="btn btn-primary btn-sm" onclick="editTenant(${t.id})">Edit</button>
        <button class="btn btn-secondary btn-sm" onclick="deleteTenant(${t.id})" style="color:var(--accent-rose); border-color:var(--accent-rose);">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function openTenantModal(tenantId = null) {
  document.getElementById('tenantForm').reset();
  document.getElementById('tId').value = '';
  document.getElementById('tLogoUrl').value = '';
  document.getElementById('logoPreview').innerHTML = '';
  document.getElementById('tMenuConfig').value = '{}';

  // Check all checkboxes by default for new
  document.querySelectorAll('#moduleToggles input[type="checkbox"]').forEach(cb => {
    cb.checked = ['dashboard', 'staff_management', 'patrols'].includes(cb.value);
  });

  if (tenantId) {
    const t = tenants.find(x => x.id === tenantId);
    if (t) {
      document.getElementById('tenantModalTitle').innerText = 'Edit Organization: ' + t.name;
      document.getElementById('tId').value = t.id;
      document.getElementById('tName').value = t.name;
      document.getElementById('tSubdomain').value = t.subdomain;
      document.getElementById('tEmail').value = t.contact_email;
      document.getElementById('tAdminName').value = ''; 
      
      document.getElementById('tAdminName').parentElement.style.display = 'none'; // hide for edit
      document.getElementById('tPassword').placeholder = 'Unchanged';

      if (t.logo_url) {
        document.getElementById('tLogoUrl').value = t.logo_url;
        document.getElementById('logoPreview').innerHTML = `<img src="${t.logo_url}" style="height:40px;">`;
      }
      if (t.primary_color) document.getElementById('tColor').value = t.primary_color;
      if (t.custom_title) document.getElementById('tTitle').value = t.custom_title;
      if (t.role_menu_config) document.getElementById('tMenuConfig').value = t.role_menu_config;

      if (t.enabled_modules) {
        try {
          const mods = JSON.parse(t.enabled_modules);
          document.querySelectorAll('#moduleToggles input[type="checkbox"]').forEach(cb => {
            cb.checked = mods.includes(cb.value);
          });
        } catch (e) {}
      }
    }
  } else {
    document.getElementById('tenantModalTitle').innerText = 'Create New Organization';
    document.getElementById('tAdminName').parentElement.style.display = 'block';
    document.getElementById('tPassword').placeholder = '';
  }

  document.getElementById('tenantModal').style.display = 'flex';
}

function closeTenantModal() {
  document.getElementById('tenantModal').style.display = 'none';
}

function encodeImageToBase64(element) {
  const file = element.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = function() {
    document.getElementById('tLogoUrl').value = reader.result;
    document.getElementById('logoPreview').innerHTML = `<img src="${reader.result}" style="height:40px;">`;
  }
  reader.readAsDataURL(file);
}

async function handleTenantSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('tId').value;
  
  // Collect modules
  const enabled_modules = [];
  document.querySelectorAll('#moduleToggles input[type="checkbox"]:checked').forEach(cb => {
    enabled_modules.push(cb.value);
  });

  let role_menu_config;
  try {
    role_menu_config = JSON.parse(document.getElementById('tMenuConfig').value || '{}');
  } catch (e) {
    showToast('Invalid JSON in Menu Relabeling Config', 'error');
    return;
  }

  const payload = {
    logo_url: document.getElementById('tLogoUrl').value,
    primary_color: document.getElementById('tColor').value,
    custom_title: document.getElementById('tTitle').value,
    enabled_modules,
    role_menu_config,
    enable_workforce: enabled_modules.includes('staff_management'),
    enable_patrol: enabled_modules.includes('patrols')
  };

  try {
    if (id) {
      // Update
      await apiCall(`/api/admin/tenants/${id}`, 'PUT', payload);
      showToast('Tenant updated successfully!');
    } else {
      // Create
      payload.name = document.getElementById('tName').value;
      payload.subdomain = document.getElementById('tSubdomain').value;
      payload.contact_email = document.getElementById('tEmail').value;
      payload.admin_name = document.getElementById('tAdminName').value;
      payload.admin_password = document.getElementById('tPassword').value;
      
      await apiCall('/api/admin/provision', 'POST', payload);
      showToast('Tenant created successfully!');
    }
    closeTenantModal();
    fetchTenants();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

function editTenant(id) {
  openTenantModal(id);
}

async function deleteTenant(id) {
  if (!confirm('Are you sure you want to permanently delete this tenant?')) return;
  try {
    await apiCall(`/api/admin/tenants/${id}`, 'DELETE');
    showToast('Tenant deleted.');
    fetchTenants();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
