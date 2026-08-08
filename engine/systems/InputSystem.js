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
      const keyCode = event.code.toLowerCase();
      const keyName = event.key.toLowerCase();
      
      // Adicionar ambas as formas: "keya" e "a"
      InputSystem.keys.add(keyCode);
      InputSystem.keys.add(keyName);

      InputSystem.logger?.debugThrottle(
        `input-keydown-${keyCode}`,
        200,
        "input",
        "Tecla pressionada.",
        {
          key: keyCode
        }
      );
    });

    window.addEventListener("keyup", (event) => {
      const keyCode = event.code.toLowerCase();
      const keyName = event.key.toLowerCase();
      
      // Remover ambas as formas
      InputSystem.keys.delete(keyCode);
      InputSystem.keys.delete(keyName);

      InputSystem.logger?.debug("input", "Tecla liberada.", {
        key: keyCode
      });
    });

    InputSystem.logger?.info("input", "Sistema de input inicializado.");
    console.log("[WEngine] InputSystem inicializado - Pronto para capturar teclado");
  }

  /**
   * Verifica se uma tecla está pressionada.
   * @param {string} key
   * @returns {boolean}
   */
  static isKeyDown(key) {
    return InputSystem.keys.has(key);
  }

  /**
   * Retorna todas as teclas pressionadas.
   * @returns {string[]}
   */
  static getPressedKeys() {
    return Array.from(InputSystem.keys);
  }

  /**
   * Exibe as teclas pressionadas no console.
   * @returns {void}
   */
  static debugKeys() {
    console.log("[InputSystem] Teclas pressionadas:", InputSystem.getPressedKeys());
  }
}