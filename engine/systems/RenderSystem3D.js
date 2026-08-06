import { Transform3D } from "../components/Transform3D.js";
import { Mesh3D } from "../components/Mesh3D.js";
import { Light3D } from "../components/Light3D.js";
import { Matrix4, Vector3 } from "../utils/Math3D.js";

/**
 * Shader de Vértices Padrão para WebGL.
 */
const VERTEX_SHADER_SOURCE = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;

  uniform mat4 uModelMatrix;
  uniform mat4 uViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat3 uNormalMatrix;

  varying vec3 vNormal;
  varying vec3 vFragPos;

  void main() {
    vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
    vFragPos = worldPos.xyz;
    vNormal = uNormalMatrix * aNormal;
    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
  }
`;

/**
 * Shader de Fragmentos Padrão com iluminação Phong/Directional.
 */
const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  varying vec3 vNormal;
  varying vec3 vFragPos;

  uniform vec4 uColor;
  uniform vec3 uLightDirection;
  uniform vec3 uLightColor;
  uniform vec3 uAmbientColor;

  void main() {
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(-uLightDirection);

    // Difusa
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor;

    // Resultado final com iluminação ambiente e difusa
    vec3 finalColor = (uAmbientColor + diffuse) * uColor.rgb;
    gl_FragColor = vec4(finalColor, uColor.a);
  }
`;

/**
 * Sistema de renderização 3D baseado em WebGL Nativo.
 */
export class RenderSystem3D {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {import("../core/Camera3D.js").Camera3D} camera3D
   */
  constructor(gl, camera3D) {
    /**
     * Contexto WebGL.
     * @type {WebGLRenderingContext}
     */
    this.gl = gl;

    /**
     * Câmera 3D.
     * @type {import("../core/Camera3D.js").Camera3D}
     */
    this.camera = camera3D;

    /**
     * Programa WebGL compilado.
     * @type {WebGLProgram|null}
     */
    this.program = null;

    /**
     * Localização de Atributos e Uniforms.
     * @type {Object}
     */
    this.locations = {};

    /**
     * Cache de Buffers WebGL por malha.
     * @type {Map<Mesh3D, { vbo: WebGLBuffer, nbo: WebGLBuffer, ibo: WebGLBuffer, indexCount: number, vertexCount: number }>}
     */
    this.meshBufferCache = new Map();

    this.initShaders();
    this.initGL();
  }

  /**
   * Inicializa estados globais do WebGL (Depth Test, Cull Face, Viewport).
   */
  initGL() {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.08, 0.09, 0.12, 1.0);
  }

  /**
   * Compila shaders e cria o programa WebGL.
   */
  initShaders() {
    const gl = this.gl;

    const vertShader = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Erro ao linkar programa WebGL: " + gl.getProgramInfoLog(program));
    }

    this.program = program;

    // Cache de locations
    this.locations = {
      aPosition: gl.getAttribLocation(program, "aPosition"),
      aNormal: gl.getAttribLocation(program, "aNormal"),
      uModelMatrix: gl.getUniformLocation(program, "uModelMatrix"),
      uViewMatrix: gl.getUniformLocation(program, "uViewMatrix"),
      uProjectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
      uNormalMatrix: gl.getUniformLocation(program, "uNormalMatrix"),
      uColor: gl.getUniformLocation(program, "uColor"),
      uLightDirection: gl.getUniformLocation(program, "uLightDirection"),
      uLightColor: gl.getUniformLocation(program, "uLightColor"),
      uAmbientColor: gl.getUniformLocation(program, "uAmbientColor"),
    };
  }

  /**
   * Compila um shader individual.
   * @param {number} type
   * @param {string} source
   * @returns {WebGLShader}
   */
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

  /**
   * Cria ou obtém buffers WebGL para a malha fornecida.
   * @param {Mesh3D} mesh
   * @returns {object}
   */
  getOrCreateBuffers(mesh) {
    if (this.meshBufferCache.has(mesh)) {
      return this.meshBufferCache.get(mesh);
    }

    const gl = this.gl;

    // VBO (Vertices)
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);

    // NBO (Normals)
    let nbo = null;
    if (mesh.normals) {
      nbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
    }

    // IBO (Indices)
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
      ibo,
      indexCount,
      vertexCount: mesh.vertices.length / 3,
    };

    this.meshBufferCache.set(mesh, cacheEntry);
    return cacheEntry;
  }

  /**
   * Renderiza a cena 3D.
   * @param {import("../core/Scene.js").Scene} scene
   * @return {void}
   */
  render(scene) {
    const gl = this.gl;

    // Ajusta viewport para tamanho real do canvas
    if (gl.canvas.width !== gl.canvas.clientWidth || gl.canvas.height !== gl.canvas.clientHeight) {
      gl.canvas.width = gl.canvas.clientWidth || 800;
      gl.canvas.height = gl.canvas.clientHeight || 600;
      this.camera.aspect = gl.canvas.width / gl.canvas.height;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Limpa buffers de cor e profundidade
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.program);

    // Configuração de Luzes
    let lightDir = new Vector3(-0.5, -1.0, -0.5);
    let lightColor = [0.9, 0.9, 0.85];
    let ambientColor = [0.35, 0.35, 0.4];

    for (const entity of scene.entities) {
      if (!entity.active || entity.destroyed) continue;
      const light = entity.getComponent(Light3D);
      if (light) {
        if (light.type === 'directional') {
          lightDir = light.direction;
          lightColor = light.color.map(c => c * light.intensity);
        } else if (light.type === 'ambient') {
          ambientColor = light.color.map(c => c * light.intensity);
        }
      }
    }

    gl.uniform3fv(this.locations.uLightDirection, [lightDir.x, lightDir.y, lightDir.z]);
    gl.uniform3fv(this.locations.uLightColor, lightColor);
    gl.uniform3fv(this.locations.uAmbientColor, ambientColor);

    // Matrizes de Câmera (View & Projection)
    const viewMatrix = this.camera.getViewMatrix();
    const projMatrix = this.camera.getProjectionMatrix();

    gl.uniformMatrix4fv(this.locations.uViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(this.locations.uProjectionMatrix, false, projMatrix.elements);

    // Renderiza Entidades 3D
    for (const entity of scene.entities) {
      if (!entity.active || entity.destroyed) continue;

      const transform = entity.getComponent(Transform3D);
      const mesh = entity.getComponent(Mesh3D);

      if (!transform || !mesh) continue;

      const modelMatrix = transform.getModelMatrix();
      gl.uniformMatrix4fv(this.locations.uModelMatrix, false, modelMatrix.elements);

      // Calcula Normal Matrix (3x3 extraído do Model Matrix)
      const e = modelMatrix.elements;
      const normalMat = new Float32Array([
        e[0], e[1], e[2],
        e[4], e[5], e[6],
        e[8], e[9], e[10]
      ]);
      gl.uniformMatrix3fv(this.locations.uNormalMatrix, false, normalMat);

      // Define Cor da Malha
      gl.uniform4fv(this.locations.uColor, mesh.color);

      // Obtém Buffers da Malha
      const buffers = this.getOrCreateBuffers(mesh);

      // Bind VBO
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vbo);
      gl.enableVertexAttribArray(this.locations.aPosition);
      gl.vertexAttribPointer(this.locations.aPosition, 3, gl.FLOAT, false, 0, 0);

      // Bind Normais
      if (buffers.nbo && this.locations.aNormal !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.nbo);
        gl.enableVertexAttribArray(this.locations.aNormal);
        gl.vertexAttribPointer(this.locations.aNormal, 3, gl.FLOAT, false, 0, 0);
      }

      // Desenha Geometria
      if (buffers.ibo) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.ibo);
        gl.drawElements(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawArrays(gl.TRIANGLES, 0, buffers.vertexCount);
      }
    }
  }
}
