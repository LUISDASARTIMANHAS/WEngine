/**
 * Utilitários de Matemática 3D para a WEngine (Vetores, Ray, Matrizes 4x4).
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

export class Ray {
  constructor(origin = new Vector3(), direction = new Vector3(0, 0, -1)) {
    this.origin = origin;
    this.direction = direction.normalize();
  }

  /**
   * Ponto ao longo do raio no parâmetro t.
   */
  at(t) {
    return new Vector3(
      this.origin.x + this.direction.x * t,
      this.origin.y + this.direction.y * t,
      this.origin.z + this.direction.z * t
    );
  }

  /**
   * Intersecção com caixa AABB min/max.
   */
  intersectsAABB(min, max) {
    let tmin = (min.x - this.origin.x) / (this.direction.x || 0.00001);
    let tmax = (max.x - this.origin.x) / (this.direction.x || 0.00001);
    if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

    let tymin = (min.y - this.origin.y) / (this.direction.y || 0.00001);
    let tymax = (max.y - this.origin.y) / (this.direction.y || 0.00001);
    if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

    if ((tmin > tymax) || (tymin > tmax)) return null;

    if (tymin > tmin) tmin = tymin;
    if (tymax < tmax) tmax = tymax;

    let tzmin = (min.z - this.origin.z) / (this.direction.z || 0.00001);
    let tzmax = (max.z - this.origin.z) / (this.direction.z || 0.00001);
    if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

    if ((tmin > tzmax) || (tzmin > tmax)) return null;

    if (tzmin > tmin) tmin = tzmin;

    return tmin >= 0 ? tmin : null;
  }
}

export class Matrix4 {
  constructor() {
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

  orthographic(left, right, bottom, top, near, far) {
    const e = this.elements;
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const fn = 1 / (far - near);

    e[0] = 2 * rl; e[4] = 0;      e[8] = 0;       e[12] = -(right + left) * rl;
    e[1] = 0;      e[5] = 2 * tb; e[9] = 0;       e[13] = -(top + bottom) * tb;
    e[2] = 0;      e[6] = 0;      e[10] = -2 * fn; e[14] = -(far + near) * fn;
    e[3] = 0;      e[7] = 0;      e[11] = 0;      e[15] = 1;

    return this;
  }

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

  translate(x, y, z) {
    const m = new Matrix4();
    const e = m.elements;
    e[12] = x;
    e[13] = y;
    e[14] = z;
    return this.multiply(m);
  }

  rotateX(rad) {
    const m = new Matrix4();
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const e = m.elements;
    e[5] = c;  e[9] = -s;
    e[6] = s;  e[10] = c;
    return this.multiply(m);
  }

  rotateY(rad) {
    const m = new Matrix4();
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const e = m.elements;
    e[0] = c;   e[8] = s;
    e[2] = -s;  e[10] = c;
    return this.multiply(m);
  }

  rotateZ(rad) {
    const m = new Matrix4();
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const e = m.elements;
    e[0] = c;  e[4] = -s;
    e[1] = s;  e[5] = c;
    return this.multiply(m);
  }

  scale(sx, sy, sz) {
    const m = new Matrix4();
    const e = m.elements;
    e[0] = sx;
    e[5] = sy;
    e[10] = sz;
    return this.multiply(m);
  }

  invert() {
    const m = this.elements;
    const inv = new Float32Array(16);

    inv[0] = m[5]  * m[10] * m[15] - 
             m[5]  * m[11] * m[14] - 
             m[9]  * m[6]  * m[15] + 
             m[9]  * m[7]  * m[14] +
             m[13] * m[6]  * m[11] - 
             m[13] * m[7]  * m[10];

    inv[4] = -m[4]  * m[10] * m[15] + 
              m[4]  * m[11] * m[14] + 
              m[8]  * m[6]  * m[15] - 
              m[8]  * m[7]  * m[14] - 
              m[12] * m[6]  * m[11] + 
              m[12] * m[7]  * m[10];

    inv[8] = m[4]  * m[9]  * m[15] - 
             m[4]  * m[11] * m[13] - 
             m[8]  * m[5]  * m[15] + 
             m[8]  * m[7]  * m[13] + 
             m[12] * m[5]  * m[11] - 
             m[12] * m[7]  * m[9];

    inv[12] = -m[4]  * m[9]  * m[14] + 
               m[4]  * m[10] * m[13] + 
               m[8]  * m[5]  * m[14] - 
               m[8]  * m[6]  * m[13] - 
               m[12] * m[5]  * m[10] + 
               m[12] * m[6]  * m[9];

    inv[1] = -m[1]  * m[10] * m[15] + 
              m[1]  * m[11] * m[14] + 
              m[9]  * m[2]  * m[15] - 
              m[9]  * m[3]  * m[14] - 
              m[13] * m[2]  * m[11] + 
              m[13] * m[3]  * m[10];

    inv[5] = m[0]  * m[10] * m[15] - 
             m[0]  * m[11] * m[14] - 
             m[8]  * m[2]  * m[15] + 
             m[8]  * m[3]  * m[14] + 
             m[12] * m[2]  * m[11] - 
             m[12] * m[3]  * m[10];

    inv[9] = -m[0]  * m[9]  * m[15] + 
              m[0]  * m[11] * m[13] + 
              m[8]  * m[1]  * m[15] - 
              m[8]  * m[3]  * m[13] - 
              m[12] * m[1]  * m[11] + 
              m[12] * m[3]  * m[9];

    inv[13] = m[0]  * m[9]  * m[14] - 
              m[0]  * m[10] * m[13] - 
              m[8]  * m[1]  * m[14] + 
              m[8]  * m[2]  * m[13] + 
              m[12] * m[1]  * m[10] - 
              m[12] * m[2]  * m[9];

    inv[2] = m[1]  * m[6]  * m[15] - 
             m[1]  * m[7]  * m[14] - 
             m[5]  * m[2]  * m[15] + 
             m[5]  * m[3]  * m[14] + 
             m[13] * m[2]  * m[7] - 
             m[13] * m[3]  * m[6];

    inv[6] = -m[0]  * m[6]  * m[15] + 
              m[0]  * m[7]  * m[14] + 
              m[4]  * m[2]  * m[15] - 
              m[4]  * m[3]  * m[14] - 
              m[12] * m[2]  * m[7] + 
              m[12] * m[3]  * m[6];

    inv[10] = m[0]  * m[5]  * m[15] - 
              m[0]  * m[7]  * m[13] - 
              m[4]  * m[1]  * m[15] + 
              m[4]  * m[3]  * m[13] + 
              m[12] * m[1]  * m[7] - 
              m[12] * m[3]  * m[5];

    inv[14] = -m[0]  * m[5]  * m[14] + 
               m[0]  * m[6]  * m[13] + 
               m[4]  * m[1]  * m[14] - 
               m[4]  * m[2]  * m[13] - 
               m[12] * m[1]  * m[6] + 
               m[12] * m[2]  * m[5];

    inv[3] = -m[1] * m[6] * m[11] + 
              m[1] * m[7] * m[10] + 
              m[5] * m[2] * m[11] - 
              m[5] * m[3] * m[10] - 
              m[9] * m[2] * m[7] + 
              m[9] * m[3] * m[6];

    inv[7] = m[0] * m[6] * m[11] - 
             m[0] * m[7] * m[10] - 
             m[4] * m[2] * m[11] + 
             m[4] * m[3] * m[10] + 
             m[8] * m[2] * m[7] - 
             m[8] * m[3] * m[6];

    inv[11] = -m[0] * m[5] * m[11] + 
               m[0] * m[7] * m[9] + 
               m[4] * m[1] * m[11] - 
               m[4] * m[3] * m[9] - 
               m[8] * m[1] * m[7] + 
               m[8] * m[3] * m[5];

    inv[15] = m[0] * m[5] * m[10] - 
              m[0] * m[6] * m[9] - 
              m[4] * m[1] * m[10] + 
              m[4] * m[2] * m[9] + 
              m[8] * m[1] * m[6] - 
              m[8] * m[2] * m[5];

    let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
    if (det === 0) return this;

    det = 1.0 / det;
    const res = new Matrix4();
    for (let i = 0; i < 16; i++) {
      res.elements[i] = inv[i] * det;
    }
    return res;
  }

  transformVector4(v) {
    const e = this.elements;
    const x = v[0], y = v[1], z = v[2], w = v[3];
    return [
      e[0] * x + e[4] * y + e[8]  * z + e[12] * w,
      e[1] * x + e[5] * y + e[9]  * z + e[13] * w,
      e[2] * x + e[6] * y + e[10] * z + e[14] * w,
      e[3] * x + e[7] * y + e[11] * z + e[15] * w
    ];
  }

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
