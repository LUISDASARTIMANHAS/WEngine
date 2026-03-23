import { Component } from "../core/Component.js";

/**
 * Define a facção da entidade.
 */
export class Team extends Component {
  /**
   * @param {"player"|"enemy"|"neutral"} name
   */
  constructor(name = "neutral") {
    super();
    this.name = name;
  }
}