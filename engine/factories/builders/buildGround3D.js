import { Entity } from "../../core/Entity.js";
import { Transform3D } from "../../components/Transform3D.js";
import { Mesh3D } from "../../components/Mesh3D.js";
import { Collider3D } from "../../components/Collider3D.js";

/**
 * Constrói o chão 3D.
 * @param {object} [options]
 * @param {string} [options.name="Ground3D"]
 * @param {number} [options.width=30]
 * @param {number} [options.depth=30]
 * @param {number[]} [options.color=[0.25, 0.28, 0.35, 1.0]]
 * @returns {Entity}
 */
export function buildGround3D(options = {}) {
  const {
    name = "Ground3D",
    width = 30,
    depth = 30,
    color = [0.25, 0.28, 0.35, 1.0],
  } = options;

  const entity = new Entity(name);
  entity.add(new Transform3D(0, 0, 0));
  entity.add(Mesh3D.createPlane(width, depth, color));
  entity.add(new Collider3D(width, 0.1, depth, true));

  return entity;
}
