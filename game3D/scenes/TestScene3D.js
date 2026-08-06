import { Scene } from "../../engine/core/Scene.js";
import { Entity } from "../../engine/core/Entity.js";
import { Transform3D } from "../../engine/components/Transform3D.js";
import { Mesh3D } from "../../engine/components/Mesh3D.js";
import { Component } from "../../engine/core/Component.js";

/**
 * Componente customizado para rotacionar um objeto 3D continuamente.
 */
class Rotator3D extends Component {
  constructor(speedX = 0, speedY = 1, speedZ = 0) {
    super();
    this.speedX = speedX;
    this.speedY = speedY;
    this.speedZ = speedZ;
  }

  update(deltaTime) {
    const transform = this.entity.getComponent(Transform3D);
    if (transform) {
      transform.rotation.x += this.speedX * deltaTime;
      transform.rotation.y += this.speedY * deltaTime;
      transform.rotation.z += this.speedZ * deltaTime;
    }
  }
}

/**
 * Componente customizado para fazer flutuar um objeto 3D (efeito Seno no eixo Y).
 */
class Floating3D extends Component {
  constructor(amplitude = 0.5, speed = 2) {
    super();
    this.amplitude = amplitude;
    this.speed = speed;
    this.initialY = 0;
    this.elapsed = Math.random() * 10;
  }

  start() {
    const transform = this.entity.getComponent(Transform3D);
    if (transform) {
      this.initialY = transform.y;
    }
  }

  update(deltaTime) {
    this.elapsed += deltaTime * this.speed;
    const transform = this.entity.getComponent(Transform3D);
    if (transform) {
      transform.y = this.initialY + Math.sin(this.elapsed) * this.amplitude;
    }
  }
}

/**
 * Cena de teste 3D WebGL para a WEngine.
 */
export class TestScene3D extends Scene {
  constructor() {
    super("TestScene3D");
  }

  start() {
    const factory = this.engine.entityFactory;

    // 1. Luz Direcional
    const light = factory.create("light3d", {
      name: "SunLight",
      color: [1.0, 0.95, 0.85],
      intensity: 1.3,
    });
    this.addEntity(light);

    // 2. Chão 3D
    const ground = factory.create("ground3d", {
      width: 40,
      depth: 40,
      color: [0.18, 0.22, 0.3],
    });
    this.addEntity(ground);

    // 3. Player 3D
    const player = factory.create("player3d", {
      name: "Player3D",
      x: 0,
      y: 0.75,
      z: 5,
      color: [0.95, 0.25, 0.35, 1.0],
    });
    this.addEntity(player);

    // Conecta a câmera 3D ao jogador
    if (this.engine?.camera3D) {
      this.engine.camera3D.targetEntity = player;
    }

    // 4. Objetos e Obstáculos 3D com luz, rotação e flutuação
    const colors = [
      [0.2, 0.7, 1.0, 1.0], // Azul Ciano
      [1.0, 0.7, 0.2, 1.0], // Laranja
      [0.3, 0.9, 0.4, 1.0], // Verde Esmeralda
      [0.8, 0.3, 0.9, 1.0], // Púrpura
      [0.9, 0.8, 0.2, 1.0], // Amarelo Dourado
    ];

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 8 + (i % 3) * 3;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const size = 1.0 + (i % 3) * 0.4;
      const color = colors[i % colors.length];

      const cube = factory.create("cube3d", {
        name: `Cube_${i}`,
        x,
        y: size / 2,
        z,
        size,
        color,
        isStatic: true,
      });

      // Adiciona comportamentos visuais 3D aos cubos
      if (i % 2 === 0) {
        cube.add(new Rotator3D(0.5, 1.0, 0.2));
        cube.add(new Floating3D(0.4, 2.0));
      } else {
        cube.add(new Rotator3D(0, 0.8, 0));
      }

      this.addEntity(cube);
    }

    // 5. Adiciona Pirâmides 3D decorativas
    for (let i = 0; i < 4; i++) {
      const px = (i % 2 === 0 ? 1 : -1) * 12;
      const pz = (i < 2 ? 1 : -1) * 12;

      const pyramid = new Entity(`Pyramid_${i}`);
      pyramid.add(new Transform3D(px, 0, pz, 0, 0, 0, 1.5, 2.0, 1.5));
      pyramid.add(Mesh3D.createPyramid(1.5, 2.0, [0.95, 0.4, 0.1, 1.0]));
      pyramid.add(new Rotator3D(0, 1.5, 0));
      this.addEntity(pyramid);
    }
  }
}
