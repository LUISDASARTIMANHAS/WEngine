/**
 * Máquina de estados simples.
 */
export class StateMachine {
  constructor(initialState = null) {
    /**
     * Estado atual.
     * @type {string|null}
     */
    this.currentState = initialState;

    /**
     * Estados registrados.
     * @type {Map<string, object>}
     */
    this.states = new Map();
  }

  /**
   * Registra um estado.
   * @param {string} name
   * @param {object} config
   * @returns {void}
   */
  addState(name, config) {
    this.states.set(name, config);
  }

  /**
   * Troca o estado atual.
   * @param {string} name
   * @returns {void}
   */
  setState(name) {
    this.currentState = name;
  }

  /**
   * Atualiza o estado atual.
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    const state = this.states.get(this.currentState);
    if (!state || typeof state.update !== "function") return;
    state.update(deltaTime);
  }
}