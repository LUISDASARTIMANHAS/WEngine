import { Transform3D } from "../components/Transform3D.js";
import { Velocity3D } from "../components/Velocity3D.js";
import { Collider3D } from "../components/Collider3D.js";

/**
 * Sistema de Física 3D.
 * Atualiza velocidades e aplica forças, gravidade e colisões.
 */
export class PhysicsSystem3D {
  constructor() {
    /**
     * Margem de colisão para detecção de chão.
     * @type {number}
     */
    this.collisionMargin = 0.01;
  }

  /**
   * Atualiza o sistema de física.
   * @param {import("../../core/Scene.js").Scene} scene
   * @param {number} deltaTime
   * @returns {void}
   */
  update(scene, deltaTime) {
    const entities = scene.entities;

    // Atualizar velocidades de todas as entidades
    for (const entity of entities) {
      if (!entity.active || entity.destroyed) continue;

      const velocity = entity.getComponent(Velocity3D);
      if (velocity) {
        velocity.update(deltaTime);
      }
    }

    // Aplicar velocidades às posições
    for (const entity of entities) {
      if (!entity.active || entity.destroyed) continue;

      const transform = entity.getComponent(Transform3D);
      const velocity = entity.getComponent(Velocity3D);
      const collider = entity.getComponent(Collider3D);

      if (!transform || !velocity) continue;
      if (collider?.isStatic) continue;

      // Aplicar velocidade à posição
      transform.position.x += velocity.velocity.x * deltaTime;
      transform.position.y += velocity.velocity.y * deltaTime;
      transform.position.z += velocity.velocity.z * deltaTime;

      // Checar colisões com objetos estáticos para melhorar detecção de chão
      this.checkCollisionsWithStatic(entity, entities);
    }
  }

  /**
   * Verifica colisões com objetos estáticos.
   * @private
   * @param {import("../../core/Entity.js").Entity} entity
   * @param {Array} entities
   * @returns {void}
   */
  checkCollisionsWithStatic(entity, entities) {
    const transform = entity.getComponent(Transform3D);
    const collider = entity.getComponent(Collider3D);
    const velocity = entity.getComponent(Velocity3D);

    if (!transform || !collider || !velocity) return;

    // Obter bounds da entidade
    const bounds = collider.getBounds(transform);

    // Verificar colisão com cada entidade estática
    for (const otherEntity of entities) {
      if (otherEntity === entity || !otherEntity.active || otherEntity.destroyed) continue;

      const otherTransform = otherEntity.getComponent(Transform3D);
      const otherCollider = otherEntity.getComponent(Collider3D);

      // Só fazer física com objetos estáticos ou cinemáticos
      if (!otherCollider || !otherCollider.isStatic) continue;
      if (!otherTransform) continue;

      const otherBounds = otherCollider.getBounds(otherTransform);

      // AABB collision detection
      const isColliding = this.checkAABBCollision(bounds, otherBounds);

      if (isColliding) {
        // Resolver colisão
        this.resolveCollision(entity, otherEntity, bounds, otherBounds, velocity);
      }
    }
  }

  /**
   * Verifica colisão AABB simples.
   * @private
   * @param {object} boundsA
   * @param {object} boundsB
   * @returns {boolean}
   */
  checkAABBCollision(boundsA, boundsB) {
    return !(
      boundsA.max.x < boundsB.min.x ||
      boundsA.min.x > boundsB.max.x ||
      boundsA.max.y < boundsB.min.y ||
      boundsA.min.y > boundsB.max.y ||
      boundsA.max.z < boundsB.min.z ||
      boundsA.min.z > boundsB.max.z
    );
  }

  /**
   * Resolve colisão entre duas entidades.
   * @private
   * @param {import("../../core/Entity.js").Entity} entity
   * @param {import("../../core/Entity.js").Entity} otherEntity
   * @param {object} bounds
   * @param {object} otherBounds
   * @param {Velocity3D} velocity
   * @returns {void}
   */
  resolveCollision(entity, otherEntity, bounds, otherBounds, velocity) {
    const transform = entity.getComponent(Transform3D);
    if (!transform) return;

    // Calcular penetração em cada eixo
    const overlapX = Math.min(bounds.max.x - otherBounds.min.x, otherBounds.max.x - bounds.min.x);
    const overlapY = Math.min(bounds.max.y - otherBounds.min.y, otherBounds.max.y - bounds.min.y);
    const overlapZ = Math.min(bounds.max.z - otherBounds.min.z, otherBounds.max.z - bounds.min.z);

    // Encontrar o eixo com menor penetração
    if (overlapX <= overlapY && overlapX <= overlapZ) {
      // Colisão no eixo X
      if (bounds.min.x < otherBounds.min.x) {
        transform.position.x -= overlapX + this.collisionMargin;
      } else {
        transform.position.x += overlapX + this.collisionMargin;
      }
      velocity.velocity.x = 0;
    } else if (overlapY <= overlapX && overlapY <= overlapZ) {
      // Colisão no eixo Y
      if (bounds.min.y < otherBounds.min.y) {
        transform.position.y -= overlapY + this.collisionMargin;
      } else {
        transform.position.y += overlapY + this.collisionMargin;
      }
      velocity.velocity.y = 0;
    } else {
      // Colisão no eixo Z
      if (bounds.min.z < otherBounds.min.z) {
        transform.position.z -= overlapZ + this.collisionMargin;
      } else {
        transform.position.z += overlapZ + this.collisionMargin;
      }
      velocity.velocity.z = 0;
    }
  }
}
