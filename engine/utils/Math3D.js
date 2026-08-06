/**
 * Utilitários de Matemática 3D para a WEngine (Vetores e Matrizes 4x4).
 */

export class Vector3 {
  /**
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   */
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const len = this.length();
    if (len > 0.00001) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
    }
    return this;
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v) {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    return this.set(x, y, z);
  }

  distanceTo(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  static cross(a, b) {
    return new Vector3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }

  static sub(a, b) {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
  }
}

export class Matrix4 {
  constructor() {
    /**
     * Matriz de 16 elementos em ordem de coluna (column-major) para WebGL.
     * @type {Float32Array}
     */
    this.elements = new Float32Array(16);
    this.identity();
  }

  identity() {
    const e = this.elements;
    e[0] = 1; e[4] = 0; e[8]  = 0; e[12] = 0;
    e[1] = 0; e[5] = 1; e[9]  = 0; e[13] = 0;
    e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
    e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
    return this;
  }

  /**
   * Multiplica esta matriz por outra.
   * @param {Matrix4} b
   * @returns {Matrix4}
   */
  multiply(b) {
    const ae = this.elements;
    const be = b.elements;
    const te = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      const ai0 = ae[i], ai1 = ae[i + 4], ai2 = ae[i + 8], ai3 = ae[i + 12];
      te[i]      = ai0 * be[0]  + ai1 * be[1]  + ai2 * be[2]  + ai3 * be[3];
      te[i + 4]  = ai0 * be[4]  + ai1 * be[5]  + ai2 * be[6]  + ai3 * be[7];
      te[i + 8]  = ai0 * be[8]  + ai1 * be[9]  + ai2 * be[10] + ai3 * be[11];
      te[i + 12] = ai0 * be[12] + ai1 * be[13] + ai2 * be[14] + ai3 * be[15];
    }

    this.elements.set(te);
    return this;
  }

  /**
   * Cria uma matriz de projeção perspectiva.
   * @param {number} fovInDegrees
   * @param {number} aspect
   * @param {number} near
   * @param {number} far
   * @returns {Matrix4}
   */
  perspective(fovInDegrees, aspect, near, far) {
    const fovRad = (fovInDegrees * Math.PI) / 180;
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fovRad);
    const rangeInv = 1.0 / (near - far);
    const e = this.elements;

    e[0] = f / aspect; e[4] = 0; e[8] = 0;                      e[12] = 0;
    e[1] = 0;          e[5] = f; e[9] = 0;                      e[13] = 0;
    e[2] = 0;          e[6] = 0; e[10] = (near + far) * rangeInv; e[14] = 2 * near * far * rangeInv;
    e[3] = 0;          e[7] = 0; e[11] = -1;                    e[15] = 0;

    return this;
  }

  /**
   * Cria matriz LookAt.
   * @param {Vector3} eye
   * @param {Vector3} center
   * @param {Vector3} up
   * @returns {Matrix4}
   */
  lookAt(eye, center, up) {
    const zAxis = Vector3.sub(eye, center).normalize();
    const xAxis = Vector3.cross(up, zAxis).normalize();
    const yAxis = Vector3.cross(zAxis, xAxis);

    const e = this.elements;
    e[0] = xAxis.x; e[4] = xAxis.y; e[8]  = xAxis.z; e[12] = -xAxis.dot(eye);
    e[1] = yAxis.x; e[5] = yAxis.y; e[9]  = yAxis.z; e[13] = -yAxis.dot(eye);
    e[2] = zAxis.x; e[6] = zAxis.y; e[10] = zAxis.z; e[14] = -zAxis.dot(eye);
    e[3] = 0;       e[7] = 0;       e[11] = 0;        e[15] = 1;

    return this;
  }

  /**
   * Aplica uma tradução.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Matrix4}
   */
  translate(x, y, z) {
    const m = new Matrix4();
    const e = m.elements;
    e[12] = x;
    e[13] = y;
    e[14] = z;
    return this.multiply(m);
  }

  /**
   * Aplica rotação no eixo X (radianos).
   * @param {number} rad
   * @returns {Matrix4}
   */
  rotateX(rad) {
    const m = new Matrix4();
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const e = m.elements;
    e[5] = c;  e[9] = -s;
    e[6] = s;  e[10] = c;
    return this.multiply(m);
  }

  /**
   * Aplica rotação no eixo Y (radianos).
   * @param {number} rad
   * @returns {Matrix4}
   */
  rotateY(rad) {
    const m = new Matrix4();
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const e = m.elements;
    e[0] = c;   e[8] = s;
    e[2] = -s;  e[10] = c;
    return this.multiply(m);
  }

  /**
   * Aplica rotação no eixo Z (radianos).
   * @param {number} rad
   * @returns {Matrix4}
   */
  rotateZ(rad) {
    const m = new Matrix4();
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const e = m.elements;
    e[0] = c;  e[4] = -s;
    e[1] = s;  e[5] = c;
    return this.multiply(m);
  }

  /**
   * Aplica escala nos eixos.
   * @param {number} sx
   * @param {number} sy
   * @param {number} sz
   * @returns {Matrix4}
   */
  scale(sx, sy, sz) {
    const m = new Matrix4();
    const e = m.elements;
    e[0] = sx;
    e[5] = sy;
    e[10] = sz;
    return this.multiply(m);
  }

  /**
   * Computa a matriz de transformação composta (translation * rotation * scale).
   * @param {Vector3} pos
   * @param {Vector3} rotRad
   * @param {Vector3} scl
   * @returns {Matrix4}
   */
  static compose(pos, rotRad, scl) {
    const mat = new Matrix4();
    mat.translate(pos.x, pos.y, pos.z);
    if (rotRad.x) mat.rotateX(rotRad.x);
    if (rotRad.y) mat.rotateY(rotRad.y);
    if (rotRad.z) mat.rotateZ(rotRad.z);
    if (scl.x !== 1 || scl.y !== 1 || scl.z !== 1) mat.scale(scl.x, scl.y, scl.z);
    return mat;
  }
}
