/**
 * Classe base para todos os componentes.
 */
export class Component {
  constructor() {
    /**
     * Entidade dona do componente.
     * @type {import("./Entity.js").Entity|null}
     */
    this.entity = null;
  }

  /**
   * Chamado quando o componente é anexado a uma entidade.
   * @return {void}
   */
  start() {}

  /**
   * Atualização por frame.
   * @param {number} _deltaTime
   * @return {void}
   */
  update(_deltaTime) {}
}