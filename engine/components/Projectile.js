import { Component } from "../core/Component.js";
import { Transform } from "./Transform.js";

/**
 * Componente de projétil.
 */
export class Projectile extends Component {
  /**
   * @param {object} options
   * @param {number} options.speed
   * @param {number} options.directionX
   * @param {number} options.directionY
   * @param {import("../core/Entity.js").Entity|null} options.owner
   */
  constructor(options = {}) {
    super();
    this.speed = options.speed ?? 320;
    this.directionX = options.directionX ?? 1;
    this.directionY = options.directionY ?? 0;
    this.owner = options.owner ?? null;
  }

  /**
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    const transform = this.entity.getComponent(Transform);
    if (!transform) return;

    transform.x += this.directionX * this.speed * deltaTime;
    transform.y += this.directionY * this.speed * deltaTime;
  }
}