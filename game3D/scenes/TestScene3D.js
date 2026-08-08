import { Scene, Entity } from "../../engine/index.js";
import {
  Transform3D,
  Mesh3D,
  Light3D,
  Material3D,
  Skybox3D,
  ParticleSystem3D,
  Rotator3D,
  Floating3D,
  Collider3D,
} from "../../engine/3d/index.js";

/**
 * Cena de Teste 3D WebGL para a WEngine demonstrando o novo ecossistema 3D.
 */
export class TestScene3D extends Scene {
  constructor() {
    super("TestScene3D");
  }

  start() {
    const factory = this.engine.entityFactory;

    // 1. Skybox 3D
    const skyboxEntity = new Entity("Skybox");
    skyboxEntity.add(new Skybox3D({
      topColor: [0.12, 0.18, 0.35, 1.0],
      bottomColor: [0.05, 0.05, 0.1, 1.0],
      size: 300,
    }));
    this.addEntity(skyboxEntity);

    // 2. Luz Direcional do Sol + Luz Pontual Dinâmica
    const light = factory.create("light3d", {
      name: "SunLight",
      direction: [-0.6, -1.0, -0.4],
      color: [1.0, 0.95, 0.85],
      intensity: 1.2,
    });
    this.addEntity(light);

    // Luz Pontual brilhante no centro
    const pointLight = new Entity("PointLightCenter");
    pointLight.add(new Transform3D(0, 3, 0));
    pointLight.add(new Light3D({
      type: "point",
      color: [0.2, 0.8, 1.0],
      intensity: 2.0,
      range: 25,
    }));
    this.addEntity(pointLight);

    // 3. Chão 3D com Textura Xadrez Procedural
    const ground = new Entity("TexturedGround");
    ground.add(new Transform3D(0, 0, 0));
    ground.add(Mesh3D.createPlane(50, 50, [0.3, 0.35, 0.4, 1.0]));
    ground.add(new Material3D({
      texture: Material3D.createCheckerboardTexture(256, "#1e293b", "#334155"),
      useTexture: true,
      shininess: 16,
    }));
    ground.add(new Collider3D({ width: 50, height: 0.1, depth: 50, isStatic: true }));
    this.addEntity(ground);

    // 4. Jogador 3D
    const player = factory.create("player3d", {
      name: "Player3D",
      x: 0,
      y: 0.75,
      z: 6,
      color: [0.95, 0.25, 0.35, 1.0],
    });
    this.addEntity(player);

    if (this.engine?.camera3D) {
      this.engine.camera3D.targetEntity = player;
    }

    // 5. Novas Primitivas 3D: Esferas, Cilindros, Torus e Cubos
    const shapes = [
      () => Mesh3D.createSphere(1.0, 20, 20, [0.2, 0.8, 0.4, 1.0]),
      () => Mesh3D.createCylinder(0.8, 2.0, 20, [0.9, 0.3, 0.3, 1.0]),
      () => Mesh3D.createTorus(1.0, 0.35, 16, 24, [0.9, 0.8, 0.1, 1.0]),
      () => Mesh3D.createCube(1.5, [0.3, 0.6, 0.95, 1.0]),
    ];

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 9 + (i % 3) * 3;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const obj = new Entity(`Shape_${i}`);
      obj.add(new Transform3D(x, 1.2, z));
      obj.add(shapes[i % shapes.length]());
      obj.add(new Collider3D({ width: 1.5, height: 1.5, depth: 1.5, isStatic: true }));

      obj.add(new Material3D({
        specular: [0.9, 0.9, 0.9],
        shininess: 64,
      }));

      if (i % 2 === 0) {
        obj.add(new Rotator3D(0.4, 1.2, 0.3));
        obj.add(new Floating3D(0.5, 2.0));
      } else {
        obj.add(new Rotator3D(0, 0.9, 0));
      }

      this.addEntity(obj);
    }

    // 6. Emissor de Partículas 3D (Efeito de Brilho / Partículas)
    const particleEntity = new Entity("ParticleFX");
    const ps = new ParticleSystem3D({
      maxParticles: 150,
      startColor: [0.2, 0.9, 1.0, 1.0],
      endColor: [0.8, 0.2, 1.0, 0.0],
      particleSize: 0.35,
      speed: 4.0,
    });
    particleEntity.add(ps);
    this.addEntity(particleEntity);
  }
}
