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
   * Retorna o logger da engine, se existir.
   * @returns {import("../utils/Logger.js").Logger|null}
   */
  getLogger() {
    return this.entity?.scene?.engine?.logger ?? null;
  }

  /**
   * Faz log de debug contextual.
   * @param {string} message
   * @param {object} [details={}]
   * @returns {void}
   */
  logDebug(message, details = {}) {
    this.getLogger()?.debug("component", message, {
      componentName: this.constructor.name,
      entityName: this.entity?.name ?? null,
      ...details
    });
  }

  /**
   * Faz log informativo contextual.
   * @param {string} message
   * @param {object} [details={}]
   * @returns {void}
   */
  logInfo(message, details = {}) {
    this.getLogger()?.info("component", message, {
      componentName: this.constructor.name,
      entityName: this.entity?.name ?? null,
      ...details
    });
  }

  /**
   * Faz log de aviso contextual.
   * @param {string} message
   * @param {object} [details={}]
   * @returns {void}
   */
  logWarn(message, details = {}) {
    this.getLogger()?.warn("component", message, {
      componentName: this.constructor.name,
      entityName: this.entity?.name ?? null,
      ...details
    });
  }

  /**
   * Faz log de erro contextual.
   * @param {string} message
   * @param {object} [details={}]
   * @returns {void}
   */
  logError(message, details = {}) {
    this.getLogger()?.error("component", message, {
      componentName: this.constructor.name,
      entityName: this.entity?.name ?? null,
      ...details
    });
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