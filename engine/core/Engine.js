import { Camera } from "./Camera.js";
import { Camera3D } from "./Camera3D.js";
import { RenderSystem } from "../systems/RenderSystem.js";
import { RenderSystem3D } from "../systems/RenderSystem3D.js";
import { CollisionSystem } from "../systems/CollisionSystem.js";
import { CollisionSystem3D } from "../systems/CollisionSystem3D.js";
import { PhysicsSystem3D } from "../3d/systems/PhysicsSystem3D.js";
import { DamageSystem } from "../systems/DamageSystem.js";
import { CleanupSystem } from "../systems/CleanupSystem.js";
import { Time } from "../utils/Time.js";
import { Logger } from "../utils/Logger.js";
import { EntityFactory } from "../factories/EntityFactory.js";
import { MinimapSystem } from "../systems/MinimapSystem.js";
import { ErrorDisplaySystem } from "../systems/ErrorDisplaySystem.js";

/**
 * Núcleo principal da engine.
 */
export class Engine {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} [options]
   * @param {'2d'|'3d'} [options.mode='2d'] Modo de renderização da engine
   */
  constructor(canvas, options = {}) {
    /**
     * Canvas principal.
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas;

    /**
     * Modo de operação ('2d' ou '3d').
     * @type {'2d'|'3d'}
     */
    this.mode = options.mode || "2d";

    /**
     * Contexto 2D (se modo 2d).
     * @type {CanvasRenderingContext2D|null}
     */
    this.ctx = null;

    /**
     * Contexto WebGL (se modo 3d).
     * @type {WebGLRenderingContext|null}
     */
    this.gl = null;

    if (this.mode === "3d") {
      this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!this.gl) {
        throw new Error("Não foi possível obter o contexto WebGL do canvas.");
      }
    } else {
      this.ctx = canvas.getContext("2d");
      if (!this.ctx) {
        throw new Error("Não foi possível obter o contexto 2D do canvas.");
      }
    }

    /**
     * Cena atual.
     * @type {import("./Scene.js").Scene|null}
     */
    this.currentScene = null;

    /**
     * Sistema de minimapa.
     * @type {MinimapSystem|null}
     */
    this.minimapSystem = null;

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
     * Métricas de performance do último frame.
     * @type {{mode:string,sceneName:string,entityCount:number,fps:number,deltaTime:number,totalFrameMs:number,updateMs:number,physicsMs:number,collisionMs:number,damageMs:number,cameraMs:number,renderMs:number,cleanupMs:number,debugMs:number}|null}
     */
    this.lastPerformanceMetrics = null;

    /**
     * Métricas de performance do último frame.
     * @type {{fps:number, deltaTime:number, totalFrameMs:number, updateMs:number, physicsMs:number, collisionMs:number, damageMs:number, cameraMs:number, renderMs:number, cleanupMs:number, debugMs:number}|null}
     */
    this.lastPerformanceMetrics = null;

    /**
     * Logger central.
     * @type {Logger}
     */
    this.logger = new Logger({
      enabled: true,
      debugEnabled: true,
      prefix: "WEngine",
    });

    /**
     * Câmeras.
     */
    this.camera = new Camera();
    this.camera.width = canvas.width;
    this.camera.height = canvas.height;

    this.camera3D = new Camera3D({
      fov: options.fov || 60,
      aspect: canvas.width / (canvas.height || 1),
    });

    /**
     * Sistemas de renderização.
     */
    this.renderSystem = this.ctx ? new RenderSystem(this.ctx, this.camera) : null;
    this.renderSystem3D = this.gl ? new RenderSystem3D(this.gl, this.camera3D) : null;

    /**
     * Sistemas de colisão.
     */
    this.collisionSystem = new CollisionSystem();
    this.collisionSystem3D = new CollisionSystem3D();

    /**
     * Sistema de física 3D.
     * @type {PhysicsSystem3D}
     */
    this.physicsSystem3D = new PhysicsSystem3D();

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
    this.entityFactory = new EntityFactory(this.logger);

    /**
     * Sistema de exibição de erros na tela.
     * @type {ErrorDisplaySystem}
     */
    this.errorDisplaySystem = new ErrorDisplaySystem();

    this.logger.onLog = (entry) => {
      if (this.errorDisplaySystem) {
        this.errorDisplaySystem.addLog(entry);
      }
    };

    /**
     * Callback de debug.
     * @type {(engine: Engine) => void}
     */
    this.onDebug = () => {};

    this.logger.info("engine", "Engine inicializada.", {
      mode: this.mode,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
    });
  }

  /**
   * Define o minimapa da engine.
   * @param {HTMLCanvasElement} canvas
   * @param {object} [options={}]
   * @returns {void}
   */
  setMinimap(canvas, options = {}) {
    this.minimapSystem = new MinimapSystem(canvas, options);
  }

  /**
   * Define a cena atual.
   * @param {import("./Scene.js").Scene} scene
   * @return {void}
   */
  setScene(scene) {
    this.currentScene = scene;
    scene.engine = this;

    this.logger.info("scene", "Cena definida.", {
      sceneName: scene.name,
    });

    scene.start();

    this.logger.debug("scene", "Cena iniciada.", {
      sceneName: scene.name,
    });
  }

  /**
   * Inicia o loop principal.
   * @return {void}
   */
  start() {
    if (this.isRunning) {
      this.logger.warn(
        "engine",
        "Tentativa de iniciar a engine já em execução.",
      );
      return;
    }

    if (!this.currentScene) {
      this.logger.warn("engine", "Tentativa de iniciar sem cena definida.");
      return;
    }

    this.isRunning = true;
    this.logger.info("engine", "Loop principal iniciado.");

    requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Para o loop principal.
   * @return {void}
   */
  stop() {
    if (!this.isRunning) {
      this.logger.warn("engine", "Tentativa de parar a engine já parada.");
      return;
    }

    this.isRunning = false;

    this.logger.info("engine", "Loop principal interrompido.");
  }

  /**
   * Loop principal.
   * @param {number} currentTime
   * @return {void}
   */
  loop(currentTime) {
    if (!this.isRunning || !this.currentScene) {
      return;
    }
    if (this.minimapSystem && this.mode === "2d") {
      this.minimapSystem.render(this.currentScene, this.camera);
    }

    const frameStart = performance.now();
    const deltaTime = this.time.update(currentTime);

    const updateStart = performance.now();
    this.currentScene.update(deltaTime);
    const updateEnd = performance.now();

    const physicsStart = performance.now();
    if (this.mode === "3d") {
      this.physicsSystem3D.update(this.currentScene, deltaTime);
    }
    const physicsEnd = performance.now();

    const collisionStart = performance.now();
    if (this.mode === "3d") {
      this.collisionSystem3D.resolve(this.currentScene);
    } else {
      this.collisionSystem.resolve(this.currentScene);
    }
    const collisionEnd = performance.now();

    const damageStart = performance.now();
    this.damageSystem.process(this.currentScene);
    const damageEnd = performance.now();

    const cameraStart = performance.now();
    if (this.mode === "3d") {
      this.camera3D.update();
    } else {
      this.camera.update();
    }
    const cameraEnd = performance.now();

    const renderStart = performance.now();
    if (this.mode === "3d" && this.renderSystem3D) {
      this.renderSystem3D.render(this.currentScene);
    } else if (this.renderSystem) {
      this.renderSystem.render(this.currentScene);
    }
    const renderEnd = performance.now();

    const cleanupStart = performance.now();
    this.cleanupSystem.process(this.currentScene);
    const cleanupEnd = performance.now();

    const debugStart = performance.now();
    this.onDebug(this);
    const debugEnd = performance.now();

    const frameEnd = performance.now();

    const metrics = {
      mode: this.mode,
      sceneName: this.currentScene.name,
      entityCount: this.currentScene.entities.length,
      fps: this.time.fps,
      deltaTime,
      totalFrameMs: Number((frameEnd - frameStart).toFixed(3)),
      updateMs: Number((updateEnd - updateStart).toFixed(3)),
      physicsMs: Number((physicsEnd - physicsStart).toFixed(3)),
      collisionMs: Number((collisionEnd - collisionStart).toFixed(3)),
      damageMs: Number((damageEnd - damageStart).toFixed(3)),
      cameraMs: Number((cameraEnd - cameraStart).toFixed(3)),
      renderMs: Number((renderEnd - renderStart).toFixed(3)),
      cleanupMs: Number((cleanupEnd - cleanupStart).toFixed(3)),
      debugMs: Number((debugEnd - debugStart).toFixed(3)),
    };

    this.lastPerformanceMetrics = metrics;

    this.logger.debugThrottle(
      "engine-performance",
      2000,
      "engine",
      "Métricas de performance do frame.",
      metrics,
    );

    requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Adiciona um erro ao painel de exibição de erros.
   * @param {string} message - Mensagem de erro
   * @param {string} [source="Engine Error"] - Origem do erro
   * @param {string} [stack=""] - Stack trace do erro
   * @return {void}
   */
  displayError(message, source = "Engine Error", stack = "") {
    if (this.errorDisplaySystem) {
      this.errorDisplaySystem.addError(message, source, stack);
    }
  }

  /**
   * Retorna o sistema de exibição de erros.
   * @return {ErrorDisplaySystem}
   */
  getErrorDisplaySystem() {
    return this.errorDisplaySystem;
  }
}
