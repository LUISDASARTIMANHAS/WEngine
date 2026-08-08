import { Component } from "../../core/Component.js";

/**
 * Componente de Material 3D para definir propriedades físicas/ópticas de superfícies WebGL.
 */
export class Material3D extends Component {
  /**
   * @param {object} options
   * @param {number[]} [options.color=[1.0, 1.0, 1.0, 1.0]] Cor base RGBA
   * @param {number[]} [options.specular=[1.0, 1.0, 1.0]] Cor especular RGB
   * @param {number} [options.shininess=32] Brilho especular (exp do Phong)
   * @param {HTMLImageElement|HTMLCanvasElement|WebGLTexture|null} [options.texture=null] Textura 2D
   * @param {boolean} [options.useTexture=false] Habilita mapeamento UV
   * @param {boolean} [options.wireframe=false] Renderiza apenas linhas
   */
  constructor({
    color = [1.0, 1.0, 1.0, 1.0],
    specular = [1.0, 1.0, 1.0],
    shininess = 32,
    texture = null,
    useTexture = false,
    wireframe = false,
  } = {}) {
    super();
    this.color = color;
    this.specular = specular;
    this.shininess = shininess;
    this.texture = texture;
    this.useTexture = useTexture || Boolean(texture);
    this.wireframe = wireframe;
  }

  /**
   * Gera uma textura de padrão xadrez (Checkerboard) procedural em canvas.
   * @param {number} [size=256]
   * @param {string} [color1="#ffffff"]
   * @param {string} [color2="#3388ff"]
   * @returns {HTMLCanvasElement}
   */
  static createCheckerboardTexture(size = 256, color1 = "#ffffff", color2 = "#3388ff") {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const tileSize = size / 8;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? color1 : color2;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    return canvas;
  }
}
