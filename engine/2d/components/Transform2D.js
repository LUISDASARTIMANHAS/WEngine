import { Component } from "../../core/Component.js";

/**
 * Componente de Transformação 2D (Posição, Rotação e Escala no plano 2D).
 */
export class Transform2D extends Component {
  constructor(x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1) {
    super();
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }
}

export { Transform2D as Transform };
