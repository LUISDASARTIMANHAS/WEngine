/**
 * Fábrica baseada em registros de builders.
 */
export class EntityFactory {
  /**
   * @param {import("../utils/Logger.js").Logger|null} [logger=null]
   */
  constructor(logger = null) {
    /**
     * Logger da fábrica.
     * @type {import("../utils/Logger.js").Logger|null}
     */
    this.logger = logger;

    /**
     * Registro de builders.
     * @type {Map<string, (options?: object) => import("../core/Entity.js").Entity>}
     */
    this.builders = new Map();
  }

  /**
   * Registra um builder de entidade.
   * @param {string} type
   * @param {(options?: object) => import("../core/Entity.js").Entity} builder
   * @returns {void}
   */
  register(type, builder) {
    this.builders.set(type, builder);

    this.logger?.debug("factory", "Builder registrado.", {
      type,
    });
  }

  /**
   * Cria entidade por tipo.
   * @param {string} type
   * @param {object} [options={}]
   * @returns {import("../core/Entity.js").Entity}
   */
  create(type, options = {}) {
    const builder = this.builders.get(type);

    if (!builder) {
      throw new Error(`Builder não registrado para o tipo "${type}".`);
    }

    const entity = builder(options);

    this.logger?.info("factory", "Entidade criada.", {
      type,
      entityName: entity.name,
    });

    return entity;
  }

  /**
   * Verifica se um builder foi registrado.
   * @param {string} type
   * @returns {boolean}
   */
  has(type) {
    return this.builders.has(type);
  }

  /**
   * Remove um builder registrado.
   * @param {string} type
   * @returns {boolean}
   */
  unregister(type) {
    return this.builders.delete(type);
  }

  /**
   * Lista os tipos registrados.
   * @returns {string[]}
   */
  getRegisteredTypes() {
    return Array.from(this.builders.keys());
  }
}