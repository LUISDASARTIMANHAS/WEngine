/**
 * WEngine - Motor de Jogos 2D e 3D para Navegador.
 * Exportação Unificada com Separação Limpa de Namespaces 2D e 3D.
 */

// Núcleo ECS
export { Engine } from "./core/Engine.js";
export { Entity } from "./core/Entity.js";
export { Component } from "./core/Component.js";
export { Scene } from "./core/Scene.js";
export { Time } from "./utils/Time.js";
export { Logger } from "./utils/Logger.js";
export { InputSystem } from "./systems/InputSystem.js";
export { EntityFactory } from "./factories/EntityFactory.js";

// Módulos Especializados 2D e 3D
import * as Engine2D from "./2d/index.js";
import * as Engine3D from "./3d/index.js";

export { Engine2D, Engine3D };
