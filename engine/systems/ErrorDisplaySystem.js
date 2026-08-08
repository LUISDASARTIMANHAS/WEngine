/**
 * Sistema de Exibição de Erros na Tela.
 * Captura erros globais e os exibe em um painel visual na página.
 */
export class ErrorDisplaySystem {
  constructor() {
    /**
     * Contêiner do painel de erros.
     * @type {HTMLDivElement|null}
     */
    this.errorPanel = null;

    /**
     * Lista de erros armazenados.
     * @type {Array<{message: string, stack: string, timestamp: number}>}
     */
    this.errors = [];

    /**
     * Limite máximo de erros exibidos.
     * @type {number}
     */
    this.maxErrors = 10;

    this.init();
  }

  /**
   * Inicializa o sistema de exibição de erros.
   */
  init() {
    this.createErrorPanel();
    this.setupGlobalErrorHandlers();
  }

  /**
   * Cria o painel de erros no DOM.
   * @private
   */
  createErrorPanel() {
    // Cria o contêiner principal do painel
    this.errorPanel = document.createElement("div");
    this.errorPanel.id = "wengine-error-panel";
    this.errorPanel.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 100%;
      max-width: 600px;
      max-height: 300px;
      background: rgba(20, 20, 25, 0.95);
      border: 2px solid #ff4444;
      border-radius: 8px;
      padding: 12px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #ff9999;
      z-index: 10000;
      overflow-y: auto;
      display: none;
      box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
      margin: 10px;
    `;

    // Cria o header do painel
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ff4444;
      font-weight: bold;
      color: #ff6666;
    `;
    header.innerHTML = `
      <span>⚠ WEngine Error Display</span>
      <button id="wengine-error-clear" style="
        background: #ff4444;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        font-weight: bold;
      ">Clear</button>
    `;

    // Cria o container de mensagens
    const messagesContainer = document.createElement("div");
    messagesContainer.id = "wengine-error-messages";
    messagesContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;

    this.errorPanel.appendChild(header);
    this.errorPanel.appendChild(messagesContainer);
    document.body.appendChild(this.errorPanel);

    // Event listener para limpar erros
    document.getElementById("wengine-error-clear").addEventListener("click", () => {
      this.clearErrors();
    });
  }

  /**
   * Configura handlers globais de erro.
   * @private
   */
  setupGlobalErrorHandlers() {
    // Captura erros não tratados
    window.addEventListener("error", (event) => {
      this.addError(event.message, event.filename + ":" + event.lineno, event.error?.stack);
    });

    // Captura promessas rejeitadas não tratadas
    window.addEventListener("unhandledrejection", (event) => {
      this.addError(
        "Unhandled Promise Rejection",
        event.reason?.message || String(event.reason),
        event.reason?.stack
      );
    });
  }

  /**
   * Adiciona um erro ao painel.
   * @param {string} message - Mensagem de erro
   * @param {string} [source="Unknown"] - Origem do erro
   * @param {string} [stack=""] - Stack trace do erro
   */
  addError(message, source = "Unknown", stack = "") {
    const error = {
      message,
      source,
      stack,
      timestamp: Date.now(),
    };

    this.errors.push(error);

    // Limita o número de erros exibidos
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    this.renderErrors();
  }

  /**
   * Renderiza os erros no painel.
   * @private
   */
  renderErrors() {
    const messagesContainer = document.getElementById("wengine-error-messages");
    if (!messagesContainer) return;

    messagesContainer.innerHTML = "";

    for (const error of this.errors) {
      const errorElement = document.createElement("div");
      errorElement.style.cssText = `
        background: rgba(50, 20, 20, 0.8);
        border-left: 3px solid #ff4444;
        padding: 6px 8px;
        border-radius: 3px;
        margin-bottom: 4px;
        line-height: 1.4;
      `;

      const time = new Date(error.timestamp).toLocaleTimeString();
      const shortStack = error.stack
        ?.split("\n")
        .slice(0, 2)
        .join("\n")
        .substring(0, 200) || "";

      errorElement.innerHTML = `
        <div style="color: #ffaaaa; font-weight: bold;">${error.message}</div>
        <div style="color: #ff8888; font-size: 10px;">${error.source}</div>
        ${shortStack ? `<div style="color: #ff6666; font-size: 10px; margin-top: 2px;">${this.escapeHtml(shortStack)}</div>` : ""}
        <div style="color: #ff5555; font-size: 9px; margin-top: 2px;">${time}</div>
      `;

      messagesContainer.appendChild(errorElement);
    }

    // Mostra o painel se houver erros
    this.errorPanel.style.display = this.errors.length > 0 ? "block" : "none";

    // Scroll para o último erro
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Limpa todos os erros.
   */
  clearErrors() {
    this.errors = [];
    this.renderErrors();
  }

  /**
   * Escapa caracteres HTML para evitar XSS.
   * @private
   * @param {string} text
   * @returns {string}
   */
  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Retorna o número de erros armazenados.
   * @returns {number}
   */
  getErrorCount() {
    return this.errors.length;
  }

  /**
   * Retorna todos os erros.
   * @returns {Array<object>}
   */
  getAllErrors() {
    return [...this.errors];
  }

  /**
   * Limpa o painel de erros do DOM.
   */
  destroy() {
    if (this.errorPanel) {
      this.errorPanel.remove();
      this.errorPanel = null;
    }
  }
}
