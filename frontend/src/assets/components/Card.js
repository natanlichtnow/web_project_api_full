const cardTemplate = document.querySelector("#card-template");

export class Card {
  constructor({ data, userId, handleCardClick, handleDeleteClick, handleLikeClick }) {
    this._data = data;
    this._userId = userId;
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
    this._cardElement = null;
  }

  getId() {
    return this._data._id;
  }

  isLiked() {
    return Boolean(this._data.isLiked);
  }

  setLikes(updatedCardData) {
    this._data.isLiked = updatedCardData.isLiked;
    this._likeButton.classList.toggle("card__like-button_is-active", this.isLiked());
  }

  removeCard() {
    this._cardElement.remove();
    this._cardElement = null;
  }

  getCardElement() {
    this._cardElement = cardTemplate.content.cloneNode(true).querySelector(".card");
    this._cardImage = this._cardElement.querySelector(".card__image");
    this._cardTitle = this._cardElement.querySelector(".card__title");
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(".card__delete-button");

    this._cardImage.src = this._data.link || "./images/placeholder.jpg";
    this._cardImage.alt = this._data.name || "Lugar sem nome";
    this._cardTitle.textContent = this._data.name || "Lugar sem nome";
    this._likeButton.classList.toggle("card__like-button_is-active", this.isLiked());

    if (!this._isOwner()) {
      this._deleteButton.remove();
    }

    this._setEventListeners();
    return this._cardElement;
  }

  _isOwner() {
    const ownerId = typeof this._data.owner === "object" ? this._data.owner?._id : this._data.owner;
    return ownerId === this._userId;
  }

  _setEventListeners() {
    this._cardImage.addEventListener("click", () => {
      this._handleCardClick({ name: this._data.name, link: this._data.link });
    });

    this._likeButton.addEventListener("click", () => {
      this._handleLikeClick(this);
    });

    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        this._handleDeleteClick(this);
      });
    }
  }
}