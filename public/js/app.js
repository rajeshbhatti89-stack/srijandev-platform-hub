/* ==========================================================================
   SRIJANDEV 3D TECH AGENCY - THREE.JS 3D CYBER-ROBOT & INTERACTIVE APP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. THREE.JS 3D INTERACTIVE CYBER-ROBOT CANVASES
     -------------------------------------------------------------------------- */
    // Fetch Tenant Config (if on portal)
    if (document.getElementById('tenantPortalView')) {
      fetch('/api/tenant/config')
        .then(async (res) => {
          const text = await res.text();
          try { return text ? JSON.parse(text) : {}; } 
          catch(e) { return {}; }
        })
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
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.clear();
        window.location.href = '/';
      } catch (err) {
        console.error('Logout error', err);
      }
    };

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    // Add Scene Lighting
    const pointLight = new THREE.PointLight(0x00f2fe, 2.5, 12);
    pointLight.position.set(2, 2, 4);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // 2. BUILD 3D CYBER-ROBOT ASSEMBLY GROUP
    const robotGroup = new THREE.Group();

    // A) Robot Head (Angular Cybernetic Helmet)
    const headGeometry = new THREE.BoxGeometry(1.6, 1.4, 1.4);
    const headMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const robotHead = new THREE.Mesh(headGeometry, headMaterial);
    robotGroup.add(robotHead);

    // B) Outer Cyber Helmet Shell (Dodecahedron Shield)
    const helmetShellGeometry = new THREE.DodecahedronGeometry(1.4, 1);
    const helmetShellMaterial = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const helmetShell = new THREE.Mesh(helmetShellGeometry, helmetShellMaterial);
    robotGroup.add(helmetShell);

    // C) Robot Glowing Eyes (Emerald Lenses)
    const eyeGeometry = new THREE.SphereGeometry(0.18, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f5a0,
      transparent: true,
      opacity: 0.95
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.4, 0.2, 0.72);
    robotGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 0.2, 0.72);
    robotGroup.add(rightEye);

    // D) Robot Visor Glowing Core Strip
    const visorGeometry = new THREE.BoxGeometry(1.2, 0.22, 0.1);
    const visorMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.7
    });
    const visor = new THREE.Mesh(visorGeometry, visorMaterial);
    visor.position.set(0, 0.2, 0.68);
    robotGroup.add(visor);

    // E) Cyber Neck & Torso Chassis
    const neckGeometry = new THREE.CylinderGeometry(0.35, 0.45, 0.6, 12);
    const neckMaterial = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.set(0, -1.0, 0);
    robotGroup.add(neck);

    // F) Rotating Orbital Tech Rings
    const ringGeometry1 = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ringMaterial1 = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.5
    });
    const orbitalRing1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
    orbitalRing1.rotation.x = Math.PI / 3;
    robotGroup.add(orbitalRing1);

    const ringGeometry2 = new THREE.TorusGeometry(2.4, 0.015, 16, 100);
    const ringMaterial2 = new THREE.MeshBasicMaterial({
      color: 0x00f5a0,
      transparent: true,
      opacity: 0.4
    });
    const orbitalRing2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
    orbitalRing2.rotation.y = Math.PI / 4;
    robotGroup.add(orbitalRing2);

    scene.add(robotGroup);

    // 3. BACKGROUND CYBER PARTICLE MATRIX
    const particlesCount = 850;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.028,
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.6
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // 4. MOUSE PARALLAX CURSOR TRACKING (Robot Looks at User Cursor)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - windowHalfX) * 0.0008;
      mouseY = (e.clientY - windowHalfY) * 0.0008;
    });

    // 5. HARDWARE ACCELERATED ANIMATION LOOP (60 FPS)
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth Robot Damping & Eye-Tracking Cursor Movement
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      robotGroup.rotation.y = targetX * 1.5;
      robotGroup.rotation.x = targetY * 1.2;

      // Rotate Tech Rings in Opposite Directions
      orbitalRing1.rotation.z += 0.008;
      orbitalRing2.rotation.z -= 0.006;
      particleSystem.rotation.y += 0.0008;

      // Floating Bobbing Effect for Robot Head
      robotGroup.position.y = Math.sin(Date.now() * 0.002) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Window Resize Listener
    window.addEventListener('resize', () => {
      if (!canvasContainer) return;
      const width = canvasContainer.clientWidth;
      const height = canvasContainer.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
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
     -------------------------------------------------------------------------- */
  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.8rem;">
        <i class="fa-solid fa-robot" style="font-size:1.4rem; color:#00f5a0;"></i>
        <div>${message}</div>
      </div>
    `;

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      background: 'rgba(8, 13, 26, 0.95)',
      backdropFilter: 'blur(16px)',
      color: '#ffffff',
      border: '1px solid rgba(0, 245, 160, 0.5)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 245, 160, 0.3)',
      padding: '1rem 1.4rem',
      borderRadius: '16px',
      zIndex: '3000',
      fontSize: '0.9rem',
      maxWidth: '400px',
      transform: 'translateY(100px)',
      opacity: '0',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    });

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

  /* --------------------------------------------------------------------------
     4. STAFF MANAGEMENT (PORTAL API)
     -------------------------------------------------------------------------- */
  
  // Staff table logic
  const staffTableBody = document.getElementById('staffTableBody');
  if (staffTableBody) {
    window.fetchStaff = async function() {
      try {
        const res = await fetch('/api/staff');
        if (res.status === 401 || res.status === 403) return;
        const text = await res.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch(e) {}
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
        console.error('Error fetching staff', e);
      }
    };

    window.handleAddStaffSubmit = async function(e) {
      e.preventDefault();
      const name = document.getElementById('staffName').value;
      const email = document.getElementById('staffEmail').value;
      const password = document.getElementById('staffPassword').value;

      try {
        const res = await fetch('/api/staff/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const text = await res.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch(e) {}
        
        if (!res.ok) {
          alert('Error: ' + (data.error || data.message || `Server Error (${res.status})`));
          return;
        }

        if (data.success) {
          showToast('Staff member added successfully!');
          e.target.reset();
          fetchStaff();
        } else {
          alert('Error: ' + data.error + (data.message ? ' - ' + data.message : ''));
        }
      } catch (err) {
        alert('Failed to add staff');
      }
    };

    window.deleteStaff = async function(id) {
      if (!confirm('Are you sure you want to delete this staff member? This will instantly revoke their mobile app access.')) return;
      try {
        const res = await fetch('/api/staff/delete/' + id, { method: 'DELETE' });
        const text = await res.text();
        let data = {};
        try { data = text ? JSON.parse(text) : {}; } catch(e) {}
        
        if (!res.ok) {
          alert('Error: ' + (data.error || data.message || `Server Error (${res.status})`));
          return;
        }

        if (data.success) {
          showToast('Staff deleted successfully.');
          fetchStaff();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (err) {
        alert('Failed to delete staff');
      }
    };
  }

});
