import { Component } from "../../core/Component.js";
import { Mesh3D } from "./Mesh3D.js";

/**
 * Componente de Skybox 3D para renderizar o fundo de ambiente em WebGL.
 */
export class Skybox3D extends Component {
  /**
   * @param {object} options
   * @param {number[]} [options.topColor=[0.1, 0.2, 0.45, 1.0]]
   * @param {number[]} [options.bottomColor=[0.05, 0.05, 0.1, 1.0]]
   * @param {number} [options.size=500]
   */
  constructor({
    topColor = [0.1, 0.2, 0.45, 1.0],
    bottomColor = [0.05, 0.05, 0.1, 1.0],
    size = 500,
  } = {}) {
    super();

    this.topColor = topColor;
    this.bottomColor = bottomColor;
    this.size = size;

    // Gera a malha estática do skybox invertido
    this.mesh = Mesh3D.createCube(size, topColor);
  }
}
