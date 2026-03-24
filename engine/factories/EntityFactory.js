import { Entity } from "../core/Entity.js";
import { Transform } from "../components/Transform.js";
import { Sprite } from "../components/Sprite.js";
import { Collider } from "../components/Collider.js";
import { Health } from "../components/Health.js";
import { Damage } from "../components/Damage.js";
import { Projectile } from "../components/Projectile.js";
import { Lifetime } from "../components/Lifetime.js";
import { Weapon } from "../components/Weapon.js";
import { Team } from "../components/Team.js";
import { Tag } from "../components/Tag.js";
import { Spawner } from "../components/Spawner.js";

import { PlayerController } from "../../game/scripts/PlayerController.js";
import { EnemyAI } from "../../game/scripts/EnemyAI.js";

/**
 * Fábrica central de entidades da engine 0.0.2
 */
export class EntityFactory {
  /**
   * @param {import("../utils/Logger.js").Logger|null} [logger=null]
   */
  constructor(logger = null) {
    /**
     * Logger da fábrica.
     * @type {import("../utils/Logger.js").Logger|null}
     */
    this.logger = logger;
  }

  /**
   * Cria o player.
   * @param {object} options
   * @param {number} options.x
   * @param {number} options.y
   * @returns {Entity}
   */
  createPlayer(options = {}) {
    const player = new Entity("Player");

    player.addComponent(
      new Transform(options.x ?? 100, options.y ?? 100, 32, 32),
    );
    player.addComponent(new Sprite("#3b82f6"));
    player.addComponent(new Collider(false));
    player.addComponent(new Health(100));
    player.addComponent(
      new Weapon({
        damage: 20,
        fireRate: 0.25,
        projectileSpeed: 450,
      }),
    );
    player.addComponent(new Team("player"));
    player.addComponent(new Tag("player"));
    player.addComponent(new PlayerController(180));

    this.logger?.info("factory", "Player criado.", {
      entityName: player.name,
      x: options.x ?? 100,
      y: options.y ?? 100,
    });

    return player;
  }

  /**
   * Cria um inimigo.
   * @param {object} options
   * @param {number} options.x
   * @param {number} options.y
   * @returns {Entity}
   */
  createEnemy(options = {}) {
    const enemy = new Entity(
      `Enemy_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    );

    enemy.addComponent(
      new Transform(options.x ?? 400, options.y ?? 200, 30, 30),
    );
    enemy.addComponent(new Sprite("#22c55e"));
    enemy.addComponent(new Collider(false));
    enemy.addComponent(new Health(40));
    enemy.addComponent(new Team("enemy"));
    enemy.addComponent(new Tag("enemy"));
    enemy.addComponent(
      new Weapon({
        damage: 8,
        fireRate: 0.9,
        projectileSpeed: 300,
      }),
    );
    enemy.addComponent(
      new EnemyAI({
        speed: 90,
        detectionRadius: 260,
        stopDistance: 28,
      }),
    );

    this.logger?.info("factory", "Inimigo criado.", {
      entityName: enemy.name,
      x: options.x ?? 400,
      y: options.y ?? 200,
    });

    return enemy;
  }

  /**
   * Cria uma parede.
   * @param {object} options
   * @param {string} options.name
   * @param {number} options.x
   * @param {number} options.y
   * @param {number} options.width
   * @param {number} options.height
   * @returns {Entity}
   */
  createWall(options = {}) {
    const wall = new Entity(options.name ?? "Wall");

    wall.addComponent(
      new Transform(
        options.x ?? 0,
        options.y ?? 0,
        options.width ?? 50,
        options.height ?? 50,
      ),
    );
    wall.addComponent(new Sprite("#6b7280"));
    wall.addComponent(new Collider(true));
    wall.addComponent(new Tag("wall"));
    wall.addComponent(new Team("neutral"));

    this.logger?.info("factory", "Parede criada.", {
      entityName: wall.name,
      x: options.x ?? 0,
      y: options.y ?? 0,
      width: options.width ?? 50,
      height: options.height ?? 50,
    });

    return wall;
  }

  /**
   * Cria uma fábrica.
   * @param {object} options
   * @param {number} options.x
   * @param {number} options.y
   * @returns {Entity}
   */
  createFactory(options = {}) {
    const factory = new Entity(options.name ?? "Factory");

    factory.addComponent(
      new Transform(options.x ?? 700, options.y ?? 120, 64, 64),
    );
    factory.addComponent(new Sprite("#f97316"));
    factory.addComponent(new Collider(true));
    factory.addComponent(new Health(options.health ?? 150));
    factory.addComponent(new Team(options.team ?? "enemy"));
    factory.addComponent(new Tag("factory"));

    if (options.enableSpawner ?? true) {
      factory.addComponent(
        new Spawner({
          interval: options.spawnInterval ?? 1,
          maxChildren: options.maxChildren ?? 25,
          spawnRadius: options.spawnRadius ?? 140,
          createEntity: (scene, x, y) => {
            return scene.engine.entityFactory.createEnemy({ x, y });
          },
        }),
      );
    }

    return factory;
  }

  /**
   * Cria uma bala.
   * @param {object} options
   * @param {number} options.x
   * @param {number} options.y
   * @param {number} options.directionX
   * @param {number} options.directionY
   * @param {number} options.speed
   * @param {number} options.damage
   * @param {Entity|null} options.owner
   * @returns {Entity}
   */
  createBullet(options = {}) {
    const bullet = new Entity("Bullet");
    const ownerTeam = this.#resolveOwnerTeam(options.owner);

    bullet.addComponent(new Transform(options.x ?? 0, options.y ?? 0, 10, 10));
    bullet.addComponent(new Sprite("#facc15"));
    bullet.addComponent(new Collider(false));
    bullet.addComponent(
      new Projectile({
        speed: options.speed ?? 450,
        directionX: options.directionX ?? 1,
        directionY: options.directionY ?? 0,
        owner: options.owner ?? null,
      }),
    );
    bullet.addComponent(new Lifetime(2));
    bullet.addComponent(new Damage(options.damage ?? 10));
    bullet.addComponent(new Team(ownerTeam));
    bullet.addComponent(new Tag("bullet"));

    this.logger?.debug("factory", "Projétil criado.", {
      entityName: bullet.name,
      x: options.x ?? 0,
      y: options.y ?? 0,
      damage: options.damage ?? 10,
      speed: options.speed ?? 450,
      ownerName: options.owner?.name ?? null,
      ownerTeam,
    });

    return bullet;
  }

  /**
   * Descobre o time do dono do projétil.
   * @param {Entity|null} owner
   * @returns {"player"|"enemy"|"neutral"}
   */
  #resolveOwnerTeam(owner) {
    if (!owner) return "neutral";

    const team = owner.getComponent(Team);
    return team?.name ?? "neutral";
  }
}
