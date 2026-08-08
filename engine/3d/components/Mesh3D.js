import { Component } from "../../core/Component.js";

/**
 * Componente de malha 3D contendo geometria WebGL e geradores de primitivas.
 */
export class Mesh3D extends Component {
  /**
   * @param {object} options
   * @param {Float32Array} options.vertices Array de posições (x,y,z)
   * @param {Float32Array} [options.normals] Array de normais (nx,ny,nz)
   * @param {Float32Array} [options.uvs] Array de coordenadas de textura UV (u,v)
   * @param {Uint16Array} [options.indices] Array de índices de triângulos
   * @param {number[]} [options.color=[0.8, 0.8, 0.8, 1.0]] Cor RGBA (0.0 a 1.0)
   */
  constructor({ vertices, normals = null, uvs = null, indices = null, color = [0.8, 0.8, 0.8, 1.0] } = {}) {
    super();
    this.vertices = vertices || new Float32Array();
    this.normals = normals;
    this.uvs = uvs;
    this.indices = indices;
    this.color = color;
  }

  /**
   * Cubo 3D com normais e coordenadas UV.
   */
  static createCube(size = 1, color = [0.2, 0.6, 1.0, 1.0]) {
    const s = size / 2;

    const vertices = new Float32Array([
      // Front
      -s, -s,  s,   s, -s,  s,   s,  s,  s,  -s,  s,  s,
      // Back
      -s, -s, -s,  -s,  s, -s,   s,  s, -s,   s, -s, -s,
      // Top
      -s,  s, -s,  -s,  s,  s,   s,  s,  s,   s,  s, -s,
      // Bottom
      -s, -s, -s,   s, -s, -s,   s, -s,  s,  -s, -s,  s,
      // Right
       s, -s, -s,   s,  s, -s,   s,  s,  s,   s, -s,  s,
      // Left
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

    const uvs = new Float32Array([
      0, 0,  1, 0,  1, 1,  0, 1,
      1, 0,  1, 1,  0, 1,  0, 0,
      0, 1,  0, 0,  1, 0,  1, 1,
      1, 1,  0, 1,  0, 0,  1, 0,
      1, 0,  1, 1,  0, 1,  0, 0,
      0, 0,  1, 0,  1, 1,  0, 1,
    ]);

    const indices = new Uint16Array([
       0,  1,  2,      0,  2,  3,
       4,  5,  6,      4,  6,  7,
       8,  9, 10,      8, 10, 11,
      12, 13, 14,     12, 14, 15,
      16, 17, 18,     16, 18, 19,
      20, 21, 22,     20, 22, 23,
    ]);

    return new Mesh3D({ vertices, normals, uvs, indices, color });
  }

  /**
   * Plano 3D (Chão / Parede).
   */
  static createPlane(width = 10, depth = 10, color = [0.3, 0.3, 0.35, 1.0]) {
    const hw = width / 2;
    const hd = depth / 2;

    const vertices = new Float32Array([
      // Top face
      -hw, 0, -hd,
       hw, 0, -hd,
       hw, 0,  hd,
      -hw, 0,  hd,
      // Bottom face
      -hw, 0, -hd,
       hw, 0, -hd,
       hw, 0,  hd,
      -hw, 0,  hd,
    ]);

    const normals = new Float32Array([
      // Top normals
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      // Bottom normals
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
    ]);

    const uvs = new Float32Array([
      0, 0,
      1, 0,
      1, 1,
      0, 1,
      0, 0,
      1, 0,
      1, 1,
      0, 1,
    ]);

    const indices = new Uint16Array([
      // Top face (visível de cima)
      0, 1, 2,
      0, 2, 3,
      // Bottom face (visível de baixo)
      4, 6, 5,
      4, 7, 6,
    ]);

    return new Mesh3D({ vertices, normals, uvs, indices, color });
  }

  /**
   * Pirâmide 3D.
   */
  static createPyramid(baseSize = 1, height = 1.5, color = [1.0, 0.5, 0.1, 1.0]) {
    const b = baseSize / 2;
    const h = height;

    const vertices = new Float32Array([
      // Front
       0,  h,  0,  -b, 0,  b,   b, 0,  b,
      // Right
       0,  h,  0,   b, 0,  b,   b, 0, -b,
      // Back
       0,  h,  0,   b, 0, -b,  -b, 0, -b,
      // Left
       0,  h,  0,  -b, 0, -b,  -b, 0,  b,
      // Bottom
      -b,  0, -b,   b, 0, -b,   b, 0,  b,  -b, 0, b
    ]);

    const normals = new Float32Array([
       0, 0.7, 0.7,   0, 0.7, 0.7,   0, 0.7, 0.7,
       0.7, 0.7, 0,   0.7, 0.7, 0,   0.7, 0.7, 0,
       0, 0.7, -0.7,  0, 0.7, -0.7,  0, 0.7, -0.7,
      -0.7, 0.7, 0,  -0.7, 0.7, 0,  -0.7, 0.7, 0,
       0, -1, 0,      0, -1, 0,      0, -1, 0,    0, -1, 0
    ]);

    const uvs = new Float32Array([
      0.5, 1, 0, 0, 1, 0,
      0.5, 1, 0, 0, 1, 0,
      0.5, 1, 0, 0, 1, 0,
      0.5, 1, 0, 0, 1, 0,
      0, 0, 1, 0, 1, 1, 0, 1
    ]);

    const indices = new Uint16Array([
      0, 1, 2,
      3, 4, 5,
      6, 7, 8,
      9, 10, 11,
      12, 13, 14,  12, 14, 15
    ]);

    return new Mesh3D({ vertices, normals, uvs, indices, color });
  }

  /**
   * Esfera 3D Paramétrica.
   */
  static createSphere(radius = 1, latitudeBands = 16, longitudeBands = 16, color = [0.2, 0.8, 0.4, 1.0]) {
    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let lat = 0; lat <= latitudeBands; lat++) {
      const theta = (lat * Math.PI) / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let long = 0; long <= longitudeBands; long++) {
        const phi = (long * 2 * Math.PI) / longitudeBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;

        const u = 1 - long / longitudeBands;
        const v = 1 - lat / latitudeBands;

        normals.push(x, y, z);
        uvs.push(u, v);
        vertices.push(radius * x, radius * y, radius * z);
      }
    }

    for (let lat = 0; lat < latitudeBands; lat++) {
      for (let long = 0; long < longitudeBands; long++) {
        const first = lat * (longitudeBands + 1) + long;
        const second = first + longitudeBands + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    return new Mesh3D({
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
      color,
    });
  }

  /**
   * Cilindro 3D.
   */
  static createCylinder(radius = 1, height = 2, segments = 16, color = [0.9, 0.3, 0.3, 1.0]) {
    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    const halfH = height / 2;

    // Vértices do corpo
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle);
      const z = Math.sin(angle);
      const u = i / segments;

      // Topo
      vertices.push(x * radius, halfH, z * radius);
      normals.push(x, 0, z);
      uvs.push(u, 1);

      // Base
      vertices.push(x * radius, -halfH, z * radius);
      normals.push(x, 0, z);
      uvs.push(u, 0);
    }

    for (let i = 0; i < segments; i++) {
      const p1 = i * 2;
      const p2 = p1 + 1;
      const p3 = p1 + 2;
      const p4 = p1 + 3;

      indices.push(p1, p2, p3);
      indices.push(p2, p4, p3);
    }

    return new Mesh3D({
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
      color,
    });
  }

  /**
   * Torus 3D (Rosquinha).
   */
  static createTorus(radius = 1, tube = 0.3, radialSegments = 16, tubularSegments = 16, color = [0.9, 0.8, 0.1, 1.0]) {
    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++) {
        const u = (i / tubularSegments) * Math.PI * 2;
        const v = (j / radialSegments) * Math.PI * 2;

        const x = (radius + tube * Math.cos(v)) * Math.cos(u);
        const y = (radius + tube * Math.cos(v)) * Math.sin(u);
        const z = tube * Math.sin(v);

        vertices.push(x, y, z);

        const cx = radius * Math.cos(u);
        const cy = radius * Math.sin(u);
        const nx = x - cx;
        const ny = y - cy;
        const nz = z;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;

        normals.push(nx / len, ny / len, nz / len);
        uvs.push(i / tubularSegments, j / radialSegments);
      }
    }

    for (let j = 0; j < radialSegments; j++) {
      for (let i = 0; i < tubularSegments; i++) {
        const a = (tubularSegments + 1) * j + i;
        const b = (tubularSegments + 1) * (j + 1) + i;
        const c = (tubularSegments + 1) * (j + 1) + i + 1;
        const d = (tubularSegments + 1) * j + i + 1;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    return new Mesh3D({
      vertices: new Float32Array(vertices),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
      color,
    });
  }
}
