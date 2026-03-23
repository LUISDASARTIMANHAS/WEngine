import { InputSystem } from "../../engine/systems/InputSystem.js";
import { Transform } from "../../engine/components/Transform.js";
import { Script } from "../../engine/components/Script.js";
import { Weapon } from "../../engine/components/Weapon.js";

/**
 * Controla movimentação e tiro do player.
 */
export class PlayerController extends Script {
  /**
   * @param {number} speed
   */
  constructor(speed = 180) {
    super();

    /**
     * Velocidade do player.
     * @type {number}
     */
    this.speed = speed;

    /**
     * Última direção horizontal.
     * @type {number}
     */
    this.lastDirectionX = 1;

    /**
     * Última direção vertical.
     * @type {number}
     */
    this.lastDirectionY = 0;
  }

  /**
   * Atualiza player.
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    const transform = this.entity.getComponent(Transform);
    const weapon = this.entity.getComponent(Weapon);

    if (!transform) return;

    let moveX = 0;
    let moveY = 0;

    if (InputSystem.isKeyDown("a") || InputSystem.isKeyDown("arrowleft")) {
      moveX -= 1;
    }

    if (InputSystem.isKeyDown("d") || InputSystem.isKeyDown("arrowright")) {
      moveX += 1;
    }

    if (InputSystem.isKeyDown("w") || InputSystem.isKeyDown("arrowup")) {
      moveY -= 1;
    }

    if (InputSystem.isKeyDown("s") || InputSystem.isKeyDown("arrowdown")) {
      moveY += 1;
    }

    if (moveX !== 0 || moveY !== 0) {
      const length = Math.hypot(moveX, moveY) || 1;
      moveX /= length;
      moveY /= length;

      this.lastDirectionX = moveX;
      this.lastDirectionY = moveY;
    }

    transform.x += moveX * this.speed * deltaTime;
    transform.y += moveY * this.speed * deltaTime;

    if (weapon && InputSystem.isKeyDown(" ")) {
      weapon.fire(this.lastDirectionX, this.lastDirectionY);
    }
  }
}