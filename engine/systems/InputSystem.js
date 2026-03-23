/**
 * Sistema global de input.
 */
export class InputSystem {
  static keys = new Set();

  /**
   * Inicializa eventos de teclado.
   * @return {void}
   */
  static init() {
    window.addEventListener("keydown", (event) => {
      InputSystem.keys.add(event.key.toLowerCase());
    });

    window.addEventListener("keyup", (event) => {
      InputSystem.keys.delete(event.key.toLowerCase());
    });
  }

  /**
   * Verifica se uma tecla está pressionada.
   * @param {string} key
   * @returns {boolean}
   */
  static isKeyDown(key) {
    return InputSystem.keys.has(key.toLowerCase());
  }
}