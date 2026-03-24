/**
 * Cliente de rede da engine.
 */
export class NetworkClientSystem {
  /**
   * @param {string} url
   */
  constructor(url) {
    /**
     * URL do servidor WebSocket.
     * @type {string}
     */
    this.url = url;

    /**
     * Socket atual.
     * @type {WebSocket|null}
     */
    this.socket = null;

    /**
     * Indica se está conectado.
     * @type {boolean}
     */
    this.connected = false;

    /**
     * Callback de snapshot.
     * @type {(data: any) => void}
     */
    this.onSnapshot = () => {};
  }

  /**
   * Conecta ao servidor.
   * @returns {void}
   */
  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener("open", () => {
      this.connected = true;
      console.log("[Network] conectado");
    });

    this.socket.addEventListener("close", () => {
      this.connected = false;
      console.log("[Network] desconectado");
    });

    this.socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "snapshot") {
        this.onSnapshot(data);
      }
    });
  }

  /**
   * Envia input do jogador.
   * @param {object} input
   * @returns {void}
   */
  sendInput(input) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.socket.send(JSON.stringify({
      type: "player_input",
      ...input
    }));
  }
}