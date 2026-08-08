import { Component } from "../../core/Component.js";
import { Vector3 } from "../utils/Math3D.js";

/**
 * Componente de Caixa de Colisão 3D Alinhada aos Eixos (AABB).
 */
export class Collider3D extends Component {
  /**
   * @param {object} options
   * @param {number} [options.width=1]
   * @param {number} [options.height=1]
   * @param {number} [options.depth=1]
   * @param {Vector3|number[]} [options.offset=[0,0,0]]
   * @param {boolean} [options.isStatic=false]
   */
  constructor({ width = 1, height = 1, depth = 1, offset = [0, 0, 0], isStatic = false } = {}) {
    super();

    this.width = width;
    this.height = height;
    this.depth = depth;

    if (offset instanceof Vector3) {
      this.offset = offset.clone();
    } else {
      this.offset = new Vector3(...offset);
    }

    this.isStatic = isStatic;
  }

  /**
   * Retorna os pontos limite (min, max) do AABB no espaço do mundo.
   * @param {import("./Transform3D.js").Transform3D} transform
   * @returns {{ min: Vector3, max: Vector3 }}
   */
  getBounds(transform) {
    const center = transform.position.clone().add(this.offset);
    const hw = (this.width * transform.scale.x) / 2;
    const hh = (this.height * transform.scale.y) / 2;
    const hd = (this.depth * transform.scale.z) / 2;

    return {
      min: new Vector3(center.x - hw, center.y - hh, center.z - hd),
      max: new Vector3(center.x + hw, center.y + hh, center.z + hd),
    };
  }
}
