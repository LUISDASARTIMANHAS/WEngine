# WEngine

Motor de jogo 2D e 3D para navegador, desenvolvido em JavaScript com foco em simplicidade, modularidade e evolução incremental.

A proposta da WEngine é servir como uma base própria para criação de jogos no navegador, oferecendo arquitetura orientada a componentes, entidades reutilizáveis, sistemas independentes, suporte a WebGL 3D nativo e gameplay progressiva.

Atualmente o projeto está na versão **0.0.3**, com recursos para 2D e suporte nativo completo a **3D WebGL** (transformação 3D, malhas, iluminação, câmera perspectiva e física/colisão 3D).

---

## Visão geral

A engine foi criada para permitir testes rápidos de ideias de gameplay sem depender de engines prontas como Unity ou Unreal.

O foco desta fase é construir uma base funcional com:

- renderização 2D em canvas e **renderização 3D em WebGL Nativo**
- sistema de entidades e componentes em arquitetura ECS
- matemática 3D (`Vector3`, `Matrix4`, projeções perspectiva e visão)
- transformações 3D (`Transform3D`) e primitivas de malha (`Mesh3D`: cubo, plano, pirâmide)
- iluminação 3D (`Light3D`: direcional, ambiente)
- câmera 2D e câmera 3D perspectiva (`Camera3D`)
- colisão 2D AABB e colisão 3D AABB (`CollisionSystem3D`, `Collider3D`)
- movimentação de jogador em 3D (`KeyboardMovement3D`)
- fábrica de entidades extensível para 2D e 3D

---

## Objetivo do projeto

O objetivo da WEngine é evoluir de forma incremental, começando com uma estrutura mínima e expandindo para recursos mais avançados conforme a necessidade do jogo.

---

## Estado atual

Versão atual: **v0.0.3**

Recursos já implementados:

- loop principal 2D / 3D
- renderização 3D nativa via WebGL (`RenderSystem3D`)
- shader de iluminação (Phong/Directional) e matrizes MVP
- componentes 3D (`Transform3D`, `Mesh3D`, `Light3D`, `Collider3D`)
- física e resolução de colisão 3D (`CollisionSystem3D`)
- câmera 3D perspectiva com acompanhamento de alvos (`Camera3D`)
- controles 3D de jogador (`KeyboardMovement3D`)
- exemplo de demo jogável 3D em `game3D/`
- sistema 2D original completo em `gameDemo/`

---

## Estrutura do projeto

```txt
WEngine
├── engine
│   ├── components
│   │   ├── Collider3D.js
│   │   ├── Light3D.js
│   │   ├── Mesh3D.js
│   │   └── Transform3D.js
│   ├── core
│   │   ├── Camera3D.js
│   │   ├── Engine.js
│   │   └── ...
│   ├── systems
│   │   ├── CollisionSystem3D.js
│   │   ├── RenderSystem3D.js
│   │   └── ...
│   └── utils
│       └── Math3D.js
├── game2D (gameDemo)
└── game3D
    ├── index.html
    ├── main.js
    └── scenes
        └── TestScene3D.js
```