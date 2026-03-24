import { Script } from "../../engine/components/Script.js";
import { Transform } from "../../engine/components/Transform.js";

/**
 * Spawner periódico de inimigos por fábrica.
 */
export class FactorySpawner extends Script {
  /**
   * @param {object} [options={}]
   * @param {number} [options.interval=1]
   * @param {number} [options.maxChildren=15]
   * @param {number} [options.spawnRadius=100]
   */
  constructor(options = {}) {
    super();

    /**
     * Intervalo entre spawns em segundos.
     * @type {number}
     */
    this.interval = options.interval ?? 1;

    /**
     * Máximo de inimigos vivos criados por esta fábrica.
     * @type {number}
     */
    this.maxChildren = options.maxChildren ?? 15;

    /**
     * Distância do ponto de spawn em relação à fábrica.
     * @type {number}
     */
    this.spawnRadius = options.spawnRadius ?? 100;

    /**
     * Tempo acumulado.
     * @type {number}
     */
    this.elapsed = 0;

    /**
     * IDs dos inimigos gerados por esta fábrica.
     * @type {Set<string>}
     */
    this.childrenNames = new Set();
  }

  /**
   * Atualiza a fábrica.
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    this.elapsed += deltaTime;

    if (this.elapsed < this.interval) {
      return;
    }

    const scene = this.entity.scene;
    const transform = this.entity.getComponent(Transform);

    if (!scene || !transform) {
      return;
    }

    this.#cleanupDestroyedChildren(scene);

    if (this.childrenNames.size >= this.maxChildren) {
      return;
    }

    this.elapsed = 0;

    const spawnPosition = this.#getSpawnPosition(transform);
    const enemy = scene.engine.entityFactory.createEnemy({
      x: spawnPosition.x,
      y: spawnPosition.y
    });

    enemy.factoryOwnerName = this.entity.name;
    this.childrenNames.add(enemy.name);

    scene.addEntity(enemy);
  }

  /**
   * Remove da lista os inimigos que já não existem mais.
   * @param {import("../../engine/core/Scene.js").Scene} scene
   * @returns {void}
   */
  #cleanupDestroyedChildren(scene) {
    for (const childName of this.childrenNames) {
      const child = scene.getEntityByName(childName);

      if (!child || child.destroyed) {
        this.childrenNames.delete(childName);
      }
    }
  }

  /**
   * Calcula uma posição aleatória ao redor da fábrica.
   * @param {Transform} transform
   * @returns {{x: number, y: number}}
   */
  #getSpawnPosition(transform) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 60 + Math.random() * this.spawnRadius;

    return {
      x: transform.x + Math.cos(angle) * radius,
      y: transform.y + Math.sin(angle) * radius
    };
  }
}