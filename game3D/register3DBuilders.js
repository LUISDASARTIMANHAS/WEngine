import { buildCube3D } from "../engine/factories/builders/buildCube3D.js";
import { buildPlayer3D } from "../engine/factories/builders/buildPlayer3D.js";
import { buildGround3D } from "../engine/factories/builders/buildGround3D.js";
import { buildLight3D } from "../engine/factories/builders/buildLight3D.js";

/**
 * Registra os builders 3D na fábrica de entidades da engine.
 * @param {import("../engine/core/Engine.js").Engine} engine
 */
export function register3DBuilders(engine) {
  const factory = engine.entityFactory;

  factory.register("cube3d", buildCube3D);
  factory.register("player3d", buildPlayer3D);
  factory.register("ground3d", buildGround3D);
  factory.register("light3d", buildLight3D);
}
