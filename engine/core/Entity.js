export class Entity {
  constructor(name = "Entity") {
    this.name = name;
    this.active = true;
    this.destroyed = false;
    this.components = [];
    this.scene = null;
  }

  /**
   * Marca a entidade para destruição.
   * @returns {void}
   */
  destroy() {
    this.destroyed = true;
    this.active = false;
  }

  addComponent(component) {
    component.entity = this;
    this.components.push(component);

    if (typeof component.start === "function") {
      component.start();
    }

    return component;
  }

  getComponent(ComponentClass) {
    return this.components.find(
      (component) => component instanceof ComponentClass
    ) || null;
  }

  update(deltaTime) {
    if (!this.active || this.destroyed) return;

    for (const component of this.components) {
      if (typeof component.update === "function") {
        component.update(deltaTime);
      }
    }
  }
}