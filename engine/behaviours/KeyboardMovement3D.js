import { Component } from "../core/Component.js";
import { Transform3D } from "../components/Transform3D.js";
import { InputSystem } from "../systems/InputSystem.js";

/**
 * Comportamento de movimentação 3D por teclado (WASD / Teclas de direção e elevação).
 */
export class KeyboardMovement3D extends Component {
  /**
   * @param {number} [speed=5] Velocidade de translação
   * @param {number} [rotationSpeed=2] Velocidade de rotação (radianos/segundo)
   */
  constructor(speed = 5, rotationSpeed = 2) {
    super();

    /**
     * Velocidade de movimento.
     * @type {number}
     */
    this.speed = speed;

    /**
     * Velocidade de giro.
     * @type {number}
     */
    this.rotationSpeed = rotationSpeed;
  }

  /**
   * Atualiza a posição e rotação da entidade a cada frame.
   * @param {number} deltaTime
   * @return {void}
   */
  update(deltaTime) {
    const transform = this.entity?.getComponent(Transform3D);
    if (!transform) return;

    // Rotação Y (Giro)
    if (InputSystem.isKeyDown("ArrowLeft") || InputSystem.isKeyDown("a") || InputSystem.isKeyDown("A")) {
      transform.rotation.y += this.rotationSpeed * deltaTime;
    }
    if (InputSystem.isKeyDown("ArrowRight") || InputSystem.isKeyDown("d") || InputSystem.isKeyDown("D")) {
      transform.rotation.y -= this.rotationSpeed * deltaTime;
    }

    // Movimentação para frente / para trás no eixo Z relativo à rotação
    const forwardX = Math.sin(transform.rotation.y);
    const forwardZ = Math.cos(transform.rotation.y);

    if (InputSystem.isKeyDown("ArrowUp") || InputSystem.isKeyDown("w") || InputSystem.isKeyDown("W")) {
      transform.x -= forwardX * this.speed * deltaTime;
      transform.z -= forwardZ * this.speed * deltaTime;
    }
    if (InputSystem.isKeyDown("ArrowDown") || InputSystem.isKeyDown("s") || InputSystem.isKeyDown("S")) {
      transform.x += forwardX * this.speed * deltaTime;
      transform.z += forwardZ * this.speed * deltaTime;
    }

    // Elevação (Subir / Descer)
    if (InputSystem.isKeyDown("Space") || InputSystem.isKeyDown("e") || InputSystem.isKeyDown("E")) {
      transform.y += this.speed * deltaTime;
    }
    if (InputSystem.isKeyDown("ShiftLeft") || InputSystem.isKeyDown("q") || InputSystem.isKeyDown("Q")) {
      transform.y -= this.speed * deltaTime;
    }
  }
}
