import { Entity } from "../../core/Entity.js";
import { Transform } from "../../components/Transform.js";
import { Sprite } from "../../components/Sprite.js";
import { Collider } from "../../components/Collider.js";
import { Health } from "../../components/Health.js";
import { Weapon } from "../../components/Weapon.js";
import { Team } from "../../components/Team.js";
import { Tag } from "../../components/Tag.js";
import { EnemyAI } from "../../ai/EnemyAI.js";

/**
 * Cria e configura a entidade inimigo.
 * @param {object} [options={}]
 * @param {string} [options.name]
 * @param {number} [options.x=400]
 * @param {number} [options.y=200]
 * @param {number} [options.width=30]
 * @param {number} [options.height=30]
 * @param {number} [options.health=40]
 * @param {number} [options.damage=8]
 * @param {number} [options.fireRate=0.9]
 * @param {number} [options.projectileSpeed=300]
 * @param {number} [options.speed=90]
 * @param {number} [options.detectionRadius=260]
 * @param {number} [options.stopDistance=28]
 * @param {string} [options.color="#22c55e"]
 * @param {string} [options.team="enemy"]
 * @param {string} [options.tag="enemy"]
 * @returns {Entity}
 */
export function buildEnemy(options = {}) {
  const enemyName =
    options.name ??
    `Enemy_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  return new Entity(enemyName)
    .add(
      new Transform(
        options.x ?? 400,
        options.y ?? 200,
        options.width ?? 30,
        options.height ?? 30,
      ),
    )
    .add(new Sprite(options.color ?? "#22c55e"))
    .add(new Collider(false))
    .add(new Health(options.health ?? 40))
    .add(new Team(options.team ?? "enemy"))
    .add(new Tag(options.tag ?? "enemy"))
    .add(
      new Weapon({
        damage: options.damage ?? 8,
        fireRate: options.fireRate ?? 0.9,
        projectileSpeed: options.projectileSpeed ?? 300,
      }),
    )
    .add(
      new EnemyAI({
        speed: options.speed ?? 90,
        detectionRadius: options.detectionRadius ?? 260,
        stopDistance: options.stopDistance ?? 28,
      }),
    );
}