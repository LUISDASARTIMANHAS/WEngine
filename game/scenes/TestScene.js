import { Scene } from "../../engine/core/Scene.js";

/**
 * Cena de teste da engine 0.0.2
 */
export class TestScene extends Scene {
  constructor() {
    super("TestScene");

    /**
     * Largura do mapa.
     * @type {number}
     */
    this.mapWidth = 5000;

    /**
     * Altura do mapa.
     * @type {number}
     */
    this.mapHeight = 5000;
  }

  /**
   * Inicializa a cena.
   * @returns {void}
   */
  start() {
    const { entityFactory } = this.engine;

    const player = entityFactory.create("player", {
      x: 300,
      y: 300,
    });

    this.addEntity(player);

    this.#createWorldBounds();
    this.#createInternalWalls();
    this.#createFactories();

    this.engine.camera.target = player;
  }

  /**
   * Cria as paredes externas do mapa.
   * @returns {void}
   */
  #createWorldBounds() {
    const { entityFactory } = this.engine;
    const wallThickness = 80;

    this.addEntity(
      entityFactory.create("wall", {
        name: "WallTop",
        x: 0,
        y: 0,
        width: this.mapWidth,
        height: wallThickness,
      }),
    );

    this.addEntity(
      entityFactory.create("wall", {
        name: "WallBottom",
        x: 0,
        y: this.mapHeight - wallThickness,
        width: this.mapWidth,
        height: wallThickness,
      }),
    );

    this.addEntity(
      entityFactory.create("wall", {
        name: "WallLeft",
        x: 0,
        y: 0,
        width: wallThickness,
        height: this.mapHeight,
      }),
    );

    this.addEntity(
      entityFactory.create("wall", {
        name: "WallRight",
        x: this.mapWidth - wallThickness,
        y: 0,
        width: wallThickness,
        height: this.mapHeight,
      }),
    );
  }

  /**
   * Cria alguns blocos internos para dar mais cara de mapa.
   * @returns {void}
   */
  #createInternalWalls() {
    const { entityFactory } = this.engine;

    const walls = [
      { name: "Block_A", x: 700, y: 500, width: 500, height: 60 },
      { name: "Block_B", x: 1400, y: 1000, width: 60, height: 600 },
      { name: "Block_C", x: 2200, y: 900, width: 700, height: 60 },
      { name: "Block_D", x: 3000, y: 1400, width: 60, height: 700 },
      { name: "Block_E", x: 800, y: 2200, width: 900, height: 60 },
      { name: "Block_F", x: 1900, y: 2800, width: 60, height: 800 },
      { name: "Block_G", x: 2800, y: 2600, width: 800, height: 60 },
      { name: "Block_H", x: 3600, y: 800, width: 60, height: 900 },
      { name: "Block_I", x: 3500, y: 3400, width: 900, height: 60 },
    ];

    for (const wall of walls) {
      this.addEntity(entityFactory.create("wall", wall));
    }
  }

  /**
   * Cria várias fábricas espalhadas pelo mapa.
   * Cada fábrica gera no máximo 25 inimigos próprios.
   * @returns {void}
   */
  #createFactories() {
    const { entityFactory } = this.engine;

    const factoryPositions = [
      { x: 900, y: 900 },
      { x: 1800, y: 600 },
      { x: 3200, y: 700 },
      { x: 4200, y: 1200 },
      { x: 1000, y: 3200 },
      { x: 2300, y: 2100 },
      { x: 3800, y: 2600 },
      { x: 4200, y: 3900 },
    ];

    for (let index = 0; index < factoryPositions.length; index += 1) {
      const position = factoryPositions[index];

      const factory = entityFactory.create("factory", {
        name: `Factory_${index + 1}`,
        x: position.x,
        y: position.y,
        width: 90,
        height: 90,
        spawnInterval: 1.2,
        maxChildren: 25,
        spawnRadius: 140,
      });

      this.addEntity(factory);
    }
  }
}