import { Entity } from "../../core/Entity.js";
import { Transform } from "../../components/Transform.js";
import { Sprite } from "../../components/Sprite.js";
import { Collider } from "../../components/Collider.js";
import { Team } from "../../components/Team.js";
import { Tag } from "../../components/Tag.js";

/**
 * Cria e configura uma parede.
 * @param {object} [options={}]
 * @param {string} [options.name="Wall"]
 * @param {number} [options.x=0]
 * @param {number} [options.y=0]
 * @param {number} [options.width=50]
 * @param {number} [options.height=50]
 * @param {string} [options.color="#6b7280"]
 * @returns {Entity}
 */
export function buildWall(options = {}) {
  return new Entity(options.name ?? "Wall")
    .add(
      new Transform(
        options.x ?? 0,
        options.y ?? 0,
        options.width ?? 50,
        options.height ?? 50,
      ),
    )
    .add(new Sprite(options.color ?? "#6b7280"))
    .add(new Collider(true))
    .add(new Tag("wall"))
    .add(new Team("neutral"));
}