import { Entity } from "../../core/Entity.js";
import { Transform3D } from "../../components/Transform3D.js";
import { Light3D } from "../../components/Light3D.js";
import { Vector3 } from "../../utils/Math3D.js";

/**
 * Constrói uma fonte de luz 3D na cena.
 * @param {object} [options]
 * @param {string} [options.name="SunLight3D"]
 * @param {'directional'|'ambient'|'point'} [options.type='directional']
 * @param {number[]} [options.color=[1.0, 0.95, 0.85]]
 * @param {number} [options.intensity=1.2]
 * @param {Vector3} [options.direction]
 * @returns {Entity}
 */
export function buildLight3D(options = {}) {
  const {
    name = "SunLight3D",
    type = 'directional',
    color = [1.0, 0.95, 0.85],
    intensity = 1.2,
    direction = new Vector3(-0.6, -1.0, -0.4),
  } = options;

  const entity = new Entity(name);
  entity.add(new Transform3D(0, 10, 0));
  entity.add(new Light3D({ type, color, intensity, direction }));

  return entity;
}
