import React, { useState, useEffect, useCallback, useRef } from "react";
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
import vector_success_icon from "../images/vector_icon_success.png";
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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadCards, setIsLoadCards] = useState(false);
  const [deletedCard, setDeletedCard] = useState(false);
  const [cards, setCards] = useState([]);

  //metodos para iniciar o cerrar la sesión
  const isLogginTrue = useCallback(() => setIsLoggedIn(true), []);
  const isLoginFalse = useCallback(() => setIsLoggedIn(false), []);

  //manejo de modales
  //metodos para abrir o cerrar modal success
  const openErrorModal = useCallback(() => setIsErrorModalOpen(true), []);
  const closeErrorModal = useCallback(() => setIsErrorModalOpen(false), []);

  //metodos para abrir o cerrar modal fail
  const openSuccessModal = useCallback(() => setIsSuccessModalOpen(true), []);
  const closeSuccessModal = useCallback(() => setIsSuccessModalOpen(false), []);

  //useRefs
  const contentRoutesRef = useRef(null);

  /* ////////////////////// check Token ////////////////////// */

  const tokenCheck = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    tokenCheck();
  }, []);

  /* ////////////////////// check Token ////////////////////// */

  /* ////////////////////// currentUser ////////////////////// */

  const fetchCurrentUser = useCallback(async () => {
    try {
      const result = await api.get("users/me");
      setCurrentUser(result);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCurrentUser();
    } else {
      setCurrentUser(null);
    }
  }, [isLoggedIn]);

  /* ////////////////////// currentUser ////////////////////// */

  /* ////////////////////// fetch Cards ////////////////////// */

  const fetchCards = useCallback(async () => {
    try {
      const result = await api.get("cards");
      setCards(result);
      setIsLoadCards(true);
    } catch (error) {
      console.error("Error al obtener las cards: ", error);
    }
  }, []);

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
  const handleSignOut = useCallback(() => {
    localStorage.removeItem("jwt");
    setEmail("");
    isLoginFalse();
  }, []);

  /* ///////////////////// Editar Perfil ///////////////////// */
  const handleFormEditProfileSubmit = useCallback((name, occupation) => {
    return api.patch("users/me", {
      name: name,
      about: occupation,
    });
  }, []);

  /* ////////////////////// Crear Card ////////////////////// */
  const handleFormCreateCardSubmit = useCallback(async (name, imageUrl) => {
    try {
      const result = await api.post("cards", {
        name: name,
        link: imageUrl,
      });
      setCards((prevCards) => [result, ...prevCards]);
    } catch (error) {
      throw error; // re-lanza el error para ser capturado en handleSubmit en AddPlacePopup
    }
  }, []);

  /* //////////////////// Editar avatar //////////////////// */
  const handleFormEditAvatarSubmit = useCallback((url) => {
    return api.patch("users/me/avatar", {
      avatar: url,
    });
  }, []);

  /* //////////////////// Eliminar card //////////////////// */
  const handleCardDelete = useCallback(async (cardId) => {
    try {
      await api.delete(`cards/${cardId}`);
      setDeletedCard((prev) => !prev);
    } catch (error) {
      throw error; // re-lanza el error para ser capturado en handleConfirmDeleteSubmit en Main
    }
  }, []);

  /* ///////////////////// Like card ////////////////////// */
  const handleLikeCard = useCallback((idCard) => {
    return api.put(`cards/likes/${idCard}`);
  }, []);

  /* //////////////////// Dislike card //////////////////// */
  const handleDislikeCard = useCallback((idCard) => {
    return api.delete(`cards/likes/${idCard}`);
  }, []);

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          isLoggin={isLoggedIn}
          isSingOut={handleSignOut}
          navigate={navigate}
          email={email}
        ></Header>

        <InfoTooltip
          isOpen={isErrorModalOpen}
          onClose={closeErrorModal}
          src={vector_error_icon}
          title={"Uy, algo salió mal. Por favor, inténtalo de nuevo."}
        ></InfoTooltip>

        {isLoggedIn === false && (
          <InfoTooltip
            isOpen={isSuccessModalOpen}
            onClose={closeSuccessModal}
            src={vector_success_icon}
            title={"¡Correcto! Ya estás registrado."}
          ></InfoTooltip>
        )}

        {isLoadingPage ? (
          <SwitchTransition>
            <CSSTransition
              key={location.pathname}
              nodeRef={contentRoutesRef}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <div ref={contentRoutesRef}>
                <Routes location={location}>
                  <Route
                    path="/login"
                    element={
                      <Login
                        navigate={navigate}
                        logginTrue={isLogginTrue}
                        openModalError={openErrorModal}
                        setEmailUser={setEmail}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <Register
                        navigate={navigate}
                        openModalError={openErrorModal}
                        openSuccessModal={openSuccessModal}
                      />
                    }
                  />
                  <Route
                    path="/main"
                    element={
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
                      ></ProtectedRoute>
                    }
                  />
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
