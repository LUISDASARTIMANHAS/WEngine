import { Component } from "../core/Component.js";

/**
 * Tag simples para classificar entidade.
 */
export class Tag extends Component {
  /**
   * @param {string} value
   */
  constructor(value = "entity") {
    super();
    this.value = value;
  }
}