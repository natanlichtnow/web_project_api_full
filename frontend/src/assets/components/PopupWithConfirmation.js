import { Popup } from "./Popup.js";

export class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this.popup.querySelector(".popup__form");
    this._handleSubmit = null;
    this._onSubmit = this._onSubmit.bind(this);
  }

  _onSubmit(event) {
    event.preventDefault();

    if (this._handleSubmit) {
      this._handleSubmit();
    }
  }

  setSubmitAction(action) {
    this._handleSubmit = action;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", this._onSubmit);
  }
}
