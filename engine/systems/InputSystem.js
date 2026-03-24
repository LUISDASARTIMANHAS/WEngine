/**
 * Sistema global de input.
 */
export class InputSystem {
  static keys = new Set();

  /**
   * Logger do sistema.
   * @type {import("../utils/Logger.js").Logger|null}
   */
  static logger = null;

  /**
   * Inicializa eventos de teclado.
   * @param {import("../utils/Logger.js").Logger|null} [logger=null]
   * @return {void}
   */
  static init(logger = null) {
    InputSystem.logger = logger;

    window.addEventListener("keydown", (event) => {
      InputSystem.keys.add(event.key.toLowerCase());

      InputSystem.logger?.debugThrottle(
        `input-keydown-${event.key.toLowerCase()}`,
        200,
        "input",
        "Tecla pressionada.",
        {
          key: event.key.toLowerCase()
        }
      );
    });

    window.addEventListener("keyup", (event) => {
      InputSystem.keys.delete(event.key.toLowerCase());

      InputSystem.logger?.debug("input", "Tecla liberada.", {
        key: event.key.toLowerCase()
      });
    });

    InputSystem.logger?.info("input", "Sistema de input inicializado.");
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