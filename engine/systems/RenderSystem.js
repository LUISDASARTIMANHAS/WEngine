import { Transform } from "../components/Transform.js";
import { Sprite } from "../components/Sprite.js";

/**
 * Sistema de renderização 2D.
 */
export class RenderSystem {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {import("../core/Camera.js").Camera} camera
   */
  constructor(ctx, camera) {
    /**
     * Contexto 2D.
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;

    /**
     * Câmera principal.
     * @type {import("../core/Camera.js").Camera}
     */
    this.camera = camera;
  }

  /**
   * Renderiza a cena.
   * @param {import("../core/Scene.js").Scene} scene
   * @return {void}
   */
  render(scene) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (const entity of scene.entities) {
      const transform = entity.getComponent(Transform);
      const sprite = entity.getComponent(Sprite);

      if (!transform || !sprite) continue;

      this.ctx.fillStyle = sprite.color;
      this.ctx.fillRect(
        transform.x - this.camera.x,
        transform.y - this.camera.y,
        transform.width,
        transform.height
      );
    }
  }
}