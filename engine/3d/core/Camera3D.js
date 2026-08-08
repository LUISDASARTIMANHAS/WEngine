import { Vector3, Matrix4 } from "../utils/Math3D.js";
import { Transform3D } from "../components/Transform3D.js";

/**
 * Câmera 3D com suporte a Projeções Perspectiva e Ortográfica.
 */
export class Camera3D {
  /**
   * @param {object} [options]
   * @param {Vector3|number[]} [options.position=[0, 5, 10]] Posição inicial
   * @param {Vector3|number[]} [options.target=[0, 0, 0]] Ponto de foco
   * @param {Vector3|number[]} [options.up=[0, 1, 0]] Vetor Up
   * @param {number} [options.fov=60] Campo de visão em graus
   * @param {number} [options.aspect=16/9] Razão de aspecto
   * @param {number} [options.near=0.1] Plano de corte próximo
   * @param {number} [options.far=1000] Plano de corte distante
   * @param {'perspective'|'orthographic'} [options.projection='perspective'] Tipo de projeção
   */
  constructor({
    position = [0, 5, 10],
    target = [0, 0, 0],
    up = [0, 1, 0],
    fov = 60,
    aspect = 16 / 9,
    near = 0.1,
    far = 1000,
    projection = "perspective",
  } = {}) {
    this.position = position instanceof Vector3 ? position : new Vector3(...position);
    this.target = target instanceof Vector3 ? target : new Vector3(...target);
    this.up = up instanceof Vector3 ? up : new Vector3(...up);

    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.projection = projection;

    /** @type {import("../../../engine/core/Entity.js").Entity|null} */
    this.targetEntity = null;
    this.followOffset = new Vector3(0, 4, 8);
    this.smoothness = 0.1;
  }

  /**
   * Atualiza a posição da câmera se estiver rastreando uma entidade.
   */
  update() {
    if (this.targetEntity) {
      const targetTransform = this.targetEntity.getComponent(Transform3D);
      if (targetTransform) {
        const desiredPos = targetTransform.position.clone().add(this.followOffset);
        this.position.x += (desiredPos.x - this.position.x) * this.smoothness;
        this.position.y += (desiredPos.y - this.position.y) * this.smoothness;
        this.position.z += (desiredPos.z - this.position.z) * this.smoothness;
        this.target.copy(targetTransform.position);
      }
    }
  }

  /**
   * Retorna a Matriz de Visão (View Matrix).
   * @returns {Matrix4}
   */
  getViewMatrix() {
    return new Matrix4().lookAt(this.position, this.target, this.up);
  }

  /**
   * Retorna a Matriz de Projeção (Projection Matrix).
   * @returns {Matrix4}
   */
  getProjectionMatrix() {
    if (this.projection === "orthographic") {
      const size = 10;
      return new Matrix4().orthographic(
        -size * this.aspect,
        size * this.aspect,
        -size,
        size,
        this.near,
        this.far
      );
    }
    return new Matrix4().perspective(this.fov, this.aspect, this.near, this.far);
  }
}
