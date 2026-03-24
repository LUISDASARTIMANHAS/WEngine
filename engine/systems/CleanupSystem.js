/**
 * Remove entidades destruídas ao final do frame.
 */
export class CleanupSystem {
  /**
   * @param {import("../core/Scene.js").Scene} scene
   * @returns {void}
   */
  process(scene) {
    const beforeCount = scene.entities.length;

    scene.entities = scene.entities.filter((entity) => !entity.destroyed);

    const removedCount = beforeCount - scene.entities.length;

    if (removedCount > 0) {
      scene.engine?.logger?.info("cleanup", "Entidades removidas da cena.", {
        sceneName: scene.name,
        removedCount,
        remainingCount: scene.entities.length
      });
    }
  }
}