import { Vector3 } from "../utils/Math3D.js";

/**
 * Controle de Câmera 3D Interativo via Mouse (Orbita, Panorâmica e Zoom).
 */
export class OrbitControls3D {
  /**
   * @param {import("./Camera3D.js").Camera3D} camera3D
   * @param {HTMLCanvasElement} domElement
   */
  constructor(camera3D, domElement) {
    this.camera = camera3D;
    this.domElement = domElement;

    this.enabled = true;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };

    this.spherical = {
      radius: 12,
      theta: Math.PI / 4, // Rotação Azimutal
      phi: Math.PI / 3,   // Rotação Polar
    };

    this.minRadius = 2;
    this.maxRadius = 100;
    this.minPhi = 0.05;
    this.maxPhi = Math.PI - 0.05;

    this.rotateSpeed = 0.005;
    this.zoomSpeed = 0.002;

    this.initEvents();
    this.updateCameraPosition();
  }

  initEvents() {
    const el = this.domElement;

    el.addEventListener("mousedown", (e) => {
      if (!this.enabled) return;
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.enabled || !this.isDragging) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.spherical.theta -= deltaX * this.rotateSpeed;
      this.spherical.phi -= deltaY * this.rotateSpeed;

      this.spherical.phi = Math.max(this.minPhi, Math.min(this.maxPhi, this.spherical.phi));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      this.updateCameraPosition();
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    el.addEventListener("wheel", (e) => {
      if (!this.enabled) return;
      e.preventDefault();

      this.spherical.radius += e.deltaY * this.zoomSpeed * (this.spherical.radius * 0.1);
      this.spherical.radius = Math.max(this.minRadius, Math.min(this.maxRadius, this.spherical.radius));
      this.updateCameraPosition();
    }, { passive: false });
  }

  updateCameraPosition() {
    const r = this.spherical.radius;
    const sinPhi = Math.sin(this.spherical.phi);
    const cosPhi = Math.cos(this.spherical.phi);
    const sinTheta = Math.sin(this.spherical.theta);
    const cosTheta = Math.cos(this.spherical.theta);

    const target = this.camera.target;

    this.camera.position.x = target.x + r * sinPhi * sinTheta;
    this.camera.position.y = target.y + r * cosPhi;
    this.camera.position.z = target.z + r * sinPhi * cosTheta;
  }
}
