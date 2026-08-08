import { Transform3D } from "../components/Transform3D.js";
import { Collider3D } from "../components/Collider3D.js";

/**
 * Sistema de Detecção e Resolução de Colisão 3D (AABB).
 */
export class CollisionSystem3D {
  /**
   * Processa detecção e resolução de colisão AABB no espaço 3D para a cena.
   * @param {import("../../../engine/core/Scene.js").Scene} scene
   * @returns {void}
   */
  resolve(scene) {
    const colliders = [];

    for (const entity of scene.entities) {
      if (!entity.active || entity.destroyed) continue;

      const transform = entity.getComponent(Transform3D);
      const collider = entity.getComponent(Collider3D);

      if (transform && collider) {
        colliders.push({ entity, transform, collider });
      }
    }

    const count = colliders.length;

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const a = colliders[i];
        const b = colliders[j];

        if (a.collider.isStatic && b.collider.isStatic) continue;

        const boundsA = a.collider.getBounds(a.transform);
        const boundsB = b.collider.getBounds(b.transform);

        if (this.intersects(boundsA, boundsB)) {
          this.resolveOverlap(a, b, boundsA, boundsB);
        }
      }
    }
  }

  /**
   * Testa intersecção entre 2 caixas delimitadoras AABB 3D.
   */
  intersects(a, b) {
    return (
      a.min.x <= b.max.x &&
      a.max.x >= b.min.x &&
      a.min.y <= b.max.y &&
      a.max.y >= b.min.y &&
      a.min.z <= b.max.z &&
      a.max.z >= b.min.z
    );
  }

  /**
   * Resolve a penetração separando os objetos 3D no menor eixo de sobreposição.
   */
  resolveOverlap(a, b, boundsA, boundsB) {
    const overlapX = Math.min(boundsA.max.x - boundsB.min.x, boundsB.max.x - boundsA.min.x);
    const overlapY = Math.min(boundsA.max.y - boundsB.min.y, boundsB.max.y - boundsA.min.y);
    const overlapZ = Math.min(boundsA.max.z - boundsB.min.z, boundsB.max.z - boundsA.min.z);

    const minOverlap = Math.min(overlapX, overlapY, overlapZ);

    if (minOverlap === overlapX) {
      const dirX = a.transform.position.x < b.transform.position.x ? -1 : 1;
      if (!a.collider.isStatic && !b.collider.isStatic) {
        a.transform.position.x += dirX * (overlapX / 2);
        b.transform.position.x -= dirX * (overlapX / 2);
      } else if (!a.collider.isStatic) {
        a.transform.position.x += dirX * overlapX;
      } else if (!b.collider.isStatic) {
        b.transform.position.x -= dirX * overlapX;
      }
    } else if (minOverlap === overlapY) {
      const dirY = a.transform.position.y < b.transform.position.y ? -1 : 1;
      if (!a.collider.isStatic && !b.collider.isStatic) {
        a.transform.position.y += dirY * (overlapY / 2);
        b.transform.position.y -= dirY * (overlapY / 2);
      } else if (!a.collider.isStatic) {
        a.transform.position.y += dirY * overlapY;
      } else if (!b.collider.isStatic) {
        b.transform.position.y -= dirY * overlapY;
      }
    } else {
      const dirZ = a.transform.position.z < b.transform.position.z ? -1 : 1;
      if (!a.collider.isStatic && !b.collider.isStatic) {
        a.transform.position.z += dirZ * (overlapZ / 2);
        b.transform.position.z -= dirZ * (overlapZ / 2);
      } else if (!a.collider.isStatic) {
        a.transform.position.z += dirZ * overlapZ;
      } else if (!b.collider.isStatic) {
        b.transform.position.z -= dirZ * overlapZ;
      }
    }
  }
}
