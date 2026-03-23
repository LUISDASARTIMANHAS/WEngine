/**
 * Representa uma cena do jogo.
 */
export class Scene {
  constructor(name = "Scene") {
    /**
     * Nome da cena.
     * @type {string}
     */
    this.name = name;

    /**
     * Entidades da cena.
     * @type {Array<import("./Entity.js").Entity>}
     */
    this.entities = [];

    /**
     * Referência para a engine.
     * @type {import("./Engine.js").Engine|null}
     */
    this.engine = null;
  }

  /**
   * Chamado ao iniciar a cena.
   * @return {void}
   */
  start() {}

  /**
   * Chamado a cada frame.
   * @param {number} deltaTime
   * @return {void}
   */
  update(deltaTime) {
    for (const entity of this.entities) {
      entity.update(deltaTime);
    }
  }

  /**
   * Adiciona entidade à cena.
   * @param {import("./Entity.js").Entity} entity
   * @returns {import("./Entity.js").Entity}
   */
  addEntity(entity) {
    entity.scene = this;
    this.entities.push(entity);
    return entity;
  }

  /**
   * Busca entidade pelo nome.
   * @param {string} name
   * @returns {import("./Entity.js").Entity|null}
   */
  getEntityByName(name) {
    return this.entities.find((entity) => entity.name === name) || null;
  }
}