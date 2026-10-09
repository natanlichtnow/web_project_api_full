import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import api from "./utils/api";
import { login as loginAPI, register as registerAPI } from "./utils/auth.js";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import AppLayout from "./components/AppLayout.jsx";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [popup, setPopup] = useState(null);

  const token = localStorage.getItem("jwt");

  const handleLogin = (email, password) => {
    loginAPI(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          setLoggedIn(true);
          
          // Fetch user info and cards immediately after login
          api.getUserInfo()
            .then((data) => {
              setCurrentUser(data);
            })
            .catch(console.error);
          
          api.getInitialCards()
            .then(setCards)
            .catch(console.error);
          
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Erro ao fazer login:", err);
        alert("Erro ao fazer login. Verifique suas credenciais.");
      });
  };

  const handleRegister = (email, password) => {
    registerAPI(email, password)
      .then(() => {
        alert("Registro realizado com sucesso! Faça login agora.");
        navigate("/signin");
      })
      .catch((err) => {
        console.error("Erro ao registrar:", err);
        alert("Erro ao registrar. O e-mail pode já estar em uso.");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setCurrentUser(null);
    setCards([]);
    navigate("/signin");
  };

  const handleOpenPopup = (popupData) => {
    setPopup(popupData);
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  const handleCardLike = (card) => {
    // Get fresh card from state instead of using stale object from props
    const freshCard = cards.find(c => c._id === card._id);
    if (!freshCard) return;
    
    const isLiked = Array.isArray(freshCard.likes) && currentUser 
      ? freshCard.likes.some(u => {
          const userId = typeof u === 'string' ? u : u._id;
          return userId === currentUser._id;
        })
      : false;
    
    console.log('Liking card:', freshCard._id, 'Currently liked:', isLiked, 'Adding like:', !isLiked);
    
    api.changeLikeCardStatus(freshCard._id, !isLiked)
      .then((updatedCard) => {
        console.log('Like response:', updatedCard);
        setCards(cards.map(c => c._id === freshCard._id ? updatedCard : c));
      })
      .catch((err) => {
        console.error('Like error:', err);
        alert('Erro ao curtir cartão: ' + err);
      });
  };

  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
      .then(() => {
        setCards(cards.filter(c => c._id !== card._id));
      })
      .catch(console.error);
  };

  const handleAddCard = ({ name, link }) => {
    api.addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        handleClosePopup();
      })
      .catch(console.error);
  };

  const handleUpdateProfile = ({ name, about }) => {
    api.updateUserInfo({ name, about })
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        handleClosePopup();
      })
      .catch(console.error);
  };

  const handleUpdateAvatar = ({ avatar }) => {
    api.updateAvatar({ avatar })
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        handleClosePopup();
      })
      .catch(console.error);
  };

  // login automático via token
  useEffect(() => {
    if (!token) return;

    api.getUserInfo()
      .then((data) => {
        setCurrentUser(data);
        setLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
      });
  }, [token]);

  // cards só depois do login
  useEffect(() => {
    if (!loggedIn) return;

    api.getInitialCards()
      .then(setCards)
      .catch(console.error);
  }, [loggedIn]);

  return (
    <Routes>
      <Route
        path="/signin"
        element={
          loggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
        }
      />

      <Route
        path="/signup"
        element={
          loggedIn ? <Navigate to="/" /> : <Register onRegister={handleRegister} />
        }
      />

      <Route
        path="/"
        element={
          loggedIn ? (
            <AppLayout
              currentUser={currentUser}
              cards={cards}
              setCards={setCards}
              onLogout={handleLogout}
              popup={popup}
              onOpenPopup={handleOpenPopup}
              onClosePopup={handleClosePopup}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              onAddCard={handleAddCard}
              onUpdateProfile={handleUpdateProfile}
              onUpdateAvatar={handleUpdateAvatar}
            />
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
    </Routes>
  );
}

export default App;