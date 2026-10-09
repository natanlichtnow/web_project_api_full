export class FormValidator {
  constructor(config, formElement) {
    this.config = config;
    this.formElement = formElement;
    this.inputElements = this.formElement.querySelectorAll(this.config.inputSelector);
    this.submitButton = this.formElement.querySelector(this.config.submitButtonSelector);
  }

  #checkFormValidity() {
    const isValid = Array.from(this.inputElements).every(
      (input) => input.validity.valid && input.value.trim() !== ""
    );
    this.#toggleSubmitButton(isValid);
  }

  #toggleSubmitButton(isValid) {
    if (isValid) {
      this.submitButton.classList.remove(this.config.inactiveButtonClass);
      this.submitButton.disabled = false;
    } else {
      this.submitButton.classList.add(this.config.inactiveButtonClass);
      this.submitButton.disabled = true;
    }
  }

  #addEventListenersToInputs() {
    this.inputElements.forEach((input) => {
      input.addEventListener("input", () => this.#checkFormValidity());
    });
  }

  setEventListeners() {
    this.#addEventListenersToInputs();
    this.#checkFormValidity();
  }

  resetValidation() {
    this.#checkFormValidity();
  }
}