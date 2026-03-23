/**
 * Componente de transformação 2D.
 */
export class Transform {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(x = 0, y = 0, width = 32, height = 32) {
    /**
     * Posição X.
     * @type {number}
     */
    this.x = x;

    /**
     * Posição Y.
     * @type {number}
     */
    this.y = y;

    /**
     * Largura.
     * @type {number}
     */
    this.width = width;

    /**
     * Altura.
     * @type {number}
     */
    this.height = height;
  }
}