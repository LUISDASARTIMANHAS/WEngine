import { Vector3, Matrix4 } from "../utils/Math3D.js";
import { Transform3D } from "../components/Transform3D.js";

/**
 * Câmera 3D com projeção perspectiva e suporte a visualização em 3ª ou 1ª pessoa.
 */
export class Camera3D {
  /**
   * @param {object} [options]
   * @param {number} [options.fov=60] Campo de visão em graus
   * @param {number} [options.aspect=1.333] Razão de aspecto (largura / altura)
   * @param {number} [options.near=0.1] Plano de corte próximo
   * @param {number} [options.far=1000.0] Plano de corte distante
   */
  constructor({ fov = 60, aspect = 16 / 9, near = 0.1, far = 1000.0 } = {}) {
    /**
     * Posição no espaço 3D.
     * @type {Vector3}
     */
    this.position = new Vector3(0, 5, 10);

    /**
     * Ponto de atenção (alvo) no espaço 3D.
     * @type {Vector3}
     */
    this.targetPosition = new Vector3(0, 0, 0);

    /**
     * Vetor UP da câmera.
     * @type {Vector3}
     */
    this.up = new Vector3(0, 1, 0);

    /**
     * FOV em graus.
     * @type {number}
     */
    this.fov = fov;

    /**
     * Aspect Ratio.
     * @type {number}
     */
    this.aspect = aspect;

    /**
     * Near plane.
     * @type {number}
     */
    this.near = near;

    /**
     * Far plane.
     * @type {number}
     */
    this.far = far;

    /**
     * Entidade alvo para seguir em 3D.
     * @type {import("./Entity.js").Entity|null}
     */
    this.targetEntity = null;

    /**
     * Deslocamento em relação ao alvo (offset 3D).
     * @type {Vector3}
     */
    this.offset = new Vector3(0, 4, 8);
  }

  /**
   * Retorna a matriz de visualização (View Matrix).
   * @returns {Matrix4}
   */
  getViewMatrix() {
    return new Matrix4().lookAt(this.position, this.targetPosition, this.up);
  }

  /**
   * Retorna a matriz de projeção perspectiva (Projection Matrix).
   * @returns {Matrix4}
   */
  getProjectionMatrix() {
    return new Matrix4().perspective(this.fov, this.aspect, this.near, this.far);
  }

  /**
   * Atualiza a posição da câmera se houver um alvo.
   * @return {void}
   */
  update() {
    if (!this.targetEntity) return;

    const transform = this.targetEntity.getComponent(Transform3D);
    if (!transform) return;

    // Acompanha a posição do alvo com o offset configurado
    this.targetPosition.copy(transform.position);
    this.position.set(
      transform.position.x + this.offset.x,
      transform.position.y + this.offset.y,
      transform.position.z + this.offset.z
    );
  }
}
