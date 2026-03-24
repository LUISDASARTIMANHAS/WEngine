import { Transform } from "../components/Transform.js";
import { Collider } from "../components/Collider.js";

/**
 * Sistema de colisão AABB simples.
 */
export class CollisionSystem {
  /**
   * Resolve colisões básicas entre entidades.
   * @param {import("../core/Scene.js").Scene} scene
   * @return {void}
   */
  resolve(scene) {
    const collidableEntities = scene.entities.filter((entity) => {
      return entity.getComponent(Transform) && entity.getComponent(Collider);
    });

    for (let i = 0; i < collidableEntities.length; i += 1) {
      for (let j = i + 1; j < collidableEntities.length; j += 1) {
        const entityA = collidableEntities[i];
        const entityB = collidableEntities[j];

        const transformA = entityA.getComponent(Transform);
        const transformB = entityB.getComponent(Transform);
        const colliderA = entityA.getComponent(Collider);
        const colliderB = entityB.getComponent(Collider);

        if (!this.isColliding(transformA, transformB)) continue;

        // scene.engine?.logger?.debug("collision", "Colisão detectada.", {
        //   entityA: entityA.name,
        //   entityB: entityB.name
        // });

        if (!colliderA.isStatic && colliderB.isStatic) {
          this.separate(transformA, transformB);
        } else if (colliderA.isStatic && !colliderB.isStatic) {
          this.separate(transformB, transformA);
        }
      }
    }
  }

  /**
   * Verifica colisão entre dois retângulos.
   * @param {Transform} a
   * @param {Transform} b
   * @returns {boolean}
   */
  isColliding(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /**
   * Separa entidade dinâmica de uma estática.
   * @param {Transform} dynamicTransform
   * @param {Transform} staticTransform
   * @return {void}
   */
  separate(dynamicTransform, staticTransform) {
    const overlapLeft =
      dynamicTransform.x + dynamicTransform.width - staticTransform.x;
    const overlapRight =
      staticTransform.x + staticTransform.width - dynamicTransform.x;
    const overlapTop =
      dynamicTransform.y + dynamicTransform.height - staticTransform.y;
    const overlapBottom =
      staticTransform.y + staticTransform.height - dynamicTransform.y;

    const minOverlap = Math.min(
      overlapLeft,
      overlapRight,
      overlapTop,
      overlapBottom
    );

    if (minOverlap === overlapLeft) {
      dynamicTransform.x = staticTransform.x - dynamicTransform.width;
    } else if (minOverlap === overlapRight) {
      dynamicTransform.x = staticTransform.x + staticTransform.width;
    } else if (minOverlap === overlapTop) {
      dynamicTransform.y = staticTransform.y - dynamicTransform.height;
    } else if (minOverlap === overlapBottom) {
      dynamicTransform.y = staticTransform.y + dynamicTransform.height;
    }
  }
}