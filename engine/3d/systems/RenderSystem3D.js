import { Transform3D } from "../components/Transform3D.js";
import { Mesh3D } from "../components/Mesh3D.js";
import { Light3D } from "../components/Light3D.js";
import { Material3D } from "../components/Material3D.js";
import { ParticleSystem3D } from "../components/ParticleSystem3D.js";
import { Skybox3D } from "../components/Skybox3D.js";
import { Vector3 } from "../utils/Math3D.js";

/**
 * Shader de Vértices WebGL Avançado (Posição, Normal, UV).
 */
const VERTEX_SHADER_SOURCE = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec2 aTexCoord;

  uniform mat4 uModelMatrix;
  uniform mat4 uViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat3 uNormalMatrix;

  varying vec3 vNormal;
  varying vec3 vFragPos;
  varying vec2 vTexCoord;

  void main() {
    vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
    vFragPos = worldPos.xyz;
    vNormal = uNormalMatrix * aNormal;
    vTexCoord = aTexCoord;
    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
  }
`;

/**
 * Shader de Fragmentos WebGL Avançado (Iluminação Blinn-Phong + Especular + Luzes Pontuais + Textura).
 */
const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  varying vec3 vNormal;
  varying vec3 vFragPos;
  varying vec2 vTexCoord;

  uniform vec4 uColor;
  uniform vec3 uSpecularColor;
  uniform float uShininess;

  uniform vec3 uViewPos;
  uniform vec3 uLightDirection;
  uniform vec3 uLightColor;
  uniform vec3 uAmbientColor;

  // Luzes Pontuais
  uniform vec3 uPointLightPos;
  uniform vec3 uPointLightColor;
  uniform float uPointLightRange;

  uniform sampler2D uSampler;
  uniform bool uUseTexture;

  void main() {
    vec3 norm = normalize(vNormal);
    vec3 viewDir = normalize(uViewPos - vFragPos);

    // 1. Cor Base / Textura
    vec4 baseColor = uColor;
    if (uUseTexture) {
      baseColor *= texture2D(uSampler, vTexCoord);
    }

    // 2. Luz Direcional
    vec3 lightDir = normalize(-uLightDirection);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor;

    // Especular Direcional
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(norm, halfDir), 0.0), uShininess);
    vec3 specular = spec * uSpecularColor * uLightColor;

    // 3. Luz Pontual com Atenuação
    vec3 pointLightDir = uPointLightPos - vFragPos;
    float dist = length(pointLightDir);
    pointLightDir = normalize(pointLightDir);

    float atten = max(0.0, 1.0 - (dist / max(uPointLightRange, 0.001)));
    atten *= atten; // Atenuação quadrática suave

    float pointDiff = max(dot(norm, pointLightDir), 0.0);
    vec3 pointDiffuse = pointDiff * uPointLightColor * atten;

    // Resultado final de iluminação
    vec3 totalLight = uAmbientColor + diffuse + pointDiffuse;
    vec3 finalColor = (baseColor.rgb * totalLight) + (specular * (diff > 0.0 ? 1.0 : 0.0));

    gl_FragColor = vec4(finalColor, baseColor.a);
  }
`;

/**
 * Shader Simples para Partículas (Pontos / Billboard em WebGL).
 */
const PARTICLE_VERT_SHADER = `
  attribute vec3 aPosition;
  attribute vec4 aColor;
  attribute float aSize;

  uniform mat4 uViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying vec4 vColor;

  void main() {
    vColor = aColor;
    vec4 eyePos = uViewMatrix * vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * eyePos;
    gl_PointSize = aSize * (300.0 / -eyePos.z);
  }
`;

const PARTICLE_FRAG_SHADER = `
  precision mediump float;
  varying vec4 vColor;

  void main() {
    // Desenha partículas como círculos suaves
    vec2 coord = gl_PointCoord - vec2(0.5);
    if (length(coord) > 0.5) discard;
    gl_FragColor = vColor;
  }
`;

/**
 * Sistema de Renderização 3D Nativo via WebGL.
 */
export class RenderSystem3D {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {import("../core/Camera3D.js").Camera3D} camera3D
   */
  constructor(gl, camera3D) {
    this.gl = gl;
    this.camera = camera3D;

    this.program = null;
    this.locations = {};

    this.particleProgram = null;
    this.particleLocations = {};

    this.meshBufferCache = new Map();
    this.textureCache = new Map();

    this.initShaders();
    this.initGL();
  }

  initGL() {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0.08, 0.09, 0.12, 1.0);
  }

  initShaders() {
    const gl = this.gl;

    // Program Principal 3D
    const vertShader = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Erro ao linkar Shader 3D: " + gl.getProgramInfoLog(program));
    }
    this.program = program;

    this.locations = {
      aPosition: gl.getAttribLocation(program, "aPosition"),
      aNormal: gl.getAttribLocation(program, "aNormal"),
      aTexCoord: gl.getAttribLocation(program, "aTexCoord"),

      uModelMatrix: gl.getUniformLocation(program, "uModelMatrix"),
      uViewMatrix: gl.getUniformLocation(program, "uViewMatrix"),
      uProjectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
      uNormalMatrix: gl.getUniformLocation(program, "uNormalMatrix"),

      uColor: gl.getUniformLocation(program, "uColor"),
      uSpecularColor: gl.getUniformLocation(program, "uSpecularColor"),
      uShininess: gl.getUniformLocation(program, "uShininess"),

      uViewPos: gl.getUniformLocation(program, "uViewPos"),
      uLightDirection: gl.getUniformLocation(program, "uLightDirection"),
      uLightColor: gl.getUniformLocation(program, "uLightColor"),
      uAmbientColor: gl.getUniformLocation(program, "uAmbientColor"),

      uPointLightPos: gl.getUniformLocation(program, "uPointLightPos"),
      uPointLightColor: gl.getUniformLocation(program, "uPointLightColor"),
      uPointLightRange: gl.getUniformLocation(program, "uPointLightRange"),

      uSampler: gl.getUniformLocation(program, "uSampler"),
      uUseTexture: gl.getUniformLocation(program, "uUseTexture"),
    };

    // Program de Partículas 3D
    const pVert = this.compileShader(gl.VERTEX_SHADER, PARTICLE_VERT_SHADER);
    const pFrag = this.compileShader(gl.FRAGMENT_SHADER, PARTICLE_FRAG_SHADER);

    const pProgram = gl.createProgram();
    gl.attachShader(pProgram, pVert);
    gl.attachShader(pProgram, pFrag);
    gl.linkProgram(pProgram);

    this.particleProgram = pProgram;
    this.particleLocations = {
      aPosition: gl.getAttribLocation(pProgram, "aPosition"),
      aColor: gl.getAttribLocation(pProgram, "aColor"),
      aSize: gl.getAttribLocation(pProgram, "aSize"),
      uViewMatrix: gl.getUniformLocation(pProgram, "uViewMatrix"),
      uProjectionMatrix: gl.getUniformLocation(pProgram, "uProjectionMatrix"),
    };
  }

  compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error("Erro ao compilar Shader: " + info);
    }
    return shader;
  }

  getOrCreateBuffers(mesh) {
    if (this.meshBufferCache.has(mesh)) {
      return this.meshBufferCache.get(mesh);
    }

    const gl = this.gl;

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);

    let nbo = null;
    if (mesh.normals) {
      nbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
    }

    let uvbo = null;
    if (mesh.uvs) {
      uvbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvbo);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.uvs, gl.STATIC_DRAW);
    }

    let ibo = null;
    let indexCount = 0;
    if (mesh.indices) {
      ibo = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
      indexCount = mesh.indices.length;
    }

    const cacheEntry = {
      vbo,
      nbo,
      uvbo,
      ibo,
      indexCount,
      vertexCount: mesh.vertices.length / 3,
    };

    this.meshBufferCache.set(mesh, cacheEntry);
    return cacheEntry;
  }

  getOrCreateTexture(source) {
    if (!source) return null;
    if (this.textureCache.has(source)) return this.textureCache.get(source);

    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.generateMipmap(gl.TEXTURE_2D);

    this.textureCache.set(source, tex);
    return tex;
  }

  render(scene) {
    const gl = this.gl;

    if (gl.canvas.width !== gl.canvas.clientWidth || gl.canvas.height !== gl.canvas.clientHeight) {
      gl.canvas.width = gl.canvas.clientWidth || 800;
      gl.canvas.height = gl.canvas.clientHeight || 600;
      this.camera.aspect = gl.canvas.width / gl.canvas.height;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.program);

    // Câmera & Viewport
    const viewMatrix = this.camera.getViewMatrix();
    const projMatrix = this.camera.getProjectionMatrix();

    gl.uniformMatrix4fv(this.locations.uViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(this.locations.uProjectionMatrix, false, projMatrix.elements);
    gl.uniform3fv(this.locations.uViewPos, [this.camera.position.x, this.camera.position.y, this.camera.position.z]);

    // Iluminação
    let lightDir = new Vector3(-0.5, -1.0, -0.5);
    let lightColor = [0.95, 0.95, 0.9];
    let ambientColor = [0.3, 0.3, 0.35];

    let pointLightPos = [0, 0, 0];
    let pointLightColor = [0, 0, 0];
    let pointLightRange = 0;

    for (const entity of scene.entities) {
      if (!entity.active || entity.destroyed) continue;
      const light = entity.getComponent(Light3D);
      const transform = entity.getComponent(Transform3D);

      if (light) {
        if (light.type === "directional") {
          lightDir = light.direction;
          lightColor = light.color.map((c) => c * light.intensity);
        } else if (light.type === "ambient") {
          ambientColor = light.color.map((c) => c * light.intensity);
        } else if (light.type === "point") {
          const pos = transform ? transform.position : new Vector3();
          pointLightPos = [pos.x, pos.y, pos.z];
          pointLightColor = light.color.map((c) => c * light.intensity);
          pointLightRange = light.range;
        }
      }
    }

    gl.uniform3fv(this.locations.uLightDirection, [lightDir.x, lightDir.y, lightDir.z]);
    gl.uniform3fv(this.locations.uLightColor, lightColor);
    gl.uniform3fv(this.locations.uAmbientColor, ambientColor);

    gl.uniform3fv(this.locations.uPointLightPos, pointLightPos);
    gl.uniform3fv(this.locations.uPointLightColor, pointLightColor);
    gl.uniform1f(this.locations.uPointLightRange, pointLightRange);

    // 1. Renderiza Skybox se houver
    for (const entity of scene.entities) {
      if (!entity.active || entity.destroyed) continue;
      const skybox = entity.getComponent(Skybox3D);
      if (skybox) {
        gl.disable(gl.CULL_FACE);
        gl.depthMask(false);

        const skyTransform = new Transform3D(
          this.camera.position.x,
          this.camera.position.y,
          this.camera.position.z,
          0, 0, 0,
          skybox.size, skybox.size, skybox.size
        );

        const modelMatrix = skyTransform.getModelMatrix();
        gl.uniformMatrix4fv(this.locations.uModelMatrix, false, modelMatrix.elements);
        gl.uniform4fv(this.locations.uColor, skybox.topColor);
        gl.uniform1i(this.locations.uUseTexture, 0);

        const buffers = this.getOrCreateBuffers(skybox.mesh);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vbo);
        gl.enableVertexAttribArray(this.locations.aPosition);
        gl.vertexAttribPointer(this.locations.aPosition, 3, gl.FLOAT, false, 0, 0);

        if (buffers.ibo) {
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo);
          gl.drawElements(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0);
        }

        gl.depthMask(true);
        gl.enable(gl.CULL_FACE);
      }
    }

    // 2. Renderiza Malhas 3D
    for (const entity of scene.entities) {
      if (!entity.active || entity.destroyed) continue;

      const transform = entity.getComponent(Transform3D);
      const mesh = entity.getComponent(Mesh3D);
      const material = entity.getComponent(Material3D);

      if (!transform || !mesh) continue;

      const modelMatrix = transform.getModelMatrix();
      gl.uniformMatrix4fv(this.locations.uModelMatrix, false, modelMatrix.elements);

      const e = modelMatrix.elements;
      const normalMat = new Float32Array([
        e[0], e[1], e[2],
        e[4], e[5], e[6],
        e[8], e[9], e[10],
      ]);
      gl.uniformMatrix3fv(this.locations.uNormalMatrix, false, normalMat);

      // Material
      const color = material ? material.color : mesh.color;
      const specular = material ? material.specular : [0.5, 0.5, 0.5];
      const shininess = material ? material.shininess : 32.0;

      gl.uniform4fv(this.locations.uColor, color);
      gl.uniform3fv(this.locations.uSpecularColor, specular);
      gl.uniform1f(this.locations.uShininess, shininess);

      // Textura
      let useTex = false;
      if (material && material.useTexture && material.texture) {
        const tex = this.getOrCreateTexture(material.texture);
        if (tex) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.uniform1i(this.locations.uSampler, 0);
          useTex = true;
        }
      }
      gl.uniform1i(this.locations.uUseTexture, useTex ? 1 : 0);

      const shouldDisableCull = material && material.doubleSided;
      const wasCullEnabled = gl.isEnabled(gl.CULL_FACE);
      if (shouldDisableCull) {
        gl.disable(gl.CULL_FACE);
      }

      const buffers = this.getOrCreateBuffers(mesh);

      // VBO
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vbo);
      gl.enableVertexAttribArray(this.locations.aPosition);
      gl.vertexAttribPointer(this.locations.aPosition, 3, gl.FLOAT, false, 0, 0);

      // Normais
      if (buffers.nbo && this.locations.aNormal !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nbo);
        gl.enableVertexAttribArray(this.locations.aNormal);
        gl.vertexAttribPointer(this.locations.aNormal, 3, gl.FLOAT, false, 0, 0);
      }

      // UVs
      if (buffers.uvbo && this.locations.aTexCoord !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uvbo);
        gl.enableVertexAttribArray(this.locations.aTexCoord);
        gl.vertexAttribPointer(this.locations.aTexCoord, 2, gl.FLOAT, false, 0, 0);
      }

      // Desenha
      if (buffers.ibo) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo);
        gl.drawElements(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawArrays(gl.TRIANGLES, 0, buffers.vertexCount);
      }

      if (shouldDisableCull && wasCullEnabled) {
        gl.enable(gl.CULL_FACE);
      }
    }

    // 3. Renderiza Sistemas de Partículas 3D
    gl.useProgram(this.particleProgram);
    gl.uniformMatrix4fv(this.particleLocations.uViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(this.particleLocations.uProjectionMatrix, false, projMatrix.elements);

    for (const entity of scene.entities) {
      if (!entity.active || entity.destroyed) continue;
      const ps = entity.getComponent(ParticleSystem3D);
      if (!ps) continue;

      const pPositions = [];
      const pColors = [];
      const pSizes = [];

      for (const p of ps.particles) {
        if (!p.active) continue;
        pPositions.push(p.position.x, p.position.y, p.position.z);
        pColors.push(...p.color);
        pSizes.push(p.size);
      }

      if (pPositions.length === 0) continue;

      const pCount = pPositions.length / 3;

      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pPositions), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(this.particleLocations.aPosition);
      gl.vertexAttribPointer(this.particleLocations.aPosition, 3, gl.FLOAT, false, 0, 0);

      const colBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pColors), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(this.particleLocations.aColor);
      gl.vertexAttribPointer(this.particleLocations.aColor, 4, gl.FLOAT, false, 0, 0);

      const sizeBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pSizes), gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(this.particleLocations.aSize);
      gl.vertexAttribPointer(this.particleLocations.aSize, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, pCount);
    }
  }
}
