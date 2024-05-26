import React, { useState, useEffect, createRef, useRef } from "react";
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
  const [deletedCard, setDeletedCard] = useState(false);
  const [cards, setCards] = useState([]);

  //metodos para iniciar o cerrar la sesión
  const isLogginTrue = () => setIsLoggedIn(true);
  const isLoginFalse = () => setIsLoggedIn(false);

  //metodos para abrir o cerrar modal success
  const openErrorModal = () => setIsErrorModalOpen(true);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  //metodos para abrir o cerrar modal fail
  const openCorrectModal = () => setIsCorrectModalOpen(true);
  const closeCorrectModal = () => setIsCorrectModalOpen(false);

  /* ////////////////////// check Token ////////////////////// */

  const tokenCheck = useRef(async () => {
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
  });

  useEffect(() => {
    tokenCheck.current();
  }, []);

  /* ////////////////////// check Token ////////////////////// */

  /* ////////////////////// currentUser ////////////////////// */

  const fetchCurrentUser = async () => {
    try {
      const result = await api.get("users/me");
      setCurrentUser(result);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCurrentUser();
    } else {
      setCurrentUser(null);
    }
  }, [isLoggedIn]);

  /* ////////////////////// currentUser ////////////////////// */

  /* ////////////////////// fetch Cards ////////////////////// */

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
    } else {
      setCards([]);
      setIsLoadCards(false);
    }
  }, [isLoggedIn, deletedCard]);

  /* ////////////////////// fetch Cards ////////////////////// */

  /* ///////////////////// Cerrar sesión ///////////////////// */
  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setEmail("");
    isLoginFalse();
  };

  /* ///////////////////// Editar Perfil ///////////////////// */
  const handleFormEditProfileSubmit = (name, occupation) => {
    return api.patch("users/me", {
      name: name,
      about: occupation,
    });
  };

  /* ////////////////////// Crear Card ////////////////////// */
  const handleFormCreateCardSubmit = async (name, imageUrl) => {
    try {
      const result = await api.post("cards", {
        name: name,
        link: imageUrl,
      });
      setCards((prevCards) => [result, ...prevCards]);
    } catch (error) {
      throw error; // re-lanza el error para ser capturado en handleSubmit en AddPlacePopup
    }
  };

  /* //////////////////// Editar avatar //////////////////// */
  const handleFormEditAvatarSubmit = (url) => {
    return api.patch("users/me/avatar", {
      avatar: url,
    });
  };

  /* //////////////////// Eliminar card //////////////////// */
  const handleCardDelete = async (cardId) => {
    try {
      await api.delete(`cards/${cardId}`);
      setDeletedCard(!deletedCard);
    } catch (error) {
      throw error; // re-lanza el error para ser capturado en handleConfirmDeleteSubmit en Main
    }
  };

  /* ///////////////////// Like card ////////////////////// */
  const handleLikeCard = (idCard) => {
    return api.put(`cards/likes/${idCard}`);
  };

  /* //////////////////// Dislike card //////////////////// */
  const handleDislikeCard = (idCard) => {
    return api.delete(`cards/likes/${idCard}`);
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
          onEditProfile={handleFormEditProfileSubmit}
          onEditAvatar={handleFormEditAvatarSubmit}
          onAddPlace={handleFormCreateCardSubmit}
          onDeleteCard={handleCardDelete}
          onLikeCard={handleLikeCard}
          onDisLikeCard={handleDislikeCard}
          openModalError={openErrorModal}
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
          <img
            className="modal__icon"
            src={vector_error_icon}
            alt="ilustración fail"
          ></img>
          <h2 className="modal__title modal__title_aling-self-center">
            Uy, algo salió mal. Por favor, inténtalo de nuevo.
          </h2>
        </InfoTooltip>

        {isLoggedIn === false && (
          <InfoTooltip isOpen={isCorrectModalOpen} onClose={closeCorrectModal}>
            <img
              className="modal__icon"
              src={vector_correct_icon}
              alt="ilustración success"
            ></img>
            <h2 className="modal__title modal__title_aling-self-center">
              ¡Correcto! Ya estás registrado.
            </h2>
          </InfoTooltip>
        )}

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
                  <Route path="/" element={<Navigate to="/login" />} />
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
