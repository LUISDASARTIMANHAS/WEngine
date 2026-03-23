import { Scene } from "../../engine/core/Scene.js";
import { FactorySpawner } from "../scripts/FactorySpawner.js";
import { Transform } from "../../engine/components/Transform.js";

/**
 * Cena de teste da engine 0.0.2
 */
export class TestScene extends Scene {
  constructor() {
    super("TestScene");
  }

  /**
   * Inicializa a cena.
   * @returns {void}
   */
  start() {
    const { entityFactory } = this.engine;

    const player = entityFactory.createPlayer({
      x: 120,
      y: 120
    });
    this.addEntity(player);

    const enemyA = entityFactory.createEnemy({
      x: 500,
      y: 200
    });
    this.addEntity(enemyA);

    const enemyB = entityFactory.createEnemy({
      x: 620,
      y: 320
    });
    this.addEntity(enemyB);

    const wallTop = entityFactory.createWall({
      name: "WallTop",
      x: 0,
      y: 0,
      width: 1200,
      height: 40
    });
    this.addEntity(wallTop);

    const wallLeft = entityFactory.createWall({
      name: "WallLeft",
      x: 0,
      y: 0,
      width: 40,
      height: 900
    });
    this.addEntity(wallLeft);

    const wallRight = entityFactory.createWall({
      name: "WallRight",
      x: 900,
      y: 0,
      width: 40,
      height: 900
    });
    this.addEntity(wallRight);

    const wallBottom = entityFactory.createWall({
      name: "WallBottom",
      x: 0,
      y: 700,
      width: 1200,
      height: 40
    });
    this.addEntity(wallBottom);

    const centerBlock = entityFactory.createWall({
      name: "CenterBlock",
      x: 350,
      y: 220,
      width: 180,
      height: 40
    });
    this.addEntity(centerBlock);

    const factory = entityFactory.createFactory({
      x: 720,
      y: 120
    });
    factory.addComponent(new FactorySpawner(4, 6));
    this.addEntity(factory);

    const factoryTransform = factory.getComponent(Transform);
    if (factoryTransform) {
      factoryTransform.width = 70;
      factoryTransform.height = 70;
    }

    this.engine.camera.target = player;
  }
}