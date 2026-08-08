import { Component } from "../../core/Component.js";
import { Vector3 } from "../utils/Math3D.js";

/**
 * Componente de Velocidade 3D com Física Básica.
 * Gerencia velocidade, aceleração, drag e gravidade.
 */
export class Velocity3D extends Component {
  /**
   * @param {object} [options={}]
   * @param {number} [options.mass=1] Massa da entidade
   * @param {number} [options.drag=0.15] Resistência do ar (0-1)
   * @param {boolean} [options.useGravity=true] Usar gravidade
   * @param {number} [options.gravityScale=9.81] Escala de gravidade
   */
  constructor(options = {}) {
    super();

    const {
      mass = 1,
      drag = 0.15,
      useGravity = true,
      gravityScale = 9.81,
    } = options;

    /**
     * Velocidade atual.
     * @type {Vector3}
     */
    this.velocity = new Vector3(0, 0, 0);

    /**
     * Aceleração atual.
     * @type {Vector3}
     */
    this.acceleration = new Vector3(0, 0, 0);

    /**
     * Forças acumuladas.
     * @type {Vector3}
     */
    this.forces = new Vector3(0, 0, 0);

    /**
     * Massa da entidade.
     * @type {number}
     */
    this.mass = Math.max(mass, 0.01);

    /**
     * Drag (resistência do ar). 0 = sem resistência, 1 = máxima.
     * @type {number}
     */
    this.drag = Math.max(0, Math.min(drag, 0.99));

    /**
     * Usar gravidade.
     * @type {boolean}
     */
    this.useGravity = useGravity;

    /**
     * Escala de gravidade.
     * @type {number}
     */
    this.gravityScale = gravityScale;
  }

  /**
   * Adiciona uma força à entidade.
   * @param {Vector3} force
   * @returns {void}
   */
  addForce(force) {
    this.forces.x += force.x;
    this.forces.y += force.y;
    this.forces.z += force.z;
  }

  /**
   * Define a velocidade diretamente.
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {void}
   */
  setVelocity(x, y, z) {
    this.velocity.x = x;
    this.velocity.y = y;
    this.velocity.z = z;
  }

  /**
   * Aplica a física da velocidade.
   * Deve ser chamado a cada frame.
   * @param {number} deltaTime
   * @returns {void}
   */
  update(deltaTime) {
    // Aplicar gravidade
    if (this.useGravity) {
      this.forces.y -= this.mass * this.gravityScale;
    }

    // F = ma => a = F/m
    this.acceleration.x = this.forces.x / this.mass;
    this.acceleration.y = this.forces.y / this.mass;
    this.acceleration.z = this.forces.z / this.mass;

    // Aplicar aceleração à velocidade
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;
    this.velocity.z += this.acceleration.z * deltaTime;

    // Aplicar drag
    this.velocity.x *= (1 - this.drag);
    this.velocity.y *= (1 - this.drag);
    this.velocity.z *= (1 - this.drag);

    // Limpar forças acumuladas
    this.forces.x = 0;
    this.forces.y = 0;
    this.forces.z = 0;
  }

  /**
   * Reseta toda a velocidade e forças.
   * @returns {void}
   */
  reset() {
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.velocity.z = 0;

    this.acceleration.x = 0;
    this.acceleration.y = 0;
    this.acceleration.z = 0;

    this.forces.x = 0;
    this.forces.y = 0;
    this.forces.z = 0;
  }

  /**
   * Retorna a magnitude (módulo) da velocidade.
   * @returns {number}
   */
  getSpeed() {
    const vx = this.velocity.x;
    const vy = this.velocity.y;
    const vz = this.velocity.z;
    return Math.sqrt(vx * vx + vy * vy + vz * vz);
  }
}
