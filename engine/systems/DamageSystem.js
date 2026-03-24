import { Transform } from "../components/Transform.js";
import { Collider } from "../components/Collider.js";
import { Projectile } from "../components/Projectile.js";
import { Damage } from "../components/Damage.js";
import { Health } from "../components/Health.js";
import { Team } from "../components/Team.js";

/**
 * Sistema responsável por aplicar dano entre projéteis e alvos.
 */
export class DamageSystem {
  /**
   * Processa dano na cena atual.
   * @param {import("../core/Scene.js").Scene} scene
   * @returns {void}
   */
  process(scene) {
    const entities = scene.entities.filter((entity) => !entity.destroyed);

    for (const attacker of entities) {
      const attackerTransform = attacker.getComponent(Transform);
      const attackerCollider = attacker.getComponent(Collider);
      const attackerProjectile = attacker.getComponent(Projectile);
      const attackerDamage = attacker.getComponent(Damage);

      if (
        !attackerTransform ||
        !attackerCollider ||
        !attackerProjectile ||
        !attackerDamage
      ) {
        continue;
      }

      for (const target of entities) {
        if (attacker === target) continue;
        if (target === attackerProjectile.owner) continue;
        if (target.destroyed) continue;

        const targetTransform = target.getComponent(Transform);
        const targetCollider = target.getComponent(Collider);
        const targetHealth = target.getComponent(Health);

        if (!targetTransform || !targetCollider || !targetHealth) {
          continue;
        }

        if (!this.isColliding(attackerTransform, targetTransform)) {
          continue;
        }

        if (this.isSameTeam(attacker, target)) {
          continue;
        }

        targetHealth.takeDamage(attackerDamage.value);
        attacker.destroy();

        scene.engine?.logger?.info("damage", "Dano aplicado.", {
          attackerName: attacker.name,
          targetName: target.name,
          damageValue: attackerDamage.value
        });

        break;
      }
    }
  }

  /**
   * Verifica colisão AABB entre duas entidades.
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
   * Verifica se duas entidades pertencem ao mesmo time.
   * @param {import("../core/Entity.js").Entity} entityA
   * @param {import("../core/Entity.js").Entity} entityB
   * @returns {boolean}
   */
  isSameTeam(entityA, entityB) {
    const teamA = entityA.getComponent(Team);
    const teamB = entityB.getComponent(Team);

    if (!teamA || !teamB) return false;

    return teamA.name === teamB.name;
  }
}