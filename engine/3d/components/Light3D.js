import { Component } from "../../core/Component.js";
import { Vector3 } from "../utils/Math3D.js";

/**
 * Componente de Luz 3D (Direcional, Ambiente ou Pontual).
 */
export class Light3D extends Component {
  /**
   * @param {object} options
   * @param {'directional'|'ambient'|'point'} [options.type='directional'] Tipo de fonte luminosa
   * @param {Vector3|number[]} [options.direction=[-0.5, -1.0, -0.5]] Direção da luz (se direcional)
   * @param {number[]} [options.color=[1.0, 1.0, 1.0]] Cor RGB da luz (0 a 1)
   * @param {number} [options.intensity=1.0] Intensidade
   * @param {number} [options.range=20] Alcance da luz (se pontual)
   */
  constructor({
    type = "directional",
    direction = [-0.5, -1.0, -0.5],
    color = [1.0, 1.0, 1.0],
    intensity = 1.0,
    range = 20,
  } = {}) {
    super();

    this.type = type;

    if (direction instanceof Vector3) {
      this.direction = direction.clone().normalize();
    } else {
      this.direction = new Vector3(...direction).normalize();
    }

    this.color = color;
    this.intensity = intensity;
    this.range = range;
  }
}
