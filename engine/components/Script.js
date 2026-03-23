/**
 * Classe base para scripts de comportamento.
 */
export class Script {
  constructor() {
    /**
     * Entidade dona do script.
     * @type {import("../core/Entity.js").Entity|null}
     */
    this.entity = null;
  }

  /**
   * Chamado ao iniciar.
   * @return {void}
   */
  start() {}

  /**
   * Chamado a cada frame.
   * @param {number} _deltaTime
   * @return {void}
   */
  update(_deltaTime) {}
}