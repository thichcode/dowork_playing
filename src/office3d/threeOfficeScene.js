import * as THREE_DEFAULT from 'three';

export class ThreeOfficeScene {
  constructor(options = {}) {
    this.THREE = options.THREE || THREE_DEFAULT;
    this.canvas = options.canvas || null;
    this.container = options.container || null;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Isometric camera parameters
    this.orbitDistance = 38;
    this.azimuthAngle = Math.PI / 4; // 45 degrees
    this.polarAngle = Math.PI / 3.2;  // ~56 degrees elevation
    this.target = { x: 0, y: 0, z: 0 };

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
  }

  init(canvas, container) {
    const THREE = this.THREE;
    this.canvas = canvas || this.canvas;
    this.container = container || this.container;
    if (!this.canvas) return;

    // 1. Create Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d);

    // 2. Setup Camera
    const width = this.container ? this.container.clientWidth : (this.canvas.width || 800);
    const height = this.container ? this.container.clientHeight : (this.canvas.height || 600);
    const aspect = width / (height || 1);

    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    this.updateCameraPosition();

    // 3. Setup WebGL Renderer
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } catch (e) {
      console.warn('WebGL initialization fallback:', e);
    }

    // 4. Setup Lighting
    this.setupLighting();

    // 5. Setup Mouse Controls
    this.bindMouseControls();

    // 6. Handle Window Resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.onResize());
    }
  }

  setupLighting() {
    const THREE = this.THREE;
    if (!this.scene) return;

    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0xe0e7ff, 0.65);
    this.scene.add(ambientLight);

    // Main Directional Sun Light (Sims window sunlight)
    const dirLight = new THREE.DirectionalLight(0xfffbeb, 0.9);
    dirLight.position.set(25, 45, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    this.scene.add(dirLight);

    // Fill Soft Blue Light from opposite corner
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.35);
    fillLight.position.set(-25, 20, -20);
    this.scene.add(fillLight);

    // Accent PointLight in Server Room
    const serverLight = new THREE.PointLight(0x0ea5e9, 1.2, 18);
    serverLight.position.set(-10, 3, -8);
    this.scene.add(serverLight);

    // Warm PointLight in Pantry
    const pantryLight = new THREE.PointLight(0xf59e0b, 1.0, 18);
    pantryLight.position.set(12, 3, -8);
    this.scene.add(pantryLight);
  }

  updateCameraPosition() {
    if (!this.camera) return;

    // Spherical coordinates around target
    const x = this.target.x + this.orbitDistance * Math.sin(this.polarAngle) * Math.sin(this.azimuthAngle);
    const y = this.target.y + this.orbitDistance * Math.cos(this.polarAngle);
    const z = this.target.z + this.orbitDistance * Math.sin(this.polarAngle) * Math.cos(this.azimuthAngle);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target.x, this.target.y, this.target.z);
  }

  setTarget(x, y, z, smooth = true) {
    if (smooth) {
      this.target.x += (x - this.target.x) * 0.1;
      this.target.y += (y - this.target.y) * 0.1;
      this.target.z += (z - this.target.z) * 0.1;
    } else {
      this.target.x = x;
      this.target.y = y;
      this.target.z = z;
    }
    this.updateCameraPosition();
  }

  bindMouseControls() {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      // Rotate azimuth (yaw)
      this.azimuthAngle -= deltaX * 0.005;

      // Rotate polar (pitch) clamped between 20° and 80°
      this.polarAngle = Math.max(0.35, Math.min(Math.PI / 2.1, this.polarAngle - deltaY * 0.005));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      this.updateCameraPosition();
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      // Zoom in/out clamped between 15 and 65
      this.orbitDistance = Math.max(15, Math.min(65, this.orbitDistance + e.deltaY * 0.03));
      this.updateCameraPosition();
    }, { passive: false });
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / (height || 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
