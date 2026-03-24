import { Entity } from "../../core/Entity.js";
import { Transform } from "../../components/Transform.js";
import { Sprite } from "../../components/Sprite.js";
import { Collider } from "../../components/Collider.js";
import { Health } from "../../components/Health.js";
import { Weapon } from "../../components/Weapon.js";
import { Team } from "../../components/Team.js";
import { Tag } from "../../components/Tag.js";
import { KeyboardMovement } from "../../behaviours/KeyboardMovement.js";
import { KeyboardShooter } from "../../behaviours/KeyboardShooter.js";

/**
 * Cria e configura a entidade player.
 * @param {object} [options={}]
 * @param {number} [options.x=100]
 * @param {number} [options.y=100]
 * @param {number} [options.width=32]
 * @param {number} [options.height=32]
 * @param {number} [options.health=100]
 * @param {number} [options.speed=180]
 * @param {number} [options.damage=20]
 * @param {number} [options.fireRate=0.25]
 * @param {number} [options.projectileSpeed=450]
 * @param {string} [options.color="#3b82f6"]
 * @param {string[]} [options.fireKeys=[" "]]
 * @returns {Entity}
 */
export function buildPlayer(options = {}) {
  return new Entity("Player")
    .add(
      new Transform(
        options.x ?? 100,
        options.y ?? 100,
        options.width ?? 32,
        options.height ?? 32,
      ),
    )
    .add(new Sprite(options.color ?? "#3b82f6"))
    .add(new Collider(false))
    .add(new Health(options.health ?? 100))
    .add(
      new Weapon({
        damage: options.damage ?? 20,
        fireRate: options.fireRate ?? 0.25,
        projectileSpeed: options.projectileSpeed ?? 450,
      }),
    )
    .add(new Team("player"))
    .add(new Tag("player"))
    .add(
      new KeyboardMovement({
        speed: options.speed ?? 180,
      }),
    )
    .add(
      new KeyboardShooter({
        fireKeys: options.fireKeys ?? [" "],
      }),
    );
}
