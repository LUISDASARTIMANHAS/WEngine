import { Component } from "../core/Component.js";
import { Vector3 } from "../utils/Math3D.js";

/**
 * Componente de Luz 3D (Suporta luz direcional, pontual e ambiente).
 */
export class Light3D extends Component {
  /**
   * @param {object} [options]
   * @param {'directional'|'point'|'ambient'} [options.type='directional']
   * @param {number[]} [options.color=[1.0, 1.0, 1.0]] Cor RGB (0 a 1)
   * @param {number} [options.intensity=1.0] Intensidade da luz
   * @param {Vector3} [options.direction] Direção da luz (para direcional)
   */
  constructor({ type = 'directional', color = [1.0, 1.0, 1.0], intensity = 1.0, direction = new Vector3(-0.5, -1.0, -0.5) } = {}) {
    super();

    /**
     * Tipo de fonte luminosa.
     * @type {'directional'|'point'|'ambient'}
     */
    this.type = type;

    /**
     * Cor da luz em RGB [r, g, b].
     * @type {number[]}
     */
    this.color = color;

    /**
     * Intensidade.
     * @type {number}
     */
    this.intensity = intensity;

    /**
     * Vetor de direção da luz (normalizado).
     * @type {Vector3}
     */
    this.direction = direction.normalize();
  }
}
