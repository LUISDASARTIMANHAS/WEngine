import { Component } from "../core/Component.js";
import { Transform } from "./Transform.js";

/**
 * Componente genérico de spawn periódico.
 */
export class Spawner extends Component {
	/**
	 * @param {object} [options={}]
	 * @param {number} [options.interval=1]
	 * @param {number} [options.maxChildren=10]
	 * @param {number} [options.spawnRadius=100]
	 * @param {(scene: import("../core/Scene.js").Scene, x: number, y: number) => import("../core/Entity.js").Entity|null} options.createEntity
	 */
	constructor(options = {}) {
		super();

		/**
		 * Intervalo entre spawns.
		 * @type {number}
		 */
		this.interval = options.interval ?? 1;

		/**
		 * Máximo de entidades vivas geradas por este spawner.
		 * @type {number}
		 */
		this.maxChildren = options.maxChildren ?? 10;

		/**
		 * Raio de spawn ao redor da entidade base.
		 * @type {number}
		 */
		this.spawnRadius = options.spawnRadius ?? 100;

		/**
		 * Callback responsável por criar a entidade.
		 * @type {(scene: import("../core/Scene.js").Scene, x: number, y: number) => import("../core/Entity.js").Entity|null}
		 */
		this.createEntity = options.createEntity ?? null;

		/**
		 * Tempo acumulado.
		 * @type {number}
		 */
		this.elapsed = 0;

		/**
		 * Nomes das entidades filhas vivas.
		 * @type {Set<string>}
		 */
		this.childrenNames = new Set();
	}

	/**
	 * Atualiza o spawner.
	 * @param {number} deltaTime
	 * @returns {void}
	 */
	update(deltaTime) {
		this.elapsed += deltaTime;

		if (this.elapsed < this.interval) {
			return;
		}

		const scene = this.entity?.scene;
		const transform = this.entity?.getComponent(Transform);

		if (!scene || !transform || typeof this.createEntity !== "function") {
			return;
		}

		this.#cleanupChildren(scene);

		if (this.childrenNames.size >= this.maxChildren) {
			return;
		}

		this.elapsed = 0;

		const position = this.#getSpawnPosition(transform);
		const child = this.createEntity(scene, position.x, position.y);

		if (!child) {
			return;
		}

		child.spawnerOwnerName = this.entity.name;
		this.childrenNames.add(child.name);
		scene.addEntity(child);
	}

	/**
	 * Remove filhos que já não existem mais.
	 * @param {import("../core/Scene.js").Scene} scene
	 * @returns {void}
	 */
	#cleanupChildren(scene) {
		for (const childName of this.childrenNames) {
			const child = scene.getEntityByName(childName);

			if (!child || child.destroyed) {
				this.childrenNames.delete(childName);
			}
		}
	}

	/**
	 * Calcula posição de spawn.
	 * @param {Transform} transform
	 * @returns {{x: number, y: number}}
	 */
	#getSpawnPosition(transform) {
		const angle = Math.random() * Math.PI * 2;
		const radius = 60 + Math.random() * this.spawnRadius;

		return {
			x: transform.x + Math.cos(angle) * radius,
			y: transform.y + Math.sin(angle) * radius,
		};
	}
}
