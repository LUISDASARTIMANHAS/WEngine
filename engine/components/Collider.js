/**
 * Collider AABB simples.
 */
export class Collider {
  /**
   * @param {boolean} isStatic
   */
  constructor(isStatic = false) {
    /**
     * Define se o corpo é estático.
     * @type {boolean}
     */
    this.isStatic = isStatic;
  }
}