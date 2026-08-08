import { Vector3, Ray, Matrix4 } from "../utils/Math3D.js";
import { Collider3D } from "../components/Collider3D.js";
import { Transform3D } from "../components/Transform3D.js";

/**
 * Utilitário de Raycasting 3D para Seleção de Objetos via Mouse/Cursor.
 */
export class Raycaster3D {
  constructor() {
    this.ray = new Ray();
  }

  /**
   * Converte a posição do mouse (em pixels no canvas) em um Raio 3D no espaço do mundo.
   * @param {number} mouseX Posição X do mouse relativa ao canvas
   * @param {number} mouseY Posição Y do mouse relativa ao canvas
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   * @param {import("./Camera3D.js").Camera3D} camera3D
   * @returns {Ray}
   */
  setFromCamera(mouseX, mouseY, canvasWidth, canvasHeight, camera3D) {
    // 1. Normaliza para Normalized Device Coordinates (NDC) [-1, 1]
    const ndcX = (mouseX / canvasWidth) * 2 - 1;
    const ndcY = -(mouseY / canvasHeight) * 2 + 1;

    // 2. Cria vetor no Clip Space
    const viewMatrix = camera3D.getViewMatrix();
    const projMatrix = camera3D.getProjectionMatrix();

    const invProj = projMatrix.invert();
    const invView = viewMatrix.invert();

    // Ponto próximo e distante no espaço de câmera
    const nearVec = invProj.transformVector4([ndcX, ndcY, -1.0, 1.0]);
    const farVec = invProj.transformVector4([ndcX, ndcY, 1.0, 1.0]);

    if (nearVec[3] !== 0) {
      nearVec[0] /= nearVec[3];
      nearVec[1] /= nearVec[3];
      nearVec[2] /= nearVec[3];
    }
    if (farVec[3] !== 0) {
      farVec[0] /= farVec[3];
      farVec[1] /= farVec[3];
      farVec[2] /= farVec[3];
    }

    const worldNear = invView.transformVector4([nearVec[0], nearVec[1], nearVec[2], 1.0]);
    const worldFar = invView.transformVector4([farVec[0], farVec[1], farVec[2], 1.0]);

    const rayOrigin = new Vector3(worldNear[0], worldNear[1], worldNear[2]);
    const rayTarget = new Vector3(worldFar[0], worldFar[1], worldFar[2]);
    const rayDir = Vector3.sub(rayTarget, rayOrigin).normalize();

    this.ray = new Ray(rayOrigin, rayDir);
    return this.ray;
  }

  /**
   * Testa intersecção do raio com todas as entidades da cena que possuem Collider3D.
   * @param {import("../../../engine/core/Scene.js").Scene} scene
   * @returns {{ entity: import("../../../engine/core/Entity.js").Entity, distance: number, point: Vector3 }[]}
   */
  intersectScene(scene) {
    const hits = [];

    for (const entity of scene.entities) {
      if (!entity.active || entity.destroyed) continue;

      const transform = entity.getComponent(Transform3D);
      const collider = entity.getComponent(Collider3D);

      if (!transform || !collider) continue;

      const bounds = collider.getBounds(transform);
      const t = this.ray.intersectsAABB(bounds.min, bounds.max);

      if (t !== null) {
        hits.push({
          entity,
          distance: t,
          point: this.ray.at(t),
        });
      }
    }

    // Ordena hits por distância (mais próximo primeiro)
    hits.sort((a, b) => a.distance - b.distance);
    return hits;
  }
}
