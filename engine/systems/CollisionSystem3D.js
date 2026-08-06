import { Transform3D } from "../components/Transform3D.js";
import { Collider3D } from "../components/Collider3D.js";

/**
 * Sistema de Detecção e Resolução de Colisão 3D (AABB 3D).
 */
export class CollisionSystem3D {
  /**
   * Processa e resolve colisões de cena em 3D.
   * @param {import("../core/Scene.js").Scene} scene
   * @return {void}
   */
  resolve(scene) {
    const collidables = [];

    for (const entity of scene.entities) {
      if (!entity.active || entity.destroyed) continue;

      const transform = entity.getComponent(Transform3D);
      const collider = entity.getComponent(Collider3D);

      if (transform && collider) {
        collidables.push({ entity, transform, collider });
      }
    }

    for (let i = 0; i < collidables.length; i++) {
      for (let j = i + 1; j < collidables.length; j++) {
        const a = collidables[i];
        const b = collidables[j];

        // Se ambos forem estáticos, não resolve colisão
        if (a.collider.isStatic && b.collider.isStatic) continue;

        if (this.checkCollision(a, b)) {
          this.resolveCollision(a, b);
        }
      }
    }
  }

  /**
   * Verifica sobreposição AABB nos eixos X, Y e Z.
   * @param {object} a
   * @param {object} b
   * @returns {boolean}
   */
  checkCollision(a, b) {
    const aMinX = a.transform.x - a.collider.width / 2;
    const aMaxX = a.transform.x + a.collider.width / 2;
    const aMinY = a.transform.y - a.collider.height / 2;
    const aMaxY = a.transform.y + a.collider.height / 2;
    const aMinZ = a.transform.z - a.collider.depth / 2;
    const aMaxZ = a.transform.z + a.collider.depth / 2;

    const bMinX = b.transform.x - b.collider.width / 2;
    const bMaxX = b.transform.x + b.collider.width / 2;
    const bMinY = b.transform.y - b.collider.height / 2;
    const bMaxY = b.transform.y + b.collider.height / 2;
    const bMinZ = b.transform.z - b.collider.depth / 2;
    const bMaxZ = b.transform.z + b.collider.depth / 2;

    return (
      aMinX <= bMaxX && aMaxX >= bMinX &&
      aMinY <= bMaxY && aMaxY >= bMinY &&
      aMinZ <= bMaxZ && aMaxZ >= bMinZ
    );
  }

  /**
   * Empurra a entidade dinâmica para fora da colisão.
   * @param {object} a
   * @param {object} b
   */
  resolveCollision(a, b) {
    const overlapX = (a.collider.width / 2 + b.collider.width / 2) - Math.abs(a.transform.x - b.transform.x);
    const overlapZ = (a.collider.depth / 2 + b.collider.depth / 2) - Math.abs(a.transform.z - b.transform.z);

    if (overlapX < overlapZ) {
      if (!a.collider.isStatic && b.collider.isStatic) {
        a.transform.x += a.transform.x > b.transform.x ? overlapX : -overlapX;
      } else if (a.collider.isStatic && !b.collider.isStatic) {
        b.transform.x += b.transform.x > a.transform.x ? overlapX : -overlapX;
      }
    } else {
      if (!a.collider.isStatic && b.collider.isStatic) {
        a.transform.z += a.transform.z > b.transform.z ? overlapZ : -overlapZ;
      } else if (a.collider.isStatic && !b.collider.isStatic) {
        b.transform.z += b.transform.z > a.transform.z ? overlapZ : -overlapZ;
      }
    }
  }
}
