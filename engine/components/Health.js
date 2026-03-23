import { Component } from "../core/Component.js";

/**
 * Componente de vida.
 */
export class Health extends Component {
  /**
   * @param {number} maxHealth
   */
  constructor(maxHealth = 100) {
    super();

    /**
     * Vida máxima.
     * @type {number}
     */
    this.maxHealth = maxHealth;

    /**
     * Vida atual.
     * @type {number}
     */
    this.currentHealth = maxHealth;

    /**
     * Indica se a entidade morreu.
     * @type {boolean}
     */
    this.isDead = false;
  }

  /**
   * Aplica dano.
   * @param {number} amount
   * @returns {void}
   */
  takeDamage(amount) {
    if (this.isDead) return;

    this.currentHealth -= amount;

    if (this.currentHealth <= 0) {
      this.currentHealth = 0;
      this.isDead = true;
      this.entity.destroy();
    }
  }
}