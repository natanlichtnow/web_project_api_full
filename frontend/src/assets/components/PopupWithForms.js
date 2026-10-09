import { Popup } from "./Popup.js";

/**
 * Classe PopupWithForms - Herança de Popup
 * Gerencia popups com formulários, envio e coleta de dados
 */
export class PopupWithForms extends Popup {
  /**
   * Construtor da classe PopupWithForms
   * @param {string} popupSelector - Seletor CSS do elemento popup
   * @param {Function} submitCallback - Função de callback para envio do formulário
   */
  constructor(popupSelector, submitCallback) {
    super(popupSelector);
    this.submitCallback = submitCallback;
    this.form = this.popup.querySelector(".popup__form");
    this.submitButton = this.form.querySelector(".popup__button");
    this.defaultButtonText = this.submitButton.textContent;
    this.isListenerAdded = false;
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  /**
   * Método privado para coletar dados de todos os campos de entrada
   * @private
   * @returns {Object} Objeto com os valores dos inputs (chave: name do input)
   */
  #getInputValues() {
    const inputValues = {};
    const inputElements = this.form.querySelectorAll(".popup__input");
    inputElements.forEach((input) => {
      inputValues[input.name] = input.value;
    });
    return inputValues;
  }

  /**
   * Handle para envio do formulário
   * @private
   */
  handleFormSubmit(event) {
    event.preventDefault();
    const formData = this.#getInputValues();
    this.submitCallback(formData);
  }

  setInputValues(inputValues) {
    const inputElements = this.form.querySelectorAll(".popup__input");
    inputElements.forEach((input) => {
      if (Object.prototype.hasOwnProperty.call(inputValues, input.name)) {
        input.value = inputValues[input.name];
      }
    });
  }

  renderLoading(isLoading, loadingText = "Salvando...") {
    this.submitButton.textContent = isLoading ? loadingText : this.defaultButtonText;
    this.submitButton.disabled = isLoading;
  }

  /**
   * Adiciona listeners de evento para o formulário
   * Sobrescreve o método setEventListeners() da classe pai
   */
  setEventListeners() {
    // Chama o setEventListeners da classe pai
    super.setEventListeners();

    // Adiciona listener para o envio do formulário apenas uma vez
    if (!this.isListenerAdded) {
      this.form.addEventListener("submit", this.handleFormSubmit);
      this.isListenerAdded = true;
    }
  }

  /**
   * Fecha o popup e reseta o formulário
   * Sobrescreve o método close() da classe pai
   */
  close() {
    super.close();
    this.form.reset();
    this.renderLoading(false);
  }
}
