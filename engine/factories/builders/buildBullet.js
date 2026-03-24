import { Entity } from "../../core/Entity.js";
import { Transform } from "../../components/Transform.js";
import { Sprite } from "../../components/Sprite.js";
import { Collider } from "../../components/Collider.js";
import { Projectile } from "../../components/Projectile.js";
import { Lifetime } from "../../components/Lifetime.js";
import { Damage } from "../../components/Damage.js";
import { Team } from "../../components/Team.js";
import { Tag } from "../../components/Tag.js";

/**
 * Cria e configura um projétil.
 * @param {object} [options={}]
 * @param {number} [options.x=0]
 * @param {number} [options.y=0]
 * @param {number} [options.width=10]
 * @param {number} [options.height=10]
 * @param {number} [options.directionX=1]
 * @param {number} [options.directionY=0]
 * @param {number} [options.speed=450]
 * @param {number} [options.damage=10]
 * @param {import("../../core/Entity.js").Entity|null} [options.owner=null]
 * @param {number} [options.lifetime=2]
 * @param {string} [options.color="#facc15"]
 * @returns {Entity}
 */
export function buildBullet(options = {}) {
  const ownerTeam = resolveOwnerTeam(options.owner ?? null);

  return new Entity("Bullet")
    .add(
      new Transform(
        options.x ?? 0,
        options.y ?? 0,
        options.width ?? 10,
        options.height ?? 10,
      ),
    )
    .add(new Sprite(options.color ?? "#facc15"))
    .add(new Collider(false))
    .add(
      new Projectile({
        speed: options.speed ?? 450,
        directionX: options.directionX ?? 1,
        directionY: options.directionY ?? 0,
        owner: options.owner ?? null,
      }),
    )
    .add(new Lifetime(options.lifetime ?? 2))
    .add(new Damage(options.damage ?? 10))
    .add(new Team(ownerTeam))
    .add(new Tag("bullet"));
}

/**
 * Descobre o time do dono do projétil.
 * @param {import("../../core/Entity.js").Entity|null} owner
 * @returns {"player"|"enemy"|"neutral"}
 */
function resolveOwnerTeam(owner) {
  if (!owner) {
    return "neutral";
  }

  const team = owner.getComponent(Team);
  return team?.name ?? "neutral";
}