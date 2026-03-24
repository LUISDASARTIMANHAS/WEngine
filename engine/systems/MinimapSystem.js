import { Transform } from "../components/Transform.js";
import { Tag } from "../components/Tag.js";
import { Sprite } from "../components/Sprite.js";

/**
 * Sistema de minimapa.
 */
export class MinimapSystem {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} [options={}]
   * @param {number} [options.worldWidth=1000]
   * @param {number} [options.worldHeight=1000]
   * @param {string} [options.backgroundColor="#0f172a"]
   * @param {boolean} [options.useSpriteColor=false]
   * @param {number} [options.minEntitySize=2]
   */
  constructor(canvas, options = {}) {
    /**
     * Canvas do minimapa.
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas;

    /**
     * Contexto do minimapa.
     * @type {CanvasRenderingContext2D|null}
     */
    this.ctx = canvas.getContext("2d");

    /**
     * Largura do mundo.
     * @type {number}
     */
    this.worldWidth = options.worldWidth ?? 1000;

    /**
     * Altura do mundo.
     * @type {number}
     */
    this.worldHeight = options.worldHeight ?? 1000;

    /**
     * Cor de fundo do minimapa.
     * @type {string}
     */
    this.backgroundColor = options.backgroundColor ?? "#0f172a";

    /**
     * Define se usa a cor do Sprite no minimapa.
     * @type {boolean}
     */
    this.useSpriteColor = options.useSpriteColor ?? false;

    /**
     * Tamanho mínimo visual para entidades muito pequenas.
     * @type {number}
     */
    this.minEntitySize = options.minEntitySize ?? 2;
  }

  /**
   * Renderiza o minimapa.
   * @param {import("../core/Scene.js").Scene} scene
   * @param {import("../core/Camera.js").Camera} camera
   * @returns {void}
   */
  render(scene, camera) {
    if (!this.ctx) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const entity of scene.entities) {
      if (entity.destroyed || !entity.active) {
        continue;
      }

      const transform = entity.getComponent(Transform);
      if (!transform) {
        continue;
      }

      this.#drawEntity(entity, transform);
    }

    this.#drawCamera(camera);
  }

  /**
   * Desenha uma entidade no minimapa.
   * @param {import("../core/Entity.js").Entity} entity
   * @param {Transform} transform
   * @returns {void}
   */
  #drawEntity(entity, transform) {
    if (!this.ctx) {
      return;
    }

    const tag = entity.getComponent(Tag);
    const sprite = entity.getComponent(Sprite);

    const minimapX = this.#scaleX(transform.x);
    const minimapY = this.#scaleY(transform.y);

    const minimapWidth = Math.max(
      this.minEntitySize,
      this.#scaleWidth(transform.width)
    );
    const minimapHeight = Math.max(
      this.minEntitySize,
      this.#scaleHeight(transform.height)
    );

    this.ctx.fillStyle = this.useSpriteColor && sprite
      ? sprite.color
      : this.#resolveColor(tag?.name ?? "");

    this.ctx.fillRect(
      minimapX,
      minimapY,
      minimapWidth,
      minimapHeight
    );
  }

  /**
   * Escala posição X do mundo para o minimapa.
   * @param {number} x
   * @returns {number}
   */
  #scaleX(x) {
    return (x / this.worldWidth) * this.canvas.width;
  }

  /**
   * Escala posição Y do mundo para o minimapa.
   * @param {number} y
   * @returns {number}
   */
  #scaleY(y) {
    return (y / this.worldHeight) * this.canvas.height;
  }

  /**
   * Escala largura do mundo para o minimapa.
   * @param {number} width
   * @returns {number}
   */
  #scaleWidth(width) {
    return (width / this.worldWidth) * this.canvas.width;
  }

  /**
   * Escala altura do mundo para o minimapa.
   * @param {number} height
   * @returns {number}
   */
  #scaleHeight(height) {
    return (height / this.worldHeight) * this.canvas.height;
  }

  /**
   * Resolve a cor da entidade.
   * @param {string} tagName
   * @returns {string}
   */
  #resolveColor(tagName) {
    if (tagName === "player") return "#3b82f6";
    if (tagName === "enemy") return "#22c55e";
    if (tagName === "factory") return "#f97316";
    if (tagName === "wall") return "#6b7280";
    if (tagName === "bullet") return "#facc15";
    return "#e5e7eb";
  }

  /**
   * Desenha a área visível da câmera no minimapa.
   * @param {import("../core/Camera.js").Camera} camera
   * @returns {void}
   */
  #drawCamera(camera) {
    if (!this.ctx) {
      return;
    }

    const x = this.#scaleX(camera.x);
    const y = this.#scaleY(camera.y);
    const width = this.#scaleWidth(camera.width);
    const height = this.#scaleHeight(camera.height);

    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, width, height);
  }
}