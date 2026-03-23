import { Camera } from "./Camera.js";
import { RenderSystem } from "../systems/RenderSystem.js";
import { CollisionSystem } from "../systems/CollisionSystem.js";
import { DamageSystem } from "../systems/DamageSystem.js";
import { CleanupSystem } from "../systems/CleanupSystem.js";
import { Time } from "../utils/Time.js";
import { EntityFactory } from "../factories/EntityFactory.js";


/**
 * Núcleo principal da engine.
 */
export class Engine {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    /**
     * Canvas principal.
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas;

    /**
     * Contexto 2D.
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = canvas.getContext("2d");

    /**
     * Cena atual.
     * @type {import("./Scene.js").Scene|null}
     */
    this.currentScene = null;

    /**
     * Controle de execução.
     * @type {boolean}
     */
    this.isRunning = false;

    /**
     * Tempo da engine.
     * @type {Time}
     */
    this.time = new Time();

    /**
     * Câmera principal.
     * @type {Camera}
     */
    this.camera = new Camera();
    this.camera.width = canvas.width;
    this.camera.height = canvas.height;

    /**
     * Sistema de renderização.
     * @type {RenderSystem}
     */
    this.renderSystem = new RenderSystem(this.ctx, this.camera);

    /**
     * Sistema de colisão.
     * @type {CollisionSystem}
     */
    this.collisionSystem = new CollisionSystem();

    /**
     * Sistema de dano.
     * @type {DamageSystem}
     */
    this.damageSystem = new DamageSystem();

    /**
     * Sistema de limpeza.
     * @type {CleanupSystem}
     */
    this.cleanupSystem = new CleanupSystem();

    /**
     * Fábrica de entidades.
     * @type {EntityFactory}
     */
    this.entityFactory = new EntityFactory();

    /**
     * Callback de debug.
     * @type {(engine: Engine) => void}
     */
    this.onDebug = () => {};
  }

  /**
   * Define a cena atual.
   * @param {import("./Scene.js").Scene} scene
   * @return {void}
   */
  setScene(scene) {
    this.currentScene = scene;
    scene.engine = this;
    scene.start();
  }

  /**
   * Inicia o loop principal.
   * @return {void}
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Loop principal.
   * @param {number} currentTime
   * @return {void}
   */
  loop(currentTime) {
    if (!this.isRunning || !this.currentScene) return;

    const deltaTime = this.time.update(currentTime);

    this.currentScene.update(deltaTime);
    this.collisionSystem.resolve(this.currentScene);
    this.damageSystem.process(this.currentScene);
    this.camera.update();
    this.renderSystem.render(this.currentScene);
    this.cleanupSystem.process(this.currentScene);


    this.onDebug(this);

    requestAnimationFrame(this.loop.bind(this));
  }
}