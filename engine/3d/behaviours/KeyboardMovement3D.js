import { Component } from "../../core/Component.js";
import { Transform3D } from "../components/Transform3D.js";
import { Velocity3D } from "../components/Velocity3D.js";
import { Collider3D } from "../components/Collider3D.js";
import { InputSystem } from "../../systems/InputSystem.js";
import { Vector3 } from "../utils/Math3D.js";

/**
 * Comportamento de movimentação 3D por teclado com física (WASD / Setas + ESPAÇO para pular).
 */
export class KeyboardMovement3D extends Component {
  /**
   * @param {number} [speed=5] Velocidade de movimento
   * @param {number} [jumpForce=7] Força de pulo
   * @param {number} [groundDrag=0.15] Drag enquanto no chão
   * @param {number} [airDrag=0.08] Drag enquanto no ar
   */
  constructor(speed = 5, jumpForce = 7, groundDrag = 0.15, airDrag = 0.08) {
    super();
    this.speed = speed;
    this.jumpForce = jumpForce;
    this.groundDrag = groundDrag;
    this.airDrag = airDrag;
    this.lastGroundY = 0;
    this.isGrounded = false;
    this.groundThreshold = 0.01; // Distância mínima para estar no chão
  }

  update(deltaTime) {
    const transform = this.entity.getComponent(Transform3D);
    const velocity = this.entity.getComponent(Velocity3D);
    const collider = this.entity.getComponent(Collider3D);

    if (!transform || !velocity || collider?.isStatic) return;

    // Detectar se está no chão
    this.checkGrounded(transform, collider);

    // Aplicar drag diferente baseado no estado
    velocity.drag = this.isGrounded ? this.groundDrag : this.airDrag;

    // Entrada de movimento (WASD / Setas)
    let moveX = 0;
    let moveZ = 0;

    const forwardKeys = ["w", "keyw", "arrowup"];
    const backKeys = ["s", "keys", "arrowdown"];
    const leftKeys = ["a", "keya", "arrowleft"];
    const rightKeys = ["d", "keyd", "arrowright"];
    const jumpKeys = ["space", " "];
    const descendKeys = ["shift", "shiftleft", "shiftright"];

    if (this.#isAnyKeyDown(forwardKeys)) moveZ -= 1;
    if (this.#isAnyKeyDown(backKeys)) moveZ += 1;
    if (this.#isAnyKeyDown(leftKeys)) moveX -= 1;
    if (this.#isAnyKeyDown(rightKeys)) moveX += 1;

    // Debug: mostrar teclas pressionadas no console (throttle para não spammar)
    if ((moveX !== 0 || moveZ !== 0) && Math.random() < 0.05) {
      console.log(`[Movement3D] Keys: W=${this.#isAnyKeyDown(forwardKeys)}, S=${this.#isAnyKeyDown(backKeys)}, A=${this.#isAnyKeyDown(leftKeys)}, D=${this.#isAnyKeyDown(rightKeys)}, Space=${this.#isAnyKeyDown(jumpKeys)}, Shift=${this.#isAnyKeyDown(descendKeys)}`);
    }

    // Normalizar vetor de movimento
    if (moveX !== 0 || moveZ !== 0) {
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= len;
      moveZ /= len;

      // Aplicar força de movimento
      const force = new Vector3(
        moveX * this.speed,
        0,
        moveZ * this.speed
      );
      velocity.addForce(force);

      // Rotacionar para a direção do movimento
      transform.rotation.y = Math.atan2(moveX, moveZ);
    }

    // Pulo (ESPAÇO)
    if (this.#isAnyKeyDown(jumpKeys) && this.isGrounded) {
      velocity.velocity.y = this.jumpForce;
      this.isGrounded = false;
    }

    // Descer / controlar altura com Shift
    if (this.#isAnyKeyDown(descendKeys)) {
      velocity.addForce(new Vector3(0, -this.speed * 0.7, 0));
    }
  }

  /**
   * Verifica se alguma tecla da lista está pressionada.
   * @param {string[]} keys
   * @returns {boolean}
   */
  #isAnyKeyDown(keys) {
    return keys.some((key) => InputSystem.isKeyDown(key));
  }

  /**
   * Verifica se a entidade está tocando o chão.
   * @private
   */
  checkGrounded(transform, collider) {
    if (!collider) {
      this.isGrounded = false;
      return;
    }

    const scene = this.entity?.scene;
    if (!scene) {
      this.isGrounded = false;
      return;
    }

    const bounds = collider.getBounds(transform);
    const myBottom = bounds.min.y;
    const tolerance = this.groundThreshold + 0.02;
    this.isGrounded = false;

    for (const otherEntity of scene.entities) {
      if (otherEntity === this.entity || !otherEntity.active || otherEntity.destroyed) continue;

      const otherCollider = otherEntity.getComponent(Collider3D);
      const otherTransform = otherEntity.getComponent(Transform3D);
      if (!otherCollider || !otherTransform || !otherCollider.isStatic) continue;

      const otherBounds = otherCollider.getBounds(otherTransform);
      const overlapX = bounds.max.x >= otherBounds.min.x && bounds.min.x <= otherBounds.max.x;
      const overlapZ = bounds.max.z >= otherBounds.min.z && bounds.min.z <= otherBounds.max.z;

      if (!overlapX || !overlapZ) continue;

      const verticalGap = myBottom - otherBounds.max.y;
      if (verticalGap >= 0 && verticalGap <= tolerance) {
        this.isGrounded = true;
        break;
      }
    }

    if (!this.isGrounded && Math.abs(transform.position.y - this.lastGroundY) < this.groundThreshold) {
      this.isGrounded = true;
    }

    this.lastGroundY = transform.position.y;
  }
}
