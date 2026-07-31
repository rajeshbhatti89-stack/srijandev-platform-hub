/* ==========================================================================
   SRIJANDEV 3D TECH AGENCY - THREE.JS CYBER PARTICLE & INTERACTIVE APP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. THREE.JS 3D AMBIENT CYBER PARTICLE FIELD
     -------------------------------------------------------------------------- */
  const canvasContainer = document.getElementById('threejs-canvas');

  if (canvasContainer && typeof THREE !== 'undefined') {
    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvasContainer.clientWidth / canvasContainer.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    // 2. AMBIENT CYBER PARTICLE MATRIX
    const particlesCount = 950;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 14;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.65
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // 3. MOUSE PARALLAX CURSOR TRACKING
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - windowHalfX) * 0.0006;
      mouseY = (e.clientY - windowHalfY) * 0.0006;
    });

    // 4. HARDWARE ACCELERATED ANIMATION LOOP (60 FPS)
    const animate = () => {
      requestAnimationFrame(animate);

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particleSystem.rotation.y += 0.001 + targetX * 0.2;
      particleSystem.rotation.x = targetY * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    // 5. Window Resize Listener
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
        <i class="fa-solid fa-check-circle" style="font-size:1.4rem; color:#00f5a0;"></i>
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

});
