import { Entity } from "../../core/Entity.js";
import { Transform } from "../../components/Transform.js";
import { Sprite } from "../../components/Sprite.js";
import { Collider } from "../../components/Collider.js";
import { Health } from "../../components/Health.js";
import { Team } from "../../components/Team.js";
import { Tag } from "../../components/Tag.js";
import { Spawner } from "../../components/Spawner.js";

/**
 * Cria e configura uma fábrica/spawner.
 * @param {object} [options={}]
 * @param {string} [options.name="Factory"]
 * @param {number} [options.x=700]
 * @param {number} [options.y=120]
 * @param {number} [options.width=64]
 * @param {number} [options.height=64]
 * @param {number} [options.health=150]
 * @param {string} [options.team="enemy"]
 * @param {string} [options.color="#f97316"]
 * @param {boolean} [options.enableSpawner=true]
 * @param {number} [options.spawnInterval=1]
 * @param {number} [options.maxChildren=25]
 * @param {number} [options.spawnRadius=140]
 * @param {(scene: any, x: number, y: number) => import("../../core/Entity.js").Entity} [options.createEntity]
 * @returns {Entity}
 */
export function buildFactory(options = {}) {
  const factory = new Entity(options.name ?? "Factory")
    .add(
      new Transform(
        options.x ?? 700,
        options.y ?? 120,
        options.width ?? 64,
        options.height ?? 64,
      ),
    )
    .add(new Sprite(options.color ?? "#f97316"))
    .add(new Collider(true))
    .add(new Health(options.health ?? 150))
    .add(new Team(options.team ?? "enemy"))
    .add(new Tag("factory"));

  if (options.enableSpawner ?? true) {
    factory.add(
      new Spawner({
        interval: options.spawnInterval ?? 1,
        maxChildren: options.maxChildren ?? 25,
        spawnRadius: options.spawnRadius ?? 140,
        createEntity:
          options.createEntity ??
          ((scene, x, y) => scene.engine.entityFactory.create("enemy", { x, y })),
      }),
    );
  }

  return factory;
}