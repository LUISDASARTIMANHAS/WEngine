import { Component } from "../../core/Component.js";

/**
 * Componente visual 2D simples baseado em cor ou imagem.
 */
export class Sprite extends Component {
  /**
   * @param {string} [color="#ffffff"]
   * @param {number} [width=32]
   * @param {number} [height=32]
   */
  constructor(color = "#ffffff", width = 32, height = 32) {
    super();
    this.color = color;
    this.width = width;
    this.height = height;
  }
}
