import { Component } from "../../core/Component.js";
import { Vector3, Matrix4 } from "../utils/Math3D.js";

/**
 * Componente de Transformação 3D (Posição, Rotação em radianos e Escala).
 */
export class Transform3D extends Component {
  /**
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   * @param {number} [rx=0] Rotação X em radianos
   * @param {number} [ry=0] Rotação Y em radianos
   * @param {number} [rz=0] Rotação Z em radianos
   * @param {number} [sx=1] Escala X
   * @param {number} [sy=1] Escala Y
   * @param {number} [sz=1] Escala Z
   */
  constructor(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    super();
    this.position = new Vector3(x, y, z);
    this.rotation = new Vector3(rx, ry, rz);
    this.scale = new Vector3(sx, sy, sz);
  }

  get x() { return this.position.x; }
  set x(val) { this.position.x = val; }

  get y() { return this.position.y; }
  set y(val) { this.position.y = val; }

  get z() { return this.position.z; }
  set z(val) { this.position.z = val; }

  /**
   * Computa e retorna a Matriz de Modelo (Model Matrix).
   * @returns {Matrix4}
   */
  getModelMatrix() {
    return Matrix4.compose(this.position, this.rotation, this.scale);
  }
}
