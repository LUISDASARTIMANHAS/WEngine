/**
 * Remove entidades destruídas ao final do frame.
 */
export class CleanupSystem {
  /**
   * @param {import("../core/Scene.js").Scene} scene
   * @returns {void}
   */
  process(scene) {
    scene.entities = scene.entities.filter((entity) => !entity.destroyed);
  }
}