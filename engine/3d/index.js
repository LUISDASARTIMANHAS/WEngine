/**
 * Módulo Nativo 3D da WEngine.
 * Todos os componentes, sistemas, câmeras, utilitários e comportamentos 3D isolados e organizados.
 */

export { Transform3D } from "./components/Transform3D.js";
export { Mesh3D } from "./components/Mesh3D.js";
export { Light3D } from "./components/Light3D.js";
export { Collider3D } from "./components/Collider3D.js";
export { Material3D } from "./components/Material3D.js";
export { ParticleSystem3D } from "./components/ParticleSystem3D.js";
export { Skybox3D } from "./components/Skybox3D.js";

export { RenderSystem3D } from "./systems/RenderSystem3D.js";
export { CollisionSystem3D } from "./systems/CollisionSystem3D.js";

export { Camera3D } from "./core/Camera3D.js";
export { OrbitControls3D } from "./core/OrbitControls3D.js";
export { Raycaster3D } from "./core/Raycaster3D.js";

export { KeyboardMovement3D } from "./behaviours/KeyboardMovement3D.js";
export { Rotator3D, Floating3D } from "./behaviours/Rotator3D.js";

export { Vector3, Matrix4, Ray } from "./utils/Math3D.js";
export { OBJLoader3D } from "./utils/OBJLoader3D.js";
