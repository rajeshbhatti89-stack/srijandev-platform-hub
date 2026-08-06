const canvasContainer = document.getElementById('threeCanvas');
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

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
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

  const clock = new THREE.Clock();
  const animate = () => {
    requestAnimationFrame(animate);
    hubGroup.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.1;
    hubGroup.rotation.y = clock.getElapsedTime() * 0.2;
    renderer.render(scene, camera);
  };
  animate();
}
