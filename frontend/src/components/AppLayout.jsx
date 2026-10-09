import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import CurrentUserContext from "../contexts/CurrentUserContext";

function AppLayout({
  currentUser,
  cards,
  onLogout,
  popup,
  onOpenPopup,
  onClosePopup,
  onCardLike,
  onCardDelete,
  onAddCard,
  onUpdateProfile,
  onUpdateAvatar
}) {
  return (
    <CurrentUserContext.Provider value={{ 
      currentUser, 
      handleUpdateUser: onUpdateProfile,
      handleUpdateAvatar: onUpdateAvatar 
    }}>
      <div className="page__content">
        <Header onLogout={onLogout} />
        <Main
          cards={cards}
          currentUser={currentUser}
          popup={popup}
          onOpenPopup={onOpenPopup}
          onClosePopup={onClosePopup}
          onCardLike={onCardLike}
          onCardDelete={onCardDelete}
          onAddPlaceSubmit={onAddCard}
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  )
}

export default AppLayout
