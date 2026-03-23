import { Component } from "../core/Component.js";

/**
 * Componente de dano.
 */
export class Damage extends Component {
  /**
   * @param {number} value
   */
  constructor(value = 10) {
    super();
    this.value = value;
  }
}