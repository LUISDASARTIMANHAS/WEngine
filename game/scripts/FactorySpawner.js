import { Script } from "../../engine/components/Script.js";
import { Transform } from "../../engine/components/Transform.js";

/**
 * Spawner periódico de inimigos.
 */
export class FactorySpawner extends Script {
  /**
   * @param {number} interval
   * @param {number} maxChildren
   */
  constructor(interval = 1, maxChildren = 15) {
    super();

    /**
     * Intervalo entre spawns.
     * @type {number}
     */
    this.interval = interval;

    /**
     * Limite de inimigos gerados.
     * @type {number}
     */
    this.maxChildren = maxChildren;

    /**
     * Tempo acumulado.
     * @type {number}
     */
    this.elapsed = 0;
  }

  /**
   * Atualiza a fábrica.
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    this.elapsed += deltaTime;

    if (this.elapsed < this.interval) return;

    const scene = this.entity.scene;
    const transform = this.entity.getComponent(Transform);

    if (!scene || !transform) return;

    const currentEnemies = scene.entities.filter((entity) => {
      return entity.name.startsWith("Enemy") && !entity.destroyed;
    }).length;

    if (currentEnemies >= this.maxChildren) return;

    this.elapsed = 0;

    const enemy = scene.engine.entityFactory.createEnemy({
      x: transform.x + 80,
      y: transform.y + 20
    });

    scene.addEntity(enemy);
  }
}