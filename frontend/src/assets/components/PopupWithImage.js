import { Popup } from "./Popup.js";

/**
 * Classe PopupWithImage - Herança de Popup
 * Exibe uma imagem com legenda no popup
 */
export class PopupWithImage extends Popup {
  /**
   * Construtor da classe PopupWithImage
   * @param {string} popupSelector - Seletor CSS do elemento popup
   */
  constructor(popupSelector) {
    super(popupSelector);
    this.imageElement = this.popup.querySelector(".popup__image");
    this.captionElement = this.popup.querySelector(".popup__caption");
  }

  /**
   * Abre o popup e define a imagem e legenda
   * Sobrescreve o método open() da classe pai
   * @param {Object} data - Objeto com src (url da imagem) e name (legenda)
   * @param {string} data.link - URL da imagem
   * @param {string} data.name - Legenda da imagem
   */
  open(data) {
    if (!data || !data.link) {
      console.error("Erro: dados de imagem inválidos", data);
      return;
    }
    this.imageElement.src = data.link;
    this.imageElement.alt = data.name || "Imagem";
    this.captionElement.textContent = data.name || "";
    super.open();
  }
}
