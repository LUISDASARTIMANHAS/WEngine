import { Component } from "../core/Component.js";

/**
 * Componente de Colisor 3D (Caixa delimitadora AABB).
 */
export class Collider3D extends Component {
  /**
   * @param {number} [width=1.0] Largura no eixo X
   * @param {number} [height=1.0] Altura no eixo Y
   * @param {number} [depth=1.0] Profundidade no eixo Z
   * @param {boolean} [isStatic=false] Se a entidade é estática (ex: chão, parede)
   */
  constructor(width = 1.0, height = 1.0, depth = 1.0, isStatic = false) {
    super();

    /**
     * Dimensão no eixo X.
     * @type {number}
     */
    this.width = width;

    /**
     * Dimensão no eixo Y.
     * @type {number}
     */
    this.height = height;

    /**
     * Dimensão no eixo Z.
     * @type {number}
     */
    this.depth = depth;

    /**
     * Define se a entidade é imóvel.
     * @type {boolean}
     */
    this.isStatic = isStatic;
  }
}
