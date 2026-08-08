import { Component } from "../../core/Component.js";
import { Transform3D } from "../components/Transform3D.js";

/**
 * Componente para rotacionar um objeto 3D continuamente.
 */
export class Rotator3D extends Component {
  constructor(speedX = 0, speedY = 1, speedZ = 0) {
    super();
    this.speedX = speedX;
    this.speedY = speedY;
    this.speedZ = speedZ;
  }

  update(deltaTime) {
    const transform = this.entity.getComponent(Transform3D);
    if (transform) {
      transform.rotation.x += this.speedX * deltaTime;
      transform.rotation.y += this.speedY * deltaTime;
      transform.rotation.z += this.speedZ * deltaTime;
    }
  }
}

/**
 * Componente para flutuar um objeto 3D (Efeito Senoidal no eixo Y).
 */
export class Floating3D extends Component {
  constructor(amplitude = 0.5, speed = 2) {
    super();
    this.amplitude = amplitude;
    this.speed = speed;
    this.initialY = 0;
    this.elapsed = Math.random() * 10;
  }

  start() {
    const transform = this.entity.getComponent(Transform3D);
    if (transform) {
      this.initialY = transform.position.y;
    }
  }

  update(deltaTime) {
    this.elapsed += deltaTime * this.speed;
    const transform = this.entity.getComponent(Transform3D);
    if (transform) {
      transform.position.y = this.initialY + Math.sin(this.elapsed) * this.amplitude;
    }
  }
}
