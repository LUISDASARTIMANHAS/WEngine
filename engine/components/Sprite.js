/**
 * Componente visual simples baseado em cor.
 */
export class Sprite {
  /**
   * @param {string} color
   */
  constructor(color = "#ffffff") {
    /**
     * Cor do sprite.
     * @type {string}
     */
    this.color = color;
  }
}