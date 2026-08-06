import { Entity } from "../../core/Entity.js";
import { Transform3D } from "../../components/Transform3D.js";
import { Mesh3D } from "../../components/Mesh3D.js";
import { Collider3D } from "../../components/Collider3D.js";
import { KeyboardMovement3D } from "../../behaviours/KeyboardMovement3D.js";

/**
 * Constrói uma entidade de jogador 3D controlável.
 * @param {object} [options]
 * @param {string} [options.name="Player3D"]
 * @param {number} [options.x=0]
 * @param {number} [options.y=0.75]
 * @param {number} [options.z=0]
 * @param {number} [options.speed=6]
 * @param {number[]} [options.color=[0.9, 0.2, 0.3, 1.0]]
 * @returns {Entity}
 */
export function buildPlayer3D(options = {}) {
  const {
    name = "Player3D",
    x = 0,
    y = 0.75,
    z = 0,
    speed = 6,
    color = [0.9, 0.2, 0.3, 1.0],
  } = options;

  const entity = new Entity(name);
  entity.add(new Transform3D(x, y, z, 0, 0, 0, 1.2, 1.5, 1.2));
  entity.add(Mesh3D.createCube(1, color));
  entity.add(new Collider3D(1.2, 1.5, 1.2, false));
  entity.add(new KeyboardMovement3D(speed, 2.5));

  return entity;
}
