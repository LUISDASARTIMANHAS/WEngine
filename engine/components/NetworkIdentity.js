/**
 * Identidade de rede da entidade.
 */
export class NetworkIdentity {
  /**
   * @param {object} [options={}]
   * @param {string|null} [options.networkId=null]
   * @param {string|null} [options.ownerClientId=null]
   * @param {boolean} [options.replicated=true]
   */
  constructor(options = {}) {
    /**
     * ID único da entidade na rede.
     * @type {string|null}
     */
    this.networkId = options.networkId ?? null;

    /**
     * ID do cliente dono da entidade.
     * @type {string|null}
     */
    this.ownerClientId = options.ownerClientId ?? null;

    /**
     * Define se a entidade deve ser replicada na rede.
     * @type {boolean}
     */
    this.replicated = options.replicated ?? true;
  }
}