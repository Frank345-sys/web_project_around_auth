import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
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
import ReactLoading from "react-loading";
import * as auth from "../utils/auth";

function App() {
  const navigate = useNavigate();

  const location = useLocation();

  //useState
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isModalOpenInfoTooltip, setIsModalOpenInfoTooltip] = useState(false);
  const [isMessageInfoTooltip, setIsMessageInfoTooltip] = useState("");
  const [isIconInfoTooltip, setIsIconInfoTooltip] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadCards, setIsLoadCards] = useState(false);
  const [deletedCard, setDeletedCard] = useState(false);
  const [cards, setCards] = useState([]);

  //metodos para iniciar o cerrar la sesión
  const isLogginTrue = useCallback(() => setIsLoggedIn(true), []);
  const isLoginFalse = useCallback(() => setIsLoggedIn(false), []);

  //manejo de modales
  //metodos para abrir o cerrar modal success
  const openModalInfoTooltip = useCallback((message, icon) => {
    setIsMessageInfoTooltip(message);
    setIsIconInfoTooltip(icon);
    setIsModalOpenInfoTooltip(true);
  }, []);

  const closeModalInfoTooltip = useCallback(
    () => setIsModalOpenInfoTooltip(false),
    []
  );

  //useRefs
  const contentRoutesRef = useRef(null);

  /* ////////////////////// check Token ////////////////////// */

  const tokenCheck = useRef(async () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            isLogginTrue();
            navigate("/web_project_around_auth/main");
            setEmail(res.data.email);
          }
        })
        .catch((err) => {
          //openErrorModal();
          openModalInfoTooltip(
            "Uy, algo salió mal. La aplicación esta fuera de servicio temporalmente.",
            vector_error_icon
          );
          //console.error("Error al obtener el token: " + err);
        })
        .finally(() => {
          setIsLoadingPage(true);
        });
    }
  });

  useLayoutEffect(() => {
    tokenCheck.current();
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
  }, [isLoggedIn, fetchCurrentUser]);

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
  }, [isLoggedIn, deletedCard, fetchCards]);

  /* ////////////////////// fetch Cards ////////////////////// */

  /* ///////////////////// Cerrar sesión ///////////////////// */
  const handleSignOut = useCallback(() => {
    localStorage.removeItem("jwt");
    setEmail("");
    isLoginFalse();
  }, [isLoginFalse]);

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
          isOpen={isModalOpenInfoTooltip}
          onClose={closeModalInfoTooltip}
          src={isIconInfoTooltip}
          title={isMessageInfoTooltip}
        ></InfoTooltip>

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
                    path="/web_project_around_auth/login"
                    element={
                      <Login
                        navigate={navigate}
                        logginTrue={isLogginTrue}
                        openModalInfoTooltip={openModalInfoTooltip}
                        setEmailUser={setEmail}
                      />
                    }
                  />
                  <Route
                    path="/web_project_around_auth/register"
                    element={
                      <Register
                        navigate={navigate}
                        openModalInfoTooltip={openModalInfoTooltip}
                      />
                    }
                  />
                  <Route
                    path="/web_project_around_auth/main"
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
                        openModalInfoTooltip={openModalInfoTooltip}
                        isLoadCards={isLoadCards}
                        cards={cards}
                      ></ProtectedRoute>
                    }
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/web_project_around_auth/login" />}
                  />
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
