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
     * @type {Array<{message: string, source: string, stack: string, timestamp: number, type: string, id: number}>}
     */
    this.errors = [];

    /**
     * Limite máximo de erros exibidos.
     * @type {number}
     */
    this.maxErrors = 20;

    /**
     * Contador de IDs única para erros.
     * @type {number}
     */
    this.errorIdCounter = 0;

    /**
     * Modo expandido (mostrar stack traces completos).
     * @type {boolean}
     */
    this.expandedMode = false;

    /**
     * Filtro ativo (null = todos, 'error', 'warning', 'info', 'debug').
     * @type {string|null}
     */
    this.activeFilter = null;

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
   * Cria o painel de erros no DOM com UI melhorada.
   * @private
   */
  createErrorPanel() {
    // Contêiner principal
    this.errorPanel = document.createElement("div");
    this.errorPanel.id = "wengine-error-panel";
    this.errorPanel.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 100%;
      max-width: 700px;
      max-height: 400px;
      background: rgba(15, 15, 20, 0.98);
      border: 2px solid #ff4444;
      border-radius: 8px;
      padding: 0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #ff9999;
      z-index: 10000;
      display: none;
      box-shadow: 0 0 30px rgba(255, 68, 68, 0.4);
      margin: 10px;
      display: flex;
      flex-direction: column;
    `;

    // Header com controles
    const header = document.createElement("div");
    header.id = "wengine-error-header";
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      border-bottom: 2px solid #ff4444;
      background: rgba(40, 15, 15, 0.8);
      gap: 8px;
      flex-wrap: wrap;
    `;

    // Título com contador
    const title = document.createElement("div");
    title.style.cssText = `
      font-weight: bold;
      color: #ff6666;
      flex: 1;
      min-width: 200px;
    `;
    title.innerHTML = `⚠ <span id="wengine-error-title">WEngine Errors</span> <span id="wengine-error-count" style="background: #ff4444; color: white; padding: 2px 6px; border-radius: 3px; margin-left: 8px;">0</span>`;

    // Controles
    const controls = document.createElement("div");
    controls.style.cssText = `
      display: flex;
      gap: 6px;
    `;

    // Botão de filtro
    const filterBtn = document.createElement("button");
    filterBtn.id = "wengine-error-filter";
    filterBtn.textContent = "Filter";
    filterBtn.style.cssText = `
      background: #444455;
      color: #aaaaaa;
      border: 1px solid #666677;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      font-weight: bold;
      transition: all 0.2s;
    `;
    filterBtn.onmouseover = () => { filterBtn.style.background = "#555566"; };
    filterBtn.onmouseout = () => { filterBtn.style.background = "#444455"; };

    // Botão expandir
    const expandBtn = document.createElement("button");
    expandBtn.id = "wengine-error-expand";
    expandBtn.textContent = "Expand";
    expandBtn.style.cssText = `
      background: #444455;
      color: #aaaaaa;
      border: 1px solid #666677;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      font-weight: bold;
      transition: all 0.2s;
    `;
    expandBtn.onmouseover = () => { expandBtn.style.background = "#555566"; };
    expandBtn.onmouseout = () => { expandBtn.style.background = "#444455"; };
    expandBtn.addEventListener("click", () => this.toggleExpandMode(expandBtn));

    // Botão limpar
    const clearBtn = document.createElement("button");
    clearBtn.id = "wengine-error-clear";
    clearBtn.textContent = "Clear";
    clearBtn.style.cssText = `
      background: #ff4444;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
      font-weight: bold;
      transition: all 0.2s;
    `;
    clearBtn.onmouseover = () => { clearBtn.style.background = "#ff6666"; };
    clearBtn.onmouseout = () => { clearBtn.style.background = "#ff4444"; };
    clearBtn.addEventListener("click", () => this.clearErrors());

    controls.appendChild(filterBtn);
    controls.appendChild(expandBtn);
    controls.appendChild(clearBtn);

    header.appendChild(title);
    header.appendChild(controls);

    // Container de mensagens com scroll
    const messagesContainer = document.createElement("div");
    messagesContainer.id = "wengine-error-messages";
    messagesContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    `;

    // Stats footer
    const footer = document.createElement("div");
    footer.id = "wengine-error-stats";
    footer.style.cssText = `
      padding: 6px 12px;
      border-top: 1px solid #333344;
      background: rgba(30, 10, 10, 0.8);
      font-size: 10px;
      color: #ff8888;
      display: flex;
      gap: 12px;
    `;
    footer.innerHTML = `
      <span>🔴 <span id="wengine-error-count-error">0</span> Errors</span>
      <span>🟡 <span id="wengine-error-count-warning">0</span> Warnings</span>
      <span>🔵 <span id="wengine-error-count-info">0</span> Info</span>
      <span>🟣 <span id="wengine-error-count-debug">0</span> Debug</span>
    `;

    this.errorPanel.appendChild(header);
    this.errorPanel.appendChild(messagesContainer);
    this.errorPanel.appendChild(footer);
    document.body.appendChild(this.errorPanel);

    // Event listener para filtro
    filterBtn.addEventListener("click", () => this.cycleFilter(filterBtn));
  }

  /**
   * Configura handlers globais de erro.
   * @private
   */
  setupGlobalErrorHandlers() {
    // Captura erros não tratados
    window.addEventListener("error", (event) => {
      this.addError(event.message, event.filename + ":" + event.lineno, event.error?.stack, "error");
    });

    // Captura promessas rejeitadas não tratadas
    window.addEventListener("unhandledrejection", (event) => {
      this.addError(
        "Unhandled Promise Rejection",
        event.reason?.message || String(event.reason),
        event.reason?.stack,
        "error"
      );
    });
  }

  /**
   * Adiciona um erro ao painel.
   * @param {string} message - Mensagem de erro
   * @param {string} [source="Unknown"] - Origem do erro
   * @param {string} [stack=""] - Stack trace do erro
   * @param {string} [type="error"] - Tipo (error, warning, info, debug)
   */
  addError(message, source = "Unknown", stack = "", type = "error") {
    const error = {
      id: this.errorIdCounter++,
      message,
      source,
      stack,
      timestamp: Date.now(),
      type: type.toLowerCase(),
    };

    this.errors.push(error);

    // Limita o número de erros exibidos
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    this.renderErrors();
  }

  /**
   * Adiciona um log ao painel de erros.
   * @param {{type:string,category:string,message:string,details:any[],timestamp:number}} entry
   */
  addLog(entry) {
    if (!entry || !entry.type || !entry.message) return;
    const source = `logger:${entry.category || "unknown"}`;
    const stack = Array.isArray(entry.details)
      ? entry.details.map((d) => {
          if (typeof d === "string") return d;
          if (d instanceof Error) return d.stack || d.message;
          try {
            return JSON.stringify(d);
          } catch (e) {
            return String(d);
          }
        }).join(" ")
      : String(entry.details || "");

    this.addError(entry.message, source, stack, entry.type);
  }

  /**
   * Adiciona um log arbitrário ao painel.
   * @param {{type:string,category:string,message:string,details:any[],timestamp:number}} entry
   */
  addLog(entry) {
    const source = `logger:${entry.category}`;
    const stack = entry.details?.map((d) => {
      if (typeof d === "string") return d;
      try {
        return JSON.stringify(d);
      } catch (e) {
        return String(d);
      }
    }).join(" ");

    this.addError(entry.message, source, stack, entry.type || "debug");
  }

  /**
   * Alterna o modo expandido.
   * @private
   */
  toggleExpandMode(button) {
    this.expandedMode = !this.expandedMode;
    button.textContent = this.expandedMode ? "Compact" : "Expand";
    button.style.background = this.expandedMode ? "#556655" : "#444455";
    this.renderErrors();
  }

  /**
   * Cicla através dos filtros.
   * @private
   */
  cycleFilter(button) {
    const filters = [null, "error", "warning", "info", "debug"];
    const currentIndex = filters.indexOf(this.activeFilter);
    this.activeFilter = filters[(currentIndex + 1) % filters.length];

    const labels = ["All", "Errors", "Warnings", "Info", "Debug"];
    button.textContent = labels[filters.indexOf(this.activeFilter)];
    button.style.background = this.activeFilter ? "#665555" : "#444455";

    this.renderErrors();
  }

  /**
   * Retorna erros filtrados.
   * @private
   */
  getFilteredErrors() {
    if (!this.activeFilter) return this.errors;
    return this.errors.filter(e => e.type === this.activeFilter);
  }

  /**
   * Renderiza os erros no painel.
   * @private
   */
  renderErrors() {
    const messagesContainer = document.getElementById("wengine-error-messages");
    if (!messagesContainer) return;

    const filtered = this.getFilteredErrors();
    messagesContainer.innerHTML = "";

    // Atualizar contador
    const countBadge = document.getElementById("wengine-error-count");
    if (countBadge) countBadge.textContent = this.errors.length;

    // Atualizar estatísticas
const stats = { error: 0, warning: 0, info: 0, debug: 0 };
      for (const err of this.errors) {
        if (stats.hasOwnProperty(err.type)) {
          stats[err.type]++;
        }
      }
      document.getElementById("wengine-error-count-error").textContent = stats.error;
      document.getElementById("wengine-error-count-warning").textContent = stats.warning;
      document.getElementById("wengine-error-count-info").textContent = stats.info;
      document.getElementById("wengine-error-count-debug").textContent = stats.debug;

    if (filtered.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.style.cssText = `
        padding: 20px;
        text-align: center;
        color: #888888;
      `;
      emptyMsg.textContent = this.activeFilter 
        ? `No ${this.activeFilter}s to display`
        : "No logs yet";
      messagesContainer.appendChild(emptyMsg);
      return;
    }

    for (const error of filtered) {
      const errorElement = this.createErrorElement(error);
      messagesContainer.appendChild(errorElement);
    }

    // Mostrar/ocultar painel
    this.errorPanel.style.display = this.errors.length > 0 ? "flex" : "none";

    // Scroll para o último erro
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  /**
   * Cria um elemento de erro HTML.
   * @private
   */
  createErrorElement(error) {
    const colors = {
      error: { border: "#ff4444", bg: "rgba(60, 15, 15, 0.9)", text: "#ffaaaa", icon: "🔴" },
      warning: { border: "#ffaa00", bg: "rgba(60, 45, 0, 0.9)", text: "#ffdd88", icon: "🟡" },
      info: { border: "#4488ff", bg: "rgba(15, 30, 60, 0.9)", text: "#88ccff", icon: "🔵" },
      debug: { border: "#8a63ff", bg: "rgba(40, 20, 60, 0.9)", text: "#c8b8ff", icon: "🟣" },
    };
    const color = colors[error.type] || colors.error;

    const container = document.createElement("div");
    container.style.cssText = `
      background: ${color.bg};
      border-left: 4px solid ${color.border};
      padding: 8px 10px;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    container.onmouseover = () => { container.style.background = color.bg.replace("0.9", "1.0"); };
    container.onmouseout = () => { container.style.background = color.bg; };

    const time = new Date(error.timestamp).toLocaleTimeString();
    const hasStack = error.stack && error.stack.length > 0;

    // Título
    const title = document.createElement("div");
    title.style.cssText = `
      color: ${color.text};
      font-weight: bold;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    `;
    title.innerHTML = `${color.icon} <span>${this.escapeHtml(error.message)}</span>`;

    container.appendChild(title);

    // Origem
    const source = document.createElement("div");
    source.style.cssText = `
      color: ${color.text.replace("aa", "88")};
      font-size: 10px;
      margin-bottom: 3px;
    `;
    source.textContent = error.source;
    container.appendChild(source);

    // Stack trace (expandido ou compacto)
    if (hasStack) {
      const stackLines = error.stack.split("\n").filter(l => l.trim());
      const displayLines = this.expandedMode ? stackLines : stackLines.slice(0, 1);

      const stack = document.createElement("div");
      stack.style.cssText = `
        color: ${color.text.replace("aa", "66")};
        font-size: 9px;
        margin-top: 4px;
        padding: 4px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 2px;
        max-height: ${this.expandedMode ? "200px" : "40px"};
        overflow: hidden;
        white-space: pre-wrap;
        word-break: break-word;
      `;
      stack.textContent = displayLines.join("\n");
      container.appendChild(stack);
    }

    // Timestamp
    const timestamp = document.createElement("div");
    timestamp.style.cssText = `
      color: ${color.text.replace("aa", "55")};
      font-size: 9px;
      margin-top: 4px;
    `;
    timestamp.textContent = time;
    container.appendChild(timestamp);

    return container;
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
   * Exporta erros como JSON.
   * @returns {string}
   */
  exportErrors() {
    return JSON.stringify(this.errors, null, 2);
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
