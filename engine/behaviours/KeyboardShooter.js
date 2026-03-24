import { Script } from "../components/Script.js";
import { Weapon } from "../components/Weapon.js";
import { InputSystem } from "../systems/InputSystem.js";
import { KeyboardMovement } from "./KeyboardMovement.js";

/**
 * Behaviour nativo da engine para disparo por teclado.
 */
export class KeyboardShooter extends Script {
	/**
	 * @param {object} [options={}]
	 * @param {string[]} [options.fireKeys=[" "]]
	 * @param {number} [options.defaultDirectionX=1]
	 * @param {number} [options.defaultDirectionY=0]
	 */
	constructor(options = {}) {
		super();

		/**
		 * Teclas de disparo.
		 * @type {string[]}
		 */
		this.fireKeys = options.fireKeys ?? [" "];

		/**
		 * Direção padrão horizontal.
		 * @type {number}
		 */
		this.defaultDirectionX = options.defaultDirectionX ?? 1;

		/**
		 * Direção padrão vertical.
		 * @type {number}
		 */
		this.defaultDirectionY = options.defaultDirectionY ?? 0;
	}

	/**
	 * Atualiza o disparo da entidade.
	 * @returns {void}
	 */
	update() {
		const weapon = this.entity.getComponent(Weapon);

		if (!weapon) {
			return;
		}

		if (!this.#isAnyKeyDown(this.fireKeys)) {
			return;
		}

		const direction = this.#resolveShootDirection();
		weapon.fire(direction.x, direction.y);
	}

	/**
	 * Resolve a direção do disparo.
	 * @returns {{ x: number, y: number }}
	 */
	#resolveShootDirection() {
		const keyboardMovement = this.entity.getComponent(KeyboardMovement);

		if (keyboardMovement) {
			return keyboardMovement.getLastDirection();
		}

		return {
			x: this.defaultDirectionX,
			y: this.defaultDirectionY,
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