import { Component } from "../../core/Component.js";
import { Transform3D } from "../components/Transform3D.js";
import { InputSystem } from "../../systems/InputSystem.js";

/**
 * Comportamento de movimentação 3D por teclado (WASD / Setas).
 */
export class KeyboardMovement3D extends Component {
  /**
   * @param {number} [speed=5] Velocidade de movimento
   */
  constructor(speed = 5) {
    super();
    this.speed = speed;
  }

  update(deltaTime) {
    const transform = this.entity.getComponent(Transform3D);
    if (!transform) return;

    let moveX = 0;
    let moveZ = 0;

    if (InputSystem.isKeyDown("KeyW") || InputSystem.isKeyDown("ArrowUp")) moveZ -= 1;
    if (InputSystem.isKeyDown("KeyS") || InputSystem.isKeyDown("ArrowDown")) moveZ += 1;
    if (InputSystem.isKeyDown("KeyA") || InputSystem.isKeyDown("ArrowLeft")) moveX -= 1;
    if (InputSystem.isKeyDown("KeyD") || InputSystem.isKeyDown("ArrowRight")) moveX += 1;

    if (moveX !== 0 || moveZ !== 0) {
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= len;
      moveZ /= len;

      transform.position.x += moveX * this.speed * deltaTime;
      transform.position.z += moveZ * this.speed * deltaTime;

      transform.rotation.y = Math.atan2(moveX, moveZ);
    }
  }
}
