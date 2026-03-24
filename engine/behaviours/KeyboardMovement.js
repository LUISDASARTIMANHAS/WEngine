import { Script } from "../components/Script.js";
import { Transform } from "../components/Transform.js";
import { InputSystem } from "../systems/InputSystem.js";

/**
 * Behaviour nativo da engine para movimentação por teclado.
 */
export class KeyboardMovement extends Script {
	/**
	 * @param {object} [options={}]
	 * @param {number} [options.speed=180]
	 * @param {string[]} [options.leftKeys=["a", "arrowleft"]]
	 * @param {string[]} [options.rightKeys=["d", "arrowright"]]
	 * @param {string[]} [options.upKeys=["w", "arrowup"]]
	 * @param {string[]} [options.downKeys=["s", "arrowdown"]]
	 */
	constructor(options = {}) {
		super();

		/**
		 * Velocidade de movimentação.
		 * @type {number}
		 */
		this.speed = options.speed ?? 180;

		/**
		 * Teclas para mover à esquerda.
		 * @type {string[]}
		 */
		this.leftKeys = options.leftKeys ?? ["a", "arrowleft"];

		/**
		 * Teclas para mover à direita.
		 * @type {string[]}
		 */
		this.rightKeys = options.rightKeys ?? ["d", "arrowright"];

		/**
		 * Teclas para mover para cima.
		 * @type {string[]}
		 */
		this.upKeys = options.upKeys ?? ["w", "arrowup"];

		/**
		 * Teclas para mover para baixo.
		 * @type {string[]}
		 */
		this.downKeys = options.downKeys ?? ["s", "arrowdown"];

		/**
		 * Última direção horizontal.
		 * @type {number}
		 */
		this.lastDirectionX = 1;

		/**
		 * Última direção vertical.
		 * @type {number}
		 */
		this.lastDirectionY = 0;
	}

	/**
	 * Atualiza a movimentação da entidade.
	 * @param {number} deltaTime
	 * @returns {void}
	 */
	update(deltaTime) {
		const transform = this.entity.getComponent(Transform);

		if (!transform) {
			return;
		}

		let moveX = 0;
		let moveY = 0;

		if (this.#isAnyKeyDown(this.leftKeys)) {
			moveX -= 1;
		}

		if (this.#isAnyKeyDown(this.rightKeys)) {
			moveX += 1;
		}

		if (this.#isAnyKeyDown(this.upKeys)) {
			moveY -= 1;
		}

		if (this.#isAnyKeyDown(this.downKeys)) {
			moveY += 1;
		}

		if (moveX !== 0 || moveY !== 0) {
			const length = Math.hypot(moveX, moveY) || 1;
			moveX /= length;
			moveY /= length;

			this.lastDirectionX = moveX;
			this.lastDirectionY = moveY;
		}

		transform.x += moveX * this.speed * deltaTime;
		transform.y += moveY * this.speed * deltaTime;
	}

	/**
	 * Retorna a última direção de movimento.
	 * @returns {{ x: number, y: number }}
	 */
	getLastDirection() {
		return {
			x: this.lastDirectionX,
			y: this.lastDirectionY,
		};
	}

	/**
	 * Verifica se alguma tecla da lista está pressionada.
	 * @param {string[]} keys
	 * @returns {boolean}
	 */
	#isAnyKeyDown(keys) {
		return keys.some((key) => InputSystem.isKeyDown(key));
	}
}
