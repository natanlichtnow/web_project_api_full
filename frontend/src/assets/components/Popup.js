/**
 * Classe Popup - Gerencia abertura, fechamento e eventos de popups
 */
export class Popup {
  /**
   * Construtor da classe Popup
   * @param {string} popupSelector - Seletor CSS do elemento popup
   */
  constructor(popupSelector) {
    this.popup = document.querySelector(popupSelector);
    this.closeButton = this.popup.querySelector(".popup__close");
    this.handleEscClose = this.handleEscClose.bind(this);
  }

  /**
   * Abre o popup
   */
  open() {
    this.popup.classList.add("popup_is-opened");
    document.addEventListener("keydown", this.handleEscClose);
  }

  /**
   * Fecha o popup
   */
  close() {
    this.popup.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", this.handleEscClose);
  }

  /**
   * Método para fechar o popup ao pressionar Esc
   */
  handleEscClose(event) {
    if (event.key === "Escape") {
      this.close();
    }
  }

  /**
   * Adiciona listeners de evento para fechar o popup
   * - Click no botão fechar
   * - Click na área sombreada (overlay)
   */
  setEventListeners() {
    // Fechar ao clicar no botão fechar
    this.closeButton.addEventListener("click", () => this.close());

    // Fechar ao clicar na área sombreada
    this.popup.addEventListener("click", (event) => {
      if (event.target === this.popup) {
        this.close();
      }
    });
  }
}
