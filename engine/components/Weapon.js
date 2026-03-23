import { Component } from "../core/Component.js";
import { Transform } from "./Transform.js";

/**
 * Componente de arma.
 */
export class Weapon extends Component {
    /**
     * @param {object} options
     * @param {number} options.damage
     * @param {number} options.fireRate
     * @param {number} options.projectileSpeed
     */
    constructor(options = {}) {
        super();
        this.damage = options.damage ?? 10;
        this.fireRate = options.fireRate ?? 0.3;
        this.projectileSpeed = options.projectileSpeed ?? 420;
        this.cooldown = 0;
    }

    /**
     * @param {number} deltaTime
     * @returns {void}
     */
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }

    /**
     * Atira um projétil.
     * @param {number} directionX
     * @param {number} directionY
     * @returns {void}
     */
    fire(directionX, directionY) {
        if (this.cooldown > 0) return;

        const scene = this.entity.scene;
        const transform = this.entity.getComponent(Transform);
        if (!scene || !transform) return;

        const bullet = scene.engine.entityFactory.createBullet({
            x: transform.x + transform.width / 2,
            y: transform.y + transform.height / 2,
            directionX,
            directionY,
            speed: this.projectileSpeed,
            damage: this.damage,
            owner: this.entity
        });

        scene.addEntity(bullet);
        this.cooldown = this.fireRate;
    }
}