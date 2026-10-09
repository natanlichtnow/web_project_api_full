/**
 * Classe Section - Renderiza uma lista de elementos em uma página
 * Recebe dados através de um renderer (função callback)
 */
export class Section {
  /**
   * Construtor da classe Section
   * @param {Object} data - Objeto com propriedades items e renderer
   * @param {Array} data.items - Vetor de dados a ser adicionado na página
   * @param {Function} data.renderer - Função responsável por criar e renderizar dados
   * @param {string} containerSelector - Seletor CSS do contêiner onde adicionar os elementos
   */
  constructor({ items, renderer }, containerSelector) {
    this.items = items;
    this.renderer = renderer;
    this.container = document.querySelector(containerSelector);
  }

  /**
   * Renderiza todos os elementos na página
   * Itera sobre items e chama renderer para cada elemento
   */
  renderItems() {
    this.items.forEach((item) => {
      this.renderer(item);
    });
  }

  /**
   * Adiciona um elemento DOM ao contêiner
   * @param {HTMLElement} element - Elemento a ser adicionado
   */
  addItem(element) {
    this.container.prepend(element);
  }

  appendItem(element) {
    this.container.append(element);
  }
}
