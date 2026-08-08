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
   * @param {number} [groundDrag=0.85] Drag enquanto no chão
   * @param {number} [airDrag=0.95] Drag enquanto no ar
   */
  constructor(speed = 5, jumpForce = 7, groundDrag = 0.85, airDrag = 0.95) {
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

    // Verificar todas as combinações possíveis de teclas
    if (InputSystem.isKeyDown("keyw") || InputSystem.isKeyDown("arrowup")) moveZ -= 1;
    if (InputSystem.isKeyDown("keys") || InputSystem.isKeyDown("arrowdown")) moveZ += 1;
    if (InputSystem.isKeyDown("keya") || InputSystem.isKeyDown("arrowleft")) moveX -= 1;
    if (InputSystem.isKeyDown("keyd") || InputSystem.isKeyDown("arrowright")) moveX += 1;

    // Debug: mostrar teclas pressionadas no console (throttle para não spammar)
    if ((moveX !== 0 || moveZ !== 0) && Math.random() < 0.05) {
      console.log(`[Movement3D] Keys: W=${InputSystem.isKeyDown("keyw")}, S=${InputSystem.isKeyDown("keys")}, A=${InputSystem.isKeyDown("keya")}, D=${InputSystem.isKeyDown("keyd")}, Space=${InputSystem.isKeyDown("space")}`);
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
    if (InputSystem.isKeyDown("space") && this.isGrounded) {
      velocity.velocity.y = this.jumpForce;
      this.isGrounded = false;
    }
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

    const bounds = collider.getBounds(transform);
    const rayStart = bounds.min.y - this.groundThreshold;
    const rayEnd = bounds.min.y;

    // Verificar se há colisão abaixo do objeto
    // Simples: objetos estáticos abaixo indicam que está no chão
    this.isGrounded = false;

    // Usar uma pequena margem para detecção de chão
    if (Math.abs(transform.position.y - this.lastGroundY) < this.groundThreshold) {
      this.isGrounded = true;
    }

    this.lastGroundY = transform.position.y;
  }
}
