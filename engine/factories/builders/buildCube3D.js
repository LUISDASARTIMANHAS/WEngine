import { Entity } from "../../core/Entity.js";
import { Transform3D } from "../../components/Transform3D.js";
import { Mesh3D } from "../../components/Mesh3D.js";
import { Collider3D } from "../../components/Collider3D.js";

/**
 * Constrói uma entidade de cubo 3D.
 * @param {object} [options]
   * @param {string} [options.name="Cube3D"]
 * @param {number} [options.x=0]
 * @param {number} [options.y=0]
 * @param {number} [options.z=0]
 * @param {number} [options.size=1]
 * @param {number[]} [options.color=[0.2, 0.6, 1.0, 1.0]]
 * @param {boolean} [options.isStatic=true]
 * @returns {Entity}
 */
export function buildCube3D(options = {}) {
  const {
    name = "Cube3D",
    x = 0,
    y = 0,
    z = 0,
    size = 1,
    color = [0.2, 0.6, 1.0, 1.0],
    isStatic = true,
  } = options;

  const entity = new Entity(name);
  entity.add(new Transform3D(x, y, z, 0, 0, 0, size, size, size));
  entity.add(Mesh3D.createCube(1, color));
  entity.add(new Collider3D(size, size, size, isStatic));

  return entity;
}
