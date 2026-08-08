/**
 * Módulo Nativo 2D da WEngine.
 * Componentes, sistemas e comportamentos 2D isolados e organizados.
 */

export { Transform2D, Transform } from "./components/Transform2D.js";
export { Sprite } from "./components/Sprite.js";
export { Collider2D, Collider } from "./components/Collider2D.js";

export { RenderSystem2D, RenderSystem } from "./systems/RenderSystem2D.js";
export { CollisionSystem2D, CollisionSystem } from "./systems/CollisionSystem2D.js";

export { Camera2D, Camera } from "./core/Camera2D.js";
export { KeyboardMovement2D, KeyboardMovement } from "./behaviours/KeyboardMovement2D.js";
