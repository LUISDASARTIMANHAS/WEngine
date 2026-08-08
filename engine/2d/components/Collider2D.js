import { Component } from "../../core/Component.js";

/**
 * Componente de Caixa de Colisão 2D (AABB).
 */
export class Collider2D extends Component {
  constructor(width = 0, height = 0, isStatic = false) {
    super();
    this.width = width;
    this.height = height;
    this.isStatic = isStatic;
  }
}

export { Collider2D as Collider };
