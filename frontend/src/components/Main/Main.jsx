import { useContext } from "react";
import avatar from "../../images/avatar.jpg";
import Popup from "./components/Popup/Popup";
import NewCard from "./components/Popup/components/NewCard/NewCard";
import EditProfile from "./components/Popup/components/EditProfile/EditProfile";
import EditAvatar from "./components/Popup/components/EditAvatar/EditAvatar";
import Card from "./components/Card/Card";
import CurrentUserContext from "../../contexts/CurrentUserContext";

// cards state will be populated from the API

function Main(props) {
  const { cards = [], onCardLike, onCardDelete, onAddPlaceSubmit } = props || {};
  const { currentUser } = useContext(CurrentUserContext);
  const { onOpenPopup, onClosePopup, popup } = props || {};

  const newCardPopup = { title: "New card", children: <NewCard onAddPlaceSubmit={onAddPlaceSubmit} /> };
  const editProfilePopup = { title: "Edit profile", children: <EditProfile /> };
  const editAvatarPopup = { title: "Change avatar", children: <EditAvatar /> };

  function handleOpenPopup(p) {
    if (onOpenPopup) onOpenPopup(p);
  }
 
  function handleClosePopup() {
    if (onClosePopup) onClosePopup();
  }
  
  function handleCardLike(card) {
    if (onCardLike) onCardLike(card);
  }

  function handleCardDelete(card) {
    if (onCardDelete) onCardDelete(card);
  }
  return (
    <main className="content">
      <section className="profile page__section">
        <div className="profile__avatar-container">
          <img className="profile__image" src={currentUser && currentUser.avatar ? currentUser.avatar : avatar} alt="Avatar" />
          <button
            aria-label="Editar foto de perfil"
            className="profile__avatar-edit-button"
            type="button"
            onClick={() => handleOpenPopup(editAvatarPopup)}
          ></button>
        </div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser ? currentUser.name : "Carregando..."}</h1>
          <button
            aria-label="Editar perfil"
            className="profile__edit-button"
            type="button"
            onClick={() => handleOpenPopup(editProfilePopup)}
          ></button>
          <p className="profile__description">{currentUser ? currentUser.about : ""}</p>
        </div>
        <button
          aria-label="Adicionar cartão"
          className="profile__add-button"
          type="button"
          onClick={() => handleOpenPopup(newCardPopup)}
        ></button>
      </section>
      <section className="cards page__section">
        <ul className="cards__list">
          {cards.map((card) => (
            <Card key={card._id} card={card} onCardClick={handleOpenPopup} onCardDelete={handleCardDelete} onCardLike={handleCardLike} onClosePopup={handleClosePopup} />
          ))}
        </ul>
      </section>
      {popup && (
        <Popup onClose={handleClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}

export default Main;