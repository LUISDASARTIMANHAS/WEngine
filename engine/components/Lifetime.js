import { Component } from "../core/Component.js";

/**
 * Componente que destrói entidade após um tempo.
 */
export class Lifetime extends Component {
  /**
   * @param {number} duration
   */
  constructor(duration = 2) {
    super();
    this.duration = duration;
    this.elapsed = 0;
  }

  /**
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    this.elapsed += deltaTime;

    if (this.elapsed >= this.duration) {
      this.entity.destroy();
    }
  }
}