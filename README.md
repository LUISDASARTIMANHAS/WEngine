# WEngine

Motor de jogo 2D para navegador, desenvolvido em JavaScript com foco em simplicidade, modularidade e evolução incremental.

A proposta da WEngine é servir como uma base própria para criação de jogos no navegador, oferecendo arquitetura orientada a componentes, entidades reutilizáveis, sistemas independentes e suporte a gameplay progressiva.

Atualmente o projeto está na versão **0.0.2**, com recursos iniciais para movimentação, câmera, colisão, vida, dano, projéteis, armas, entidades de combate e fábricas de spawn.

---

## Visão geral

A engine foi criada para permitir testes rápidos de ideias de gameplay sem depender de engines prontas como Unity ou Unreal.

O foco desta fase é construir uma base funcional com:

- renderização 2D em canvas
- sistema de entidades e componentes
- cena principal
- câmera
- colisão
- vida e morte
- projéteis
- armas
- inimigos com IA simples
- fábricas de entidades
- depuração básica

---

## Objetivo do projeto

O objetivo da WEngine é evoluir de forma incremental, começando com uma estrutura mínima e expandindo para recursos mais avançados conforme a necessidade do jogo.

Em vez de tentar competir com engines grandes logo no início, a ideia é construir um núcleo limpo, entendível e fácil de modificar.

---

## Estado atual

Versão atual: **v0.0.2**

Recursos já implementados:

- loop principal
- controle de tempo
- sistema de cena
- sistema de entidades
- sistema de componentes
- câmera
- renderização de sprites simples
- colisão básica
- player controlável
- inimigos com perseguição
- arma e disparo
- projéteis
- sistema de dano
- sistema de vida
- destruição de entidades
- limpeza de entidades destruídas
- fábricas/spawners de inimigos

---

## Estrutura do projeto

```txt
project/
├── index.html
├── style.css
├── engine/
│   ├── core/
│   │   ├── Engine.js
│   │   ├── Scene.js
│   │   ├── Entity.js
│   │   ├── Component.js
│   │   └── Camera.js
│   │
│   ├── components/
│   │   ├── Transform.js
│   │   ├── Sprite.js
│   │   ├── Collider.js
│   │   ├── Script.js
│   │   ├── Health.js
│   │   ├── Damage.js
│   │   ├── Weapon.js
│   │   ├── Projectile.js
│   │   ├── Lifetime.js
│   │   ├── Team.js
│   │   └── Tag.js
│   │
│   ├── systems/
│   │   ├── InputSystem.js
│   │   ├── RenderSystem.js
│   │   ├── CollisionSystem.js
│   │   ├── DamageSystem.js
│   │   └── CleanupSystem.js
│   │
│   ├── factories/
│   │   └── EntityFactory.js
│   │
│   └── utils/
│       └── Time.js
│
└── game/
    ├── main.js
    ├── scenes/
    │   └── TestScene.js
    └── scripts/
        ├── PlayerController.js
        ├── EnemyAI.js
        └── FactorySpawner.js