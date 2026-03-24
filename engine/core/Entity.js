/**
 * Entidade base da engine.
 */
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
     * Índice de componentes por classe.
     * @type {Map<Function, any>}
     */
    this.componentMap = new Map();

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
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    this.active = false;

    this.getLogger()?.info("entity", "Entidade destruída.", {
      entityName: this.name,
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
    this.componentMap.set(component.constructor, component);

    this.getLogger()?.debug("entity", "Componente adicionado.", {
      entityName: this.name,
      componentName: component.constructor.name,
    });

    if (typeof component.start === "function") {
      component.start();
    }

    return component;
  }

  /**
   * Adiciona um componente e retorna a própria entidade.
   * Útil para composição encadeável.
   * @param {any} component
   * @returns {Entity}
   */
  add(component) {
    this.addComponent(component);
    return this;
  }

  /**
   * Busca componente por classe.
   * @template T
   * @param {new (...args: any[]) => T} ComponentClass
   * @returns {T|null}
   */
  getComponent(ComponentClass) {
    return this.componentMap.get(ComponentClass) ?? null;
  }

  /**
   * Verifica se a entidade possui um componente.
   * @param {Function} ComponentClass
   * @returns {boolean}
   */
  hasComponent(ComponentClass) {
    return this.componentMap.has(ComponentClass);
  }

  /**
   * Atualiza a entidade.
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    if (!this.active || this.destroyed) {
      return;
    }

    for (const component of this.components) {
      if (typeof component.update === "function") {
        component.update(deltaTime);
      }
    }
  }
}