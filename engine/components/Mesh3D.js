import { Component } from "../core/Component.js";

/**
 * Componente de malha 3D contendo geometria e propriedades visuais para WebGL.
 */
export class Mesh3D extends Component {
  /**
   * @param {object} options
   * @param {Float32Array} options.vertices Array de posições (x,y,z)
   * @param {Float32Array} [options.normals] Array de vetores normais (nx,ny,nz)
   * @param {Float32Array} [options.uvs] Array de coordenadas UV (u,v)
   * @param {Uint16Array} [options.indices] Array de índices de triângulos
   * @param {number[]} [options.color=[0.8, 0.8, 0.8, 1.0]] Cor RGBA (0.0 a 1.0)
   */
  constructor({ vertices, normals = null, uvs = null, indices = null, color = [0.8, 0.8, 0.8, 1.0] } = {}) {
    super();

    /**
     * Vértices 3D.
     * @type {Float32Array}
     */
    this.vertices = vertices || new Float32Array();

    /**
     * Normais de superfície para iluminação.
     * @type {Float32Array|null}
     */
    this.normals = normals;

    /**
     * Coordenadas de textura.
     * @type {Float32Array|null}
     */
    this.uvs = uvs;

    /**
     * Índices de malha.
     * @type {Uint16Array|null}
     */
    this.indices = indices;

    /**
     * Cor RGBA base.
     * @type {number[]}
     */
    this.color = color;
  }

  /**
   * Gera um cubo 3D com normais calculadas para iluminação.
   * @param {number} [size=1]
   * @param {number[]} [color=[0.2, 0.6, 1.0, 1.0]]
   * @returns {Mesh3D}
   */
  static createCube(size = 1, color = [0.2, 0.6, 1.0, 1.0]) {
    const s = size / 2;

    const vertices = new Float32Array([
      // Front face
      -s, -s,  s,   s, -s,  s,   s,  s,  s,  -s,  s,  s,
      // Back face
      -s, -s, -s,  -s,  s, -s,   s,  s, -s,   s, -s, -s,
      // Top face
      -s,  s, -s,  -s,  s,  s,   s,  s,  s,   s,  s, -s,
      // Bottom face
      -s, -s, -s,   s, -s, -s,   s, -s,  s,  -s, -s,  s,
      // Right face
       s, -s, -s,   s,  s, -s,   s,  s,  s,   s, -s,  s,
      // Left face
      -s, -s, -s,  -s, -s,  s,  -s,  s,  s,  -s,  s, -s,
    ]);

    const normals = new Float32Array([
      // Front
       0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1,
      // Back
       0,  0, -1,   0,  0, -1,   0,  0, -1,   0,  0, -1,
      // Top
       0,  1,  0,   0,  1,  0,   0,  1,  0,   0,  1,  0,
      // Bottom
       0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0,
      // Right
       1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0,
      // Left
      -1,  0,  0,  -1,  0,  0,  -1,  0,  0,  -1,  0,  0,
    ]);

    const indices = new Uint16Array([
       0,  1,  2,      0,  2,  3,    // Front
       4,  5,  6,      4,  6,  7,    // Back
       8,  9, 10,      8, 10, 11,    // Top
      12, 13, 14,     12, 14, 15,    // Bottom
      16, 17, 18,     16, 18, 19,    // Right
      20, 21, 22,     20, 22, 23,    // Left
    ]);

    return new Mesh3D({ vertices, normals, indices, color });
  }

  /**
   * Gera um plano (chão ou parede) em 3D.
   * @param {number} [width=10]
   * @param {number} [depth=10]
   * @param {number[]} [color=[0.3, 0.3, 0.35, 1.0]]
   * @returns {Mesh3D}
   */
  static createPlane(width = 10, depth = 10, color = [0.3, 0.3, 0.35, 1.0]) {
    const hw = width / 2;
    const hd = depth / 2;

    const vertices = new Float32Array([
      -hw, 0, -hd,
       hw, 0, -hd,
       hw, 0,  hd,
      -hw, 0,  hd,
    ]);

    const normals = new Float32Array([
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    ]);

    const indices = new Uint16Array([
      0, 1, 2,
      0, 2, 3,
    ]);

    return new Mesh3D({ vertices, normals, indices, color });
  }

  /**
   * Gera uma pirâmide 3D.
   * @param {number} [baseSize=1]
   * @param {number} [height=1.5]
   * @param {number[]} [color=[1.0, 0.5, 0.1, 1.0]]
   * @returns {Mesh3D}
   */
  static createPyramid(baseSize = 1, height = 1.5, color = [1.0, 0.5, 0.1, 1.0]) {
    const b = baseSize / 2;
    const h = height;

    const vertices = new Float32Array([
      // Front face
       0,  h,  0,  -b, 0,  b,   b, 0,  b,
      // Right face
       0,  h,  0,   b, 0,  b,   b, 0, -b,
      // Back face
       0,  h,  0,   b, 0, -b,  -b, 0, -b,
      // Left face
       0,  h,  0,  -b, 0, -b,  -b, 0,  b,
      // Bottom face
      -b,  0, -b,   b, 0, -b,   b, 0,  b,  -b, 0, b
    ]);

    const normals = new Float32Array([
       0, 0.7, 0.7,   0, 0.7, 0.7,   0, 0.7, 0.7,
       0.7, 0.7, 0,   0.7, 0.7, 0,   0.7, 0.7, 0,
       0, 0.7, -0.7,  0, 0.7, -0.7,  0, 0.7, -0.7,
      -0.7, 0.7, 0,  -0.7, 0.7, 0,  -0.7, 0.7, 0,
       0, -1, 0,      0, -1, 0,      0, -1, 0,    0, -1, 0
    ]);

    const indices = new Uint16Array([
      0, 1, 2,
      3, 4, 5,
      6, 7, 8,
      9, 10, 11,
      12, 13, 14,  12, 14, 15
    ]);

    return new Mesh3D({ vertices, normals, indices, color });
  }
}
