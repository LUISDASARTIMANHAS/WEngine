import { Component } from "../core/Component.js";
import { Transform } from "./Transform.js";

/**
 * Componente de arma.
 */
export class Weapon extends Component {
  /**
   * @param {object} [options={}]
   * @param {number} [options.damage=10]
   * @param {number} [options.fireRate=0.3]
   * @param {number} [options.projectileSpeed=420]
   */
  constructor(options = {}) {
    super();

    /**
     * Dano do projétil.
     * @type {number}
     */
    this.damage = options.damage ?? 10;

    /**
     * Tempo entre disparos.
     * @type {number}
     */
    this.fireRate = options.fireRate ?? 0.3;

    /**
     * Velocidade do projétil.
     * @type {number}
     */
    this.projectileSpeed = options.projectileSpeed ?? 420;

    /**
     * Tempo restante até poder atirar novamente.
     * @type {number}
     */
    this.cooldown = 0;
  }

  /**
   * Atualiza o cooldown da arma.
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    if (this.cooldown > 0) {
      this.cooldown -= deltaTime;
    }
  }

  /**
   * Atira um projétil.
   * @param {number} directionX
   * @param {number} directionY
   * @returns {void}
   */
  fire(directionX, directionY) {
    if (this.cooldown > 0) {
      return;
    }

    const scene = this.entity.scene;
    const transform = this.entity.getComponent(Transform);

    if (!scene || !transform) {
      return;
    }

    const length = Math.hypot(directionX, directionY);

    if (length <= 0) {
      return;
    }

    const normalizedX = directionX / length;
    const normalizedY = directionY / length;

    const bullet = scene.engine.entityFactory.create("bullet", {
      x: transform.x + transform.width / 2,
      y: transform.y + transform.height / 2,
      directionX: normalizedX,
      directionY: normalizedY,
      speed: this.projectileSpeed,
      damage: this.damage,
      owner: this.entity,
    });

    scene.addEntity(bullet);
    this.cooldown = this.fireRate;
  }
}
