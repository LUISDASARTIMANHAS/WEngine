import { Component } from "../core/Component.js";
import { Vector3, Matrix4 } from "../utils/Math3D.js";

/**
 * Componente de transformação 3D (posição, rotação e escala no espaço tridimensional).
 */
export class Transform3D extends Component {
  /**
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   * @param {number} [rx=0]
   * @param {number} [ry=0]
   * @param {number} [rz=0]
   * @param {number} [sx=1]
   * @param {number} [sy=1]
   * @param {number} [sz=1]
   */
  constructor(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    super();

    /**
     * Posição no mundo 3D.
     * @type {Vector3}
     */
    this.position = new Vector3(x, y, z);

    /**
     * Rotação em radianos (Euler X, Y, Z).
     * @type {Vector3}
     */
    this.rotation = new Vector3(rx, ry, rz);

    /**
     * Escala em cada eixo.
     * @type {Vector3}
     */
    this.scale = new Vector3(sx, sy, sz);
  }

  get x() { return this.position.x; }
  set x(val) { this.position.x = val; }

  get y() { return this.position.y; }
  set y(val) { this.position.y = val; }

  get z() { return this.position.z; }
  set z(val) { this.position.z = val; }

  /**
   * Retorna a matriz de modelo composta (Model Matrix).
   * @returns {Matrix4}
   */
  getModelMatrix() {
    return Matrix4.compose(this.position, this.rotation, this.scale);
  }
}
