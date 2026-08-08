import { Component } from "../../core/Component.js";
import { Vector3 } from "../utils/Math3D.js";

class Particle3D {
  constructor() {
    this.position = new Vector3();
    this.velocity = new Vector3();
    this.color = [1, 1, 1, 1];
    this.size = 0.2;
    this.life = 1.0;
    this.maxLife = 1.0;
    this.active = false;
  }
}

/**
 * Componente de Emissor de Partículas 3D para WebGL.
 */
export class ParticleSystem3D extends Component {
  /**
   * @param {object} options
   * @param {number} [options.maxParticles=100] Capacidade do emissor
   * @param {number[]} [options.startColor=[1.0, 0.8, 0.2, 1.0]] Cor inicial RGBA
   * @param {number[]} [options.endColor=[1.0, 0.1, 0.0, 0.0]] Cor final RGBA
   * @param {number} [options.particleSize=0.3] Tamanho das partículas
   * @param {number} [options.emissionRate=20] Partículas disparadas por segundo
   * @param {number} [options.speed=3.0] Velocidade média de projeção
   * @param {Vector3|number[]} [options.gravity=[0, -4.0, 0]] Vetor gravidade
   */
  constructor({
    maxParticles = 100,
    startColor = [1.0, 0.8, 0.2, 1.0],
    endColor = [1.0, 0.1, 0.0, 0.0],
    particleSize = 0.3,
    emissionRate = 30,
    speed = 3.0,
    gravity = [0, -4.0, 0],
  } = {}) {
    super();

    this.maxParticles = maxParticles;
    this.startColor = startColor;
    this.endColor = endColor;
    this.particleSize = particleSize;
    this.emissionRate = emissionRate;
    this.speed = speed;
    this.gravity = gravity instanceof Vector3 ? gravity : new Vector3(...gravity);

    /** @type {Particle3D[]} */
    this.particles = Array.from({ length: maxParticles }, () => new Particle3D());
    this.emitTimer = 0;
  }

  /**
   * Dispara uma explosão única de N partículas.
   * @param {Vector3} origin
   * @param {number} count
   */
  burst(origin, count = 20) {
    let emitted = 0;
    for (const p of this.particles) {
      if (!p.active) {
        p.active = true;
        p.position.copy(origin);

        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        const speed = this.speed * (0.5 + Math.random() * 0.8);

        p.velocity.set(
          Math.cos(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * speed,
          Math.cos(phi) * Math.sin(theta) * speed
        );

        p.size = this.particleSize * (0.8 + Math.random() * 0.4);
        p.maxLife = 0.5 + Math.random() * 0.8;
        p.life = p.maxLife;
        p.color = [...this.startColor];

        emitted++;
        if (emitted >= count) break;
      }
    }
  }

  update(deltaTime) {
    for (const p of this.particles) {
      if (!p.active) continue;

      p.life -= deltaTime;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }

      // Aplica gravidade
      p.velocity.x += this.gravity.x * deltaTime;
      p.velocity.y += this.gravity.y * deltaTime;
      p.velocity.z += this.gravity.z * deltaTime;

      p.position.x += p.velocity.x * deltaTime;
      p.position.y += p.velocity.y * deltaTime;
      p.position.z += p.velocity.z * deltaTime;

      // Interpolação de cor
      const t = 1 - p.life / p.maxLife;
      p.color[0] = this.startColor[0] + (this.endColor[0] - this.startColor[0]) * t;
      p.color[1] = this.startColor[1] + (this.endColor[1] - this.startColor[1]) * t;
      p.color[2] = this.startColor[2] + (this.endColor[2] - this.startColor[2]) * t;
      p.color[3] = this.startColor[3] + (this.endColor[3] - this.startColor[3]) * t;
    }
  }
}
