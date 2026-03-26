import { Engine } from "../engine/core/Engine.js";
import { InputSystem } from "../engine/systems/InputSystem.js";
import { TestScene } from "./scenes/TestScene.js";
import { Transform } from "../engine/components/Transform.js";
import { Health } from "../engine/components/Health.js";
import { registerDemoBuilders } from "./registerDemoBuilders.js";

const canvas = document.getElementById("gameCanvas");
const debugFps = document.getElementById("debug-fps");
const debugEntities = document.getElementById("debug-entities");
const debugPlayerX = document.getElementById("debug-player-x");
const debugPlayerY = document.getElementById("debug-player-y");
const debugPlayerHp = document.getElementById("debug-player-hp");
const minimapCanvas = document.getElementById("minimapCanvas");

InputSystem.init();

const engine = new Engine(canvas);
registerDemoBuilders(engine);

const scene = new TestScene();

engine.setMinimap(minimapCanvas, {
  worldWidth: scene.mapWidth,
  worldHeight: scene.mapHeight,
  minEntitySize: 2,
  useSpriteColor: true,
});

engine.setScene(scene);

engine.onDebug = (currentEngine) => {
  const currentScene = currentEngine.currentScene;
  const player = currentScene?.getEntityByName("Player");

  debugFps.textContent = String(currentEngine.time.fps);
  debugEntities.textContent = String(currentScene?.entities.length ?? 0);

  const transform = player?.getComponent(Transform);
  const health = player?.getComponent(Health);

  debugPlayerX.textContent = transform ? transform.x.toFixed(2) : "0";
  debugPlayerY.textContent = transform ? transform.y.toFixed(2) : "0";
  debugPlayerHp.textContent = health
    ? `${health.currentHealth}/${health.maxHealth}`
    : "MORTO";
};

engine.start();