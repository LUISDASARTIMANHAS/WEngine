# WEngine AI Agent Instructions

## Project overview

- WEngine is a small browser-based 2D and 3D WebGL game engine written in plain JavaScript using ES modules without external dependencies.
- The repo contains the engine core under `engine/`, a 2D playable demo under `gameDemo/`, and a 3D WebGL playable demo under `game3D/`.
- There is no Node.js build system or package scripts present in the repo.

## Key entry points

- 2D Demo launcher: `gameDemo/index.html`
- 3D Demo launcher: `game3D/index.html`
- 3D Demo runtime: `game3D/main.js`
- Engine core: `engine/core/Engine.js`
- 3D Camera: `engine/core/Camera3D.js`
- 3D Render System: `engine/systems/RenderSystem3D.js`
- 3D Math: `engine/utils/Math3D.js`
- Entity factory and builders: `engine/factories/EntityFactory.js` and `engine/factories/builders/`

## Architecture and conventions

- Code is designed around an entity-component-system pattern (ECS).
- `Entity` instances hold components and call component `update(deltaTime)`.
- `Scene` subclasses implement `start()` and use `this.addEntity(...)` to populate the world.
- Systems such as `RenderSystem`, `RenderSystem3D`, `CollisionSystem`, `CollisionSystem3D`, `DamageSystem`, and `CleanupSystem` operate over the current scene.
- 3D components include `Transform3D`, `Mesh3D`, `Light3D`, `Collider3D`, and `KeyboardMovement3D`.
- `EntityFactory` registers entity builder functions by string key (2D and 3D builders).
- `InputSystem` is a static global keyboard helper; call `InputSystem.init()` once and use `InputSystem.isKeyDown(key)`.

## Development guidance for AI agents

- Prefer clean, modular changes that preserve the engine's readable design.
- Avoid introducing heavy build tooling or bundlers; this repo is built for direct browser ES module consumption.
- Use JSDoc conventions already present in the code when adding new classes or methods.
- When extending gameplay or 3D features, add components under `engine/components/` and builder functions under `engine/factories/builders/`.
- Keep runtime behavior isolated in the engine systems and scene logic in `gameDemo/scenes/` (2D) or `game3D/scenes/` (3D).

## Running the demos

- Open `gameDemo/index.html` for 2D or `game3D/index.html` for 3D WebGL in a browser.
- If browser module loading issues occur, serve the folder with a simple local web server (e.g. `npx serve` or `python -m http.server`).

## Documentation

- For project intent and structure, refer to `README.md` and `engine/README.md`.

> Note: This file is intended to give AI agents quick, high-level context for working in this repo.
