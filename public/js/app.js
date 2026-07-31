/* ==========================================================================
   SRIJANDEV 3D TECH AGENCY - THREE.JS WEBGL & INTERACTIVE APP SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. THREE.JS 3D INTERACTIVE HERO CANVAS SCENE
     -------------------------------------------------------------------------- */
  const canvasContainer = document.getElementById('threejs-canvas');

  if (canvasContainer && typeof THREE !== 'undefined') {
    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvasContainer.clientWidth / canvasContainer.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    // 2. Geometry: 3D Cyber Sphere & Particle Field
    const sphereGeometry = new THREE.IcosahedronGeometry(1.8, 4);

    // Wireframe Material
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    const cyberSphere = new THREE.Mesh(sphereGeometry, wireframeMaterial);
    scene.add(cyberSphere);

    // Inner Glowing Core
    const coreGeometry = new THREE.IcosahedronGeometry(1.2, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x7b2cbf,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const innerCore = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(innerCore);

    // Particle Cloud Surround
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x00f5a0,
      transparent: true,
      opacity: 0.7
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 3. Mouse Parallax Movement Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - windowHalfX) * 0.0005;
      mouseY = (e.clientY - windowHalfY) * 0.0005;
    });

    // 4. Animation Loop (Hardware Accelerated 60FPS)
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate 3D Geometries
      cyberSphere.rotation.y += 0.004;
      cyberSphere.rotation.x += 0.002;

      innerCore.rotation.y -= 0.006;
      innerCore.rotation.z += 0.003;

      particlesMesh.rotation.y -= 0.001;

      // Smooth Mouse Parallax Damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      cyberSphere.rotation.y += targetX * 0.5;
      cyberSphere.rotation.x += targetY * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // 5. Window Resize Handler
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
     2. PROPOSAL / LEAD CAPTURE FORM HANDLER
     -------------------------------------------------------------------------- */
  const proposalForm = document.getElementById('proposalForm');

  if (proposalForm) {
    proposalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName').value;
      const phone = document.getElementById('phoneNum').value;
      const service = document.getElementById('serviceType').value;

      // Show sleek custom toast notification
      showToast(`Thank you, ${name}! Your inquiry for "${service}" has been logged. Our technical lead will reach out to ${phone} within 2 hours.`);

      proposalForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     3. TOAST NOTIFICATION UTILITY WITH ARIA ACCESSIBILITY
     -------------------------------------------------------------------------- */
  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.8rem;">
        <i class="fa-solid fa-circle-check" style="font-size:1.4rem; color:#00f5a0;"></i>
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

    // Animate In
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);

    // Auto Remove After 5 Seconds
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

});
