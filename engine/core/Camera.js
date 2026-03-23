import { Transform } from "../components/Transform.js";

/**
 * Câmera 2D simples.
 */
export class Camera {
  constructor() {
    /**
     * Posição X da câmera.
     * @type {number}
     */
    this.x = 0;

    /**
     * Posição Y da câmera.
     * @type {number}
     */
    this.y = 0;

    /**
     * Largura da viewport.
     * @type {number}
     */
    this.width = 0;

    /**
     * Altura da viewport.
     * @type {number}
     */
    this.height = 0;

    /**
     * Entidade alvo da câmera.
     * @type {import("./Entity.js").Entity|null}
     */
    this.target = null;
  }

  /**
   * Atualiza a posição da câmera.
   * @return {void}
   */
  update() {
    if (!this.target) return;

    const transform = this.target.getComponent(Transform);
    if (!transform) return;

    this.x = transform.x - this.width / 2 + transform.width / 2;
    this.y = transform.y - this.height / 2 + transform.height / 2;
  }
}