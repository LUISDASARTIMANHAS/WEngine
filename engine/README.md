# WEngine - Engine 2D & 3D WebGL

Este documento descreve a arquitetura interna da WEngine, suas funcionalidades 2D e 3D e como usar o motor para criar cenas, entidades, componentes e comportamentos tridimensionais ou bidimensionais.

## Objetivo

A WEngine é um motor de jogo para navegador projetado para ser simples, modular, sem dependências externas pesadas e fácil de estender. Ela oferece:

- arquitetura orientada a entidades e componentes (ECS)
- **Modo 3D Nativo via WebGL** (`mode: '3d'`) com iluminação, câmera perspectiva e malhas 3D
- Modo 2D Canvas (`mode: '2d'`) original
- matemática 3D própria (`Vector3`, `Matrix4`)
- sistemas independentes para renderização 2D/3D, colisão 2D/3D, dano, limpeza e minimapa
- fábrica de entidades para registrar builders reutilizáveis em 2D e 3D

## Estrutura principal

- `engine/core/Engine.js` - núcleo da engine e loop principal (2D/3D)
- `engine/core/Camera3D.js` - câmera 3D perspectiva com target tracking
- `engine/utils/Math3D.js` - operações de vetores 3D e matrizes 4x4
- `engine/components/Transform3D.js` - posição, rotação e escala 3D
- `engine/components/Mesh3D.js` - dados de geometria WebGL (Cubo, Plano, Pirâmide)
- `engine/components/Light3D.js` - luzes 3D (Direcional, Ambiente, Pontual)
- `engine/components/Collider3D.js` - caixa delimitadora 3D (AABB)
- `engine/behaviours/KeyboardMovement3D.js` - movimentação 3D por teclado
- `engine/systems/RenderSystem3D.js` - renderizador 3D WebGL com shaders e iluminação
- `engine/systems/CollisionSystem3D.js` - sistema de detecção e resolução de colisão AABB 3D
- `game3D/` - demo jogável WebGL 3D

## Uso do Modo 3D

```js
import { Engine } from "./engine/core/Engine.js";
import { InputSystem } from "./engine/systems/InputSystem.js";
import { TestScene3D } from "./game3D/scenes/TestScene3D.js";
import { register3DBuilders } from "./game3D/register3DBuilders.js";

const canvas = document.getElementById("gameCanvas3D");
InputSystem.init();

// Inicialização da WEngine em modo 3D WebGL
const engine = new Engine(canvas, {
  mode: "3d",
  fov: 60
});

register3DBuilders(engine);

const scene = new TestScene3D();
engine.setScene(scene);
engine.start();
```

## Componentes 3D Principais

### `Transform3D`
Manipula posição `(x, y, z)`, rotação `(rx, ry, rz)` em radianos e escala `(sx, sy, sz)`. Gera matriz de modelo (Model Matrix).

### `Mesh3D`
Armazena vértices, normais, índices e cor RGBA. Oferece geradores de primitivas estáticos:
- `Mesh3D.createCube(size, color)`
- `Mesh3D.createPlane(width, depth, color)`
- `Mesh3D.createPyramid(baseSize, height, color)`

### `Light3D`
Define parâmetros de iluminação para a cena 3D (direção, cor e intensidade).

### `Collider3D`
Define caixa AABB 3D com `width`, `height`, `depth` e flag `isStatic`.

## Sistemas 3D

### `RenderSystem3D`
- Compila shaders de vértices e fragmentos em WebGL
- Computa matrizes de modelo, visão e projeção (MVP)
- Aplica iluminação ambiente e difusa (Directional Lighting)
- Gerencia VBO, NBO e IBO com culling de faces traseiras e z-buffer

### `CollisionSystem3D`
- Teste e resolução de intersecção AABB no espaço 3D (X, Y e Z)

---

## Demos disponíveis

- `gameDemo/` - Demo 2D original
- `game3D/` - Demo 3D WebGL Nativo
