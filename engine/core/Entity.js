export class Entity {
  /**
   * @param {string} [name="Entity"]
   */
  constructor(name = "Entity") {
    /**
     * Nome da entidade.
     * @type {string}
     */
    this.name = name;

    /**
     * Indica se a entidade está ativa.
     * @type {boolean}
     */
    this.active = true;

    /**
     * Indica se a entidade foi destruída.
     * @type {boolean}
     */
    this.destroyed = false;

    /**
     * Componentes da entidade.
     * @type {Array<any>}
     */
    this.components = [];

    /**
     * Cena da entidade.
     * @type {import("./Scene.js").Scene|null}
     */
    this.scene = null;
  }

  /**
   * Retorna o logger da engine.
   * @returns {import("../utils/Logger.js").Logger|null}
   */
  getLogger() {
    return this.scene?.engine?.logger ?? null;
  }

  /**
   * Marca a entidade para destruição.
   * @returns {void}
   */
  destroy() {
    this.destroyed = true;
    this.active = false;

    this.getLogger()?.info("entity", "Entidade destruída.", {
      entityName: this.name
    });
  }

  /**
   * Adiciona um componente.
   * @param {any} component
   * @returns {any}
   */
  addComponent(component) {
    component.entity = this;
    this.components.push(component);

    this.getLogger()?.debug("entity", "Componente adicionado.", {
      entityName: this.name,
      componentName: component.constructor.name
    });

    if (typeof component.start === "function") {
      component.start();
    }

    return component;
  }

  /**
   * Busca componente por classe.
   * @param {any} ComponentClass
   * @returns {any|null}
   */
  getComponent(ComponentClass) {
    return this.components.find(
      (component) => component instanceof ComponentClass
    ) || null;
  }

  /**
   * Atualiza a entidade.
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    if (!this.active || this.destroyed) return;

    for (const component of this.components) {
      if (typeof component.update === "function") {
        component.update(deltaTime);
      }
    }
  }
}