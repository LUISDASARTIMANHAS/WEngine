import { buildPlayer } from "../engine/factories/builders/buildPlayer.js";
import { buildEnemy } from "../engine/factories/builders/buildEnemy.js";
import { buildWall } from "../engine/factories/builders/buildWall.js";
import { buildBullet } from "../engine/factories/builders/buildBullet.js";
import { buildFactory } from "../engine/factories/builders/buildFactory.js";

/**
 * Registra os builders padrão usados no jogo demo.
 * @param {import("../engine/core/Engine.js").Engine} engine
 * @returns {void}
 */
export function registerDemoBuilders(engine) {
  engine.entityFactory.register("player", buildPlayer);
  engine.entityFactory.register("enemy", buildEnemy);
  engine.entityFactory.register("wall", buildWall);
  engine.entityFactory.register("bullet", buildBullet);
  engine.entityFactory.register("factory", buildFactory);
}