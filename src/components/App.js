import React, { useState, useEffect, createRef } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../components/Login";
import Register from "../components/Register";
import InfoTooltip from "../components/InfoTooltip";
import vector_error_icon from "../images/vector_icon_error.png";
import vector_correct_icon from "../images/vector_icon_correct.png";
import ReactLoading from "react-loading";
import * as auth from "../utils/auth";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  //useState
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadCards, setIsLoadCards] = useState(false);
  const [cards, setCards] = useState([]);

  //metodos para iniciar o cerrar la sesión

  const isLogginTrue = () => {
    setIsLoggedIn(true);
  };

  const isLoginFalse = () => {
    setIsLoggedIn(false);
  };

  //metodos para abrir o cerrar modal success
  const openErrorModal = () => {
    setIsErrorModalOpen(true);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  //metodos para abrir o cerrar modal fail
  const openCorrectModal = () => {
    setIsCorrectModalOpen(true);
  };

  const closeCorrectModal = () => {
    setIsCorrectModalOpen(false);
  };

  const tokenCheck = async () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            isLogginTrue();
            navigate("/main");
            setEmail(res.data.email);
            setIsLoadingPage(true);
          }
        })
        .catch((err) => {
          console.error("Error al obtener el token: " + err);
        });
    } else {
      setIsLoadingPage(true);
    }
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await api.get("users/me");
      setCurrentUser(user);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCurrentUser();
    }
  }, [isLoggedIn]);

  const fetchCards = async () => {
    try {
      const result = await api.get("cards");
      setCards(result);
      setIsLoadCards(true);
    } catch (error) {
      console.error("Error al obtener las cards: ", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCards();
    }
  }, [isLoggedIn, cards]);

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setEmail("");
    isLoginFalse();
  };

  const handleFormEditSubmit = async (name, occupation) => {
    try {
      return await api.patch("users/me", {
        name: name,
        about: occupation,
      });
    } catch (error) {
      console.error("Error al actualizar los datos del usuario: ", error);
      throw error;
    }
  };

  const handleFormCreateCardSubmit = async (name, imageUrl) => {
    try {
      const result = await api.post("cards", {
        name: name,
        link: imageUrl,
      });
      setCards((prevCard) => [result, ...prevCard]);
    } catch (error) {
      console.error("Error al crear la card: ", error);
      throw error;
    }
  };

  const handleFormEditAvatarSubmit = async (url) => {
    try {
      return await api.patch("users/me/avatar", {
        avatar: url,
      });
    } catch (error) {
      console.error(
        "Error al actualizar la foto de perfil del usuario: ",
        error
      );
      throw error;
    }
  };

  const handleCardDelete = async (cardId) => {
    try {
      await api.delete(`cards/${cardId}`);
      setCards((prevCard) =>
        prevCard.filter((cardItem) => cardItem.id !== cardId)
      );
    } catch (error) {
      console.error("Error al eliminar la tarjeta del usuario: ", error);
      throw error;
    }
  };

  const handleLikeCard = async (idCard) => {
    try {
      return await api.put(`cards/likes/${idCard}`);
    } catch (error) {
      console.error("Error al dar like a la tarjeta: ", error);
      throw error;
    }
  };

  const handleDislikeCard = async (idCard) => {
    try {
      return await api.delete(`cards/likes/${idCard}`);
    } catch (error) {
      console.error("Error al dar dislike a la tarjeta: ", error);
      throw error;
    }
  };

  const routes = [
    {
      path: "/login",
      name: "Login",
      element: (
        <Login
          navigate={navigate}
          logginTrue={isLogginTrue}
          openModalError={openErrorModal}
          setEmailUser={setEmail}
        />
      ),
      nodeRef: createRef(),
    },
    {
      path: "/register",
      name: "Register",
      element: (
        <Register
          navigate={navigate}
          openModalError={openErrorModal}
          openCorrectModal={openCorrectModal}
        />
      ),
      nodeRef: createRef(),
    },
    {
      path: "/main",
      name: "Main",
      element: (
        <ProtectedRoute
          loggedIn={isLoggedIn}
          component={Main}
          onEditProfile={handleFormEditSubmit}
          onEditAvatar={handleFormEditAvatarSubmit}
          onAddPlace={handleFormCreateCardSubmit}
          onDeleteCard={handleCardDelete}
          onLikeCard={handleLikeCard}
          onDisLikeCard={handleDislikeCard}
          isLoadCards={isLoadCards}
          cards={cards}
        />
      ),
      nodeRef: createRef(),
    },
  ];

  const { nodeRef } =
    routes.find((route) => route.path === location.pathname) ?? {};

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          isLoggin={isLoggedIn}
          isSingOut={handleSignOut}
          navigate={navigate}
          email={email}
        />
        <InfoTooltip isOpen={isErrorModalOpen} onClose={closeErrorModal}>
          <img className="modal__icon" src={vector_error_icon}></img>
          <h2 className="modal__title modal__title_aling-self-center">
            Uy, algo salió mal. Por favor, inténtalo de nuevo.
          </h2>
        </InfoTooltip>
        <InfoTooltip isOpen={isCorrectModalOpen} onClose={closeCorrectModal}>
          <img className="modal__icon" src={vector_correct_icon}></img>
          <h2 className="modal__title modal__title_aling-self-center">
            ¡Correcto! Ya estás registrado.
          </h2>
        </InfoTooltip>
        {isLoadingPage ? (
          <SwitchTransition>
            <CSSTransition
              key={location.pathname}
              nodeRef={nodeRef}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <div ref={nodeRef}>
                <Routes location={location}>
                  {routes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ))}
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </div>
            </CSSTransition>
          </SwitchTransition>
        ) : (
          <div className="loading-page">
            <ReactLoading type={"bubbles"} color="#f4f4f4" />
          </div>
        )}
        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
