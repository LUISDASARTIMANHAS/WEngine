/**
 * Controla delta time e FPS.
 */
export class Time {
  constructor() {
    /**
     * Último timestamp.
     * @type {number}
     */
    this.lastTime = 0;

    /**
     * FPS atual.
     * @type {number}
     */
    this.fps = 0;
  }

  /**
   * Atualiza o relógio.
   * @param {number} currentTime
   * @returns {number}
   */
  update(currentTime) {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    this.fps = deltaTime > 0 ? Math.round(1 / deltaTime) : 0;
    return deltaTime || 0;
  }
}