/* ==========================================================================
   SRIJANDEV 3D TECH AGENCY - THREE.JS 3D CYBER-ROBOT & INTERACTIVE APP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. THREE.JS 3D INTERACTIVE CYBER-ROBOT CANVASES
     -------------------------------------------------------------------------- */
    // Constants moved to helpers.js
    // Fetch Tenant Config (if on portal)
    if (document.getElementById('tenantPortalView')) {
      apiCall('/api/tenant/config')
        .then(data => {
          if (data.tenant_id) {
            window.tenantConfig = data;
            applyTenantCustomization(data);
          }
        })
        .catch(console.error);
    }


    function applyTenantCustomization(config) {
      // 1. Branding
      const titleEl = document.getElementById('portalHeaderTitle');
      if (titleEl && config.custom_title) titleEl.innerText = config.custom_title;

      const tenantTitle = document.getElementById('tenantTitle');
      if (tenantTitle) tenantTitle.innerText = config.name;

      const badge = document.getElementById('tenantSubdomainBadge');
      if (badge) badge.innerText = config.subdomain + '.srijandev.in';

      if (config.primary_color) {
        document.documentElement.style.setProperty('--accent-cyan', config.primary_color);
        document.documentElement.style.setProperty('--accent-emerald', config.primary_color);
      }

      const logoContainer = document.querySelector('.brand-logo');
      if (logoContainer && config.logo_url) {
        logoContainer.innerHTML = `<img src="${config.logo_url}" style="height:32px; border-radius:4px;">`;
        logoContainer.style.background = 'transparent';
      }

      // 2. Dynamic Modules/Tabs
      const tabsContainer = document.getElementById('clientTabsContainer');
      const tabs = [];
      const labels = config.role_menu_config || {};

      if (config.enabled_modules.includes('dashboard')) {
        tabs.push(`<button class="tab-btn" id="tabBtnDashboard" onclick="switchClientTab('Dashboard')">📊 ${labels['dashboard'] || 'Dashboard'}</button>`);
      }
      
      if (config.enabled_modules.includes('staff_management')) {
        tabs.push(`<button class="tab-btn" id="tabBtnStaff" onclick="switchClientTab('Staff'); fetchStaff();">👥 ${labels['staff_management'] || 'Staff Management'}</button>`);
      }

      if (config.enabled_modules.includes('patrols')) {
        tabs.push(`<button class="tab-btn" id="tabBtnPatrol" onclick="switchClientTab('Patrol')">🛡️ ${labels['patrols'] || 'Security & Patrols'}</button>`);
      }

      if (config.enabled_modules.includes('multi_site_selector')) {
        tabs.push(`<button class="tab-btn" id="tabBtnSites" onclick="switchClientTab('Sites')">🏢 ${labels['multi_site_selector'] || 'Multi-Site Locations'}</button>`);
      }

      if (tabsContainer) {
        tabsContainer.innerHTML = tabs.join('');
        // Make the first available tab active by default
        const firstTab = tabsContainer.querySelector('.tab-btn');
        if (firstTab) firstTab.click();
      }

      // Hide disabled DOM sections completely
      const staffTabContent = document.getElementById('clientTabStaff');
      if (staffTabContent && !config.enabled_modules.includes('staff_management')) staffTabContent.remove();

      const patrolTabContent = document.getElementById('clientTabPatrol');
      if (patrolTabContent && !config.enabled_modules.includes('patrols')) patrolTabContent.remove();
    }

    window.switchClientTab = function(tabName) {
      document.querySelectorAll('#tenantPortalView .tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('#clientTabsContainer .tab-btn').forEach(el => el.classList.remove('active'));
      
      const content = document.getElementById('clientTab' + tabName);
      const btn = document.getElementById('tabBtn' + tabName);
      
      if (content) content.classList.add('active');
      if (btn) btn.classList.add('active');
    };

    // Logout handling for portal
    window.handleClientLogout = async function() {
      try {
        await apiCall('/api/auth/logout', 'POST');
        localStorage.clear();
        window.location.href = '/';
      } catch (err) {
        console.error('Logout error', err);
      }
    };

    const canvasContainer = document.getElementById('threejs-canvas');
    if (canvasContainer) {
      canvasContainer.innerHTML = '';
      const scene = new THREE.Scene();
      const aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
      const d = 8;
      const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
      camera.position.set(10, 10, 10);
      camera.lookAt(scene.position);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      canvasContainer.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);

      const hubGroup = new THREE.Group();
      const hubGeo = new THREE.CylinderGeometry(2, 2, 0.8, 32);
      const hubMat = new THREE.MeshStandardMaterial({ color: 0x092520, metalness: 0.7 });
      hubGroup.add(new THREE.Mesh(hubGeo, hubMat));

      const ringGeo = new THREE.TorusGeometry(2.1, 0.08, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff66 });
      const glowingRing = new THREE.Mesh(ringGeo, ringMat);
      glowingRing.rotation.x = Math.PI / 2;
      hubGroup.add(glowingRing);
      scene.add(hubGroup);

      const animate = () => {
        requestAnimationFrame(animate);
        hubGroup.position.y = Math.sin(Date.now() * 0.002) * 0.1;
        hubGroup.rotation.y += 0.005;
        renderer.render(scene, camera);
      };
      animate();
    }

  /* --------------------------------------------------------------------------
     2. FORM SUBMISSION HANDLERS WITH ACCESSIBLE TOASTS
     -------------------------------------------------------------------------- */
  const proposalForm = document.getElementById('proposalForm');
  if (proposalForm) {
    proposalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName').value;
      const phone = document.getElementById('phoneNum').value;
      const service = document.getElementById('serviceType').value;

      showToast(`Thank you, ${name}! Your proposal request for "${service}" has been received. Our team will reach out to ${phone} within 2 hours.`);
      proposalForm.reset();
    });
  }

  const contactPageForm = document.getElementById('contactPageForm');
  if (contactPageForm) {
    contactPageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName').value;
      const phone = document.getElementById('cPhone').value;
      const service = document.getElementById('cService').value;

      showToast(`Thank you, ${name}! Message logged for "${service}". We will contact you at ${phone} or contact@srijandev.in shortly.`);
      contactPageForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     3. TOAST NOTIFICATION UTILITY (ARIA LIVE REGION)
     -- MOVED TO helpers.js --
     -------------------------------------------------------------------------- */

  /* --------------------------------------------------------------------------
     4. STAFF MANAGEMENT (PORTAL API)
     -------------------------------------------------------------------------- */
  
  // Staff table logic
  const staffTableBody = document.getElementById('staffTableBody');
  if (staffTableBody) {
    window.fetchStaff = async function() {
      try {
        const data = await apiCall('/api/staff');
        if (data.staff) {
          staffTableBody.innerHTML = data.staff.map(s => `
            <tr>
              <td>${s.name}</td>
              <td>${s.email}</td>
              <td><span class="badge badge-emerald">${s.role}</span></td>
              <td>${new Date(s.created_at).toLocaleDateString()}</td>
              <td><button class="btn btn-secondary btn-sm" style="color: var(--accent-rose); border-color: var(--accent-rose);" onclick="deleteStaff(${s.id})">Delete</button></td>
            </tr>
          `).join('');
        }
      } catch (e) {
        if (!e.message.includes('401') && !e.message.includes('403')) {
          console.error('Error fetching staff', e);
        }
      }
    };

    window.handleAddStaffSubmit = async function(e) {
      e.preventDefault();
      const name = document.getElementById('staffName').value;
      const email = document.getElementById('staffEmail').value;
      const password = document.getElementById('staffPassword').value;

      try {
        const data = await apiCall('/api/staff/add', 'POST', { name, email, password });
        if (data.success) {
          showToast('Staff member added successfully!');
          e.target.reset();
          fetchStaff();
        } else {
          showToast('Error: ' + data.error + (data.message ? ' - ' + data.message : ''), 'error');
        }
      } catch (err) {
        showToast(err.message || 'Failed to add staff', 'error');
      }
    };

    window.deleteStaff = async function(id) {
      if (!confirm('Are you sure you want to delete this staff member? This will instantly revoke their mobile app access.')) return;
      try {
        const data = await apiCall(`/api/staff/delete/${id}`, 'DELETE');
        if (data.success) {
          showToast('Staff deleted successfully.');
          fetchStaff();
        } else {
          showToast('Error: ' + data.error, 'error');
        }
      } catch (err) {
        showToast(err.message || 'Failed to delete staff', 'error');
      }
    };
  }

});
