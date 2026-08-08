# WEngine - Engine 2D & 3D WebGL

Este documento descreve a arquitetura interna da WEngine, sua estrutura de módulos **2D** e **3D** claramente separados, e o ecossistema WebGL expandido.

---

## Estrutura e Separação de Módulos (2D vs 3D)

Para evitar qualquer confusão entre desenvolvimento 2D e 3D, a WEngine foi reestruturada em sub-módulos dedicados e independentes sob `engine/2d/` e `engine/3d/`, acessíveis via importações diretas ou namespaces:

```
engine/
├── index.js              # Ponto de entrada unificado da Engine e ECS
├── 2d/                   # Módulo Exclusivo 2D (Canvas Context)
│   ├── index.js          # Barrel export de todas as APIs 2D
│   ├── components/       # Transform2D, Sprite, Collider2D
│   ├── systems/          # RenderSystem2D, CollisionSystem2D, MinimapSystem
│   ├── core/             # Camera2D
│   └── behaviours/       # KeyboardMovement2D
└── 3d/                   # Módulo Exclusivo 3D (WebGL Native)
    ├── index.js          # Barrel export de todas as APIs 3D
    ├── components/       # Transform3D, Mesh3D, Light3D, Collider3D, Material3D, Skybox3D, ParticleSystem3D
    ├── systems/          # RenderSystem3D, CollisionSystem3D
    ├── core/             # Camera3D, OrbitControls3D, Raycaster3D
    ├── behaviours/       # KeyboardMovement3D, Rotator3D, Floating3D
    └── utils/            # Math3D (Vector3, Matrix4, Ray), OBJLoader3D
```

### Como importar:

#### 1. Importação Modular 3D (Recomendado para 3D)
```js
import { Engine, InputSystem } from "./engine/index.js";
import {
  Mesh3D,
  Transform3D,
  Material3D,
  Skybox3D,
  ParticleSystem3D,
  Raycaster3D,
  OrbitControls3D,
  OBJLoader3D
} from "./engine/3d/index.js";
```

#### 2. Importação Modular 2D (Recomendado para 2D)
```js
import { Engine } from "./engine/index.js";
import { Transform2D, Sprite, Collider2D, RenderSystem2D } from "./engine/2d/index.js";
```

---

## O que foi Adicionado / Melhorias no 3D

1. **Suporte a Novas Primitivas Geométricas em `Mesh3D`**:
   - `Mesh3D.createSphere(radius, latitudeBands, longitudeBands, color)`
   - `Mesh3D.createCylinder(radius, height, segments, color)`
   - `Mesh3D.createTorus(radius, tube, radialSegments, tubularSegments, color)`
   - `Mesh3D.createCube(size, color)` e `Mesh3D.createPlane(width, depth, color)` com Coordenadas UV.

2. **Sistema de Materiais e Texturas (`Material3D`)**:
   - Mapeamento UV e aplicação de texturas 2D (`WebGLTexture`).
   - Gerador procedural de textura de tabuleiro de xadrez (`Material3D.createCheckerboardTexture()`).
   - Parâmetros para cor especular e brilho Phong (`shininess`).

3. **Iluminação Avançada e Múltiplas Fontes**:
   - Modelo de reflexão Blinn-Phong com realces especulares.
   - Luzes **Direcionais**, **Ambiente** e **Pontuais** com atenuação por distância.

4. **Interatividade por Mouse (`Raycaster3D`)**:
   - Conversão de coordenadas do mouse na tela para um raio no espaço 3D (Raycasting).
   - Teste de intersecção com objetos e caixas de colisão `Collider3D` para seleção ou clique.

5. **Controle da Câmera via Mouse (`OrbitControls3D`)**:
   - Rotação orbital ao arrastar o mouse e zoom por rolagem da roda do mouse.

6. **Sistema de Partículas 3D WebGL (`ParticleSystem3D`)**:
   - Emissão de partículas no espaço 3D com física de gravidade, esvanecimento de cor e explosões dinâmicas (`burst()`).

7. **Ambiente / Skybox (`Skybox3D`)**:
   - Renderização de caixa de céu 3D de fundo.

8. **Carregador de Modelos 3D (`OBJLoader3D`)**:
   - Parser nativo para arquivos `.obj` de modeladores 3D como Blender.

---

## Exemplo de Uso 3D

```js
import { Engine } from "./engine/index.js";
import { Transform3D, Mesh3D, Material3D, Skybox3D, ParticleSystem3D } from "./engine/3d/index.js";

const canvas = document.getElementById("gameCanvas3D");
const engine = new Engine(canvas, { mode: "3d", fov: 60 });

const scene = engine.currentScene;
```

---

## Demos Disponíveis

- `gameDemo/` - Demo jogável 2D Canvas
- `game3D/` - Demo jogável WebGL 3D interativa
