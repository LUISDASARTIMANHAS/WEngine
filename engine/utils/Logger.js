/**
 * Logger central da WEngine.
 */
export class Logger {
  /**
   * @param {LoggerOptions} [options={}]
   */
  constructor(options = {}) {
    /**
     * Ativa ou desativa todos os logs.
     * @type {boolean}
     */
    this.enabled = options.enabled ?? true;

    /**
     * Ativa ou desativa logs de debug.
     * @type {boolean}
     */
    this.debugEnabled = options.debugEnabled ?? true;

    /**
     * Prefixo padrão.
     * @type {string}
     */
    this.prefix = options.prefix ?? "WEngine";

    /**
     * Categorias permitidas.
     * Se vazio, aceita todas.
     * @type {Set<string>}
     */
    this.allowedCategories = new Set(options.allowedCategories ?? []);

    /**
     * Chaves de throttle.
     * @type {Map<string, number>}
     */
    this.throttleMap = new Map();
  }

  /**
   * Verifica se pode logar a categoria.
   * @param {string} category
   * @returns {boolean}
   */
  shouldLog(category) {
    if (!this.enabled) return false;
    if (this.allowedCategories.size === 0) return true;
    return this.allowedCategories.has(category);
  }

  /**
   * Monta prefixo visual.
   * @param {string} level
   * @param {string} category
   * @returns {string}
   */
  formatPrefix(level, category) {
    return `[${this.prefix}][${level.toUpperCase()}][${category}]`;
  }

  /**
   * Log informativo.
   * @param {string} category
   * @param {string} message
   * @param {...any} details
   * @returns {void}
   */
  info(category, message, ...details) {
    if (!this.shouldLog(category)) return;
    console.info(this.formatPrefix("info", category), message, ...details);
  }

  /**
   * Log de aviso.
   * @param {string} category
   * @param {string} message
   * @param {...any} details
   * @returns {void}
   */
  warn(category, message, ...details) {
    if (!this.shouldLog(category)) return;
    console.warn(this.formatPrefix("warn", category), message, ...details);
  }

  /**
   * Log de erro.
   * @param {string} category
   * @param {string} message
   * @param {...any} details
   * @returns {void}
   */
  error(category, message, ...details) {
    if (!this.shouldLog(category)) return;
    console.error(this.formatPrefix("error", category), message, ...details);
  }

  /**
   * Log de depuração.
   * @param {string} category
   * @param {string} message
   * @param {...any} details
   * @returns {void}
   */
  debug(category, message, ...details) {
    if (!this.debugEnabled) return;
    if (!this.shouldLog(category)) return;
    console.debug(this.formatPrefix("debug", category), message, ...details);
  }

  /**
   * Log de debug com limitação por intervalo.
   * @param {string} key
   * @param {number} intervalMs
   * @param {string} category
   * @param {string} message
   * @param {...any} details
   * @returns {void}
   */
  debugThrottle(key, intervalMs, category, message, ...details) {
    if (!this.debugEnabled) return;
    if (!this.shouldLog(category)) return;

    const now = performance.now();
    const lastTime = this.throttleMap.get(key) ?? 0;

    if (now - lastTime < intervalMs) {
      return;
    }

    this.throttleMap.set(key, now);
    console.debug(this.formatPrefix("debug", category), message, ...details);
  }

  /**
   * Ativa ou desativa o logger.
   * @param {boolean} enabled
   * @returns {void}
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Ativa ou desativa debug.
   * @param {boolean} enabled
   * @returns {void}
   */
  setDebugEnabled(enabled) {
    this.debugEnabled = enabled;
  }

  /**
   * Define as categorias permitidas.
   * @param {string[]} categories
   * @returns {void}
   */
  setAllowedCategories(categories) {
    this.allowedCategories = new Set(categories);
  }

  /**
   * Limpa filtro de categorias.
   * @returns {void}
   */
  clearCategories() {
    this.allowedCategories.clear();
  }
}

/**
 * @typedef {Object} LoggerOptions
 * @property {boolean} [enabled]
 * @property {boolean} [debugEnabled]
 * @property {string} [prefix]
 * @property {string[]} [allowedCategories]
 */