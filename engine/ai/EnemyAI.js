import { Script } from "../components/Script.js";
import { Transform } from "../components/Transform.js";
import { Health } from "../components/Health.js";
import { Weapon } from "../components/Weapon.js";

/**
 * IA simples de perseguição e ataque à distância.
 */
export class EnemyAI extends Script {
  /**
   * @param {object} options
   * @param {number} [options.speed]
   * @param {number} [options.detectionRadius]
   * @param {number} [options.stopDistance]
   * @param {number} [options.attackRadius]
   * @returns {void}
   */
  constructor(options = {}) {
    super();

    /**
     * Velocidade de movimento.
     * @type {number}
     */
    this.speed = options.speed ?? 90;

    /**
     * Distância máxima para detectar o player.
     * @type {number}
     */
    this.detectionRadius = options.detectionRadius ?? 260;

    /**
     * Distância mínima para parar de avançar.
     * @type {number}
     */
    this.stopDistance = options.stopDistance ?? 120;

    /**
     * Distância máxima para atirar.
     * @type {number}
     */
    this.attackRadius = options.attackRadius ?? 220;
  }

  /**
   * Atualiza a IA.
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    const transform = this.entity.getComponent(Transform);
    const health = this.entity.getComponent(Health);
    const weapon = this.entity.getComponent(Weapon);
    const scene = this.entity.scene;

    if (!transform || !scene || health?.isDead) {
      return;
    }

    const player = scene.getEntityByName("Player");
    const playerTransform = player?.getComponent(Transform);
    const playerHealth = player?.getComponent(Health);

    if (!player || !playerTransform || playerHealth?.isDead) {
      return;
    }

    const dx = playerTransform.x - transform.x;
    const dy = playerTransform.y - transform.y;
    const distance = Math.hypot(dx, dy);

    if (distance > this.detectionRadius) {
      return;
    }

    const length = distance || 1;
    const directionX = dx / length;
    const directionY = dy / length;

    if (distance > this.stopDistance) {
      transform.x += directionX * this.speed * deltaTime;
      transform.y += directionY * this.speed * deltaTime;
    }

    if (weapon && distance <= this.attackRadius) {
      weapon.fire(directionX, directionY);
    }
  }
}