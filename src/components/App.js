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

  const [updateCards, setUpdateCards] = useState(false);

  const [switchCards, setSwitchCards] = useState(false);

  const [isMyProfile, setIsMyProfile] = useState(true);

  const [isLoadAllCards, setIsLoadAllCards] = useState(false);
  const [isLoadMyCards, setIsLoadMyCards] = useState(false);
  const [isLoadUserCards, setIsLoadUserCards] = useState(false);
  const [allCards, setAllCards] = useState([]);
  const [myCards, setMyCards] = useState([]);
  const [userCards, setUserCards] = useState([]);

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

  const tokenCheck = useCallback(async () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          if (res) {
            isLogginTrue();
            navigate("/main");
            setEmail(res.email);
          }
        })
        .catch((error) => {
          if (error.message.includes("Failed to fetch")) {
            openModalInfoTooltip(
              "¡Uy!, falló en la conexión con el servidor.",
              vector_error_icon
            );
            navigate("/login");
          } else {
            openModalInfoTooltip(
              "¡Uy!, la sesión expiro, inicia sesión nuevamente.",
              vector_error_icon
            );
          }
        })
        .finally(() => {
          setIsLoadingPage(true);
        });
    } else {
      setIsLoadingPage(true);
    }
  }, [isLogginTrue, navigate, openModalInfoTooltip]);

  useLayoutEffect(() => {
    tokenCheck();
  }, [tokenCheck]);

  /* ////////////////////// check Token ////////////////////// */

  /* ////////////////////// currentUser ////////////////////// */

  const fetchCurrentUser = useCallback(async () => {
    try {
      const result = await api.get("users/me");
      setCurrentUser(result);
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        openModalInfoTooltip(
          "¡Uy!, falló en la conexión con el servidor.",
          vector_error_icon
        );
      } else {
        openModalInfoTooltip(
          "¡Uy!, error al obtener tus datos.",
          vector_error_icon
        );
      }
    }
  }, [openModalInfoTooltip]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCurrentUser();
    } else {
      setCurrentUser(null);
    }
  }, [isLoggedIn, fetchCurrentUser]);

  /* ////////////////////// currentUser ////////////////////// */

  /* ////////////////////// fetch Cards ////////////////////// */

  const fetchAllCards = useCallback(async () => {
    try {
      const result = await api.get("cards");
      setAllCards(result);
      setIsLoadAllCards(true);
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        openModalInfoTooltip(
          "¡Uy!, falló en la conexión con el servidor.",
          vector_error_icon
        );
      } else {
        openModalInfoTooltip(
          "¡Uy!, error al obtener todas las cards de la comunidad.",
          vector_error_icon
        );
      }
    }
  }, [openModalInfoTooltip]);

  const fetchMyCards = useCallback(async () => {
    try {
      const result = await api.get("cards/me");
      setMyCards(result);
      setIsLoadMyCards(true);
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        openModalInfoTooltip(
          "¡Uy!, falló en la conexión con el servidor.",
          vector_error_icon
        );
      } else {
        openModalInfoTooltip(
          "¡Uy!, error al obtener tus cards.",
          vector_error_icon
        );
      }
    }
  }, [openModalInfoTooltip]);

  const fetchUserCards = useCallback(async (idUser) => {
    try {
      setIsLoadAllCards(false);
      const result = await api.get(`cards/user/${idUser}`);
      setUserCards(result);
      setIsLoadUserCards(true);
    } catch (error) {
      throw error; // re-lanza el error para ser capturado en handleViewProfile en Main
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      if (isMyProfile) {
        if (switchCards) {
          setIsLoadAllCards(false);
          fetchMyCards();
        } else {
          setIsLoadUserCards(false);
          setIsLoadMyCards(false);
          fetchAllCards();
        }
      }
    } else {
      setMyCards([""]);
      setIsLoadMyCards(false);
      setAllCards([""]);
      setIsLoadAllCards(false);
      setUserCards([""]);
      setIsLoadUserCards(false);
    }
  }, [
    isLoggedIn,
    updateCards,
    switchCards,
    isMyProfile,
    fetchAllCards,
    fetchMyCards,
  ]);

  /* ////////////////////// fetch Cards ////////////////////// */

  /* ///////////////////// update Page ////////////////////// */

  const [isCardAdded, setIsCardAdded] = useState(false);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      //si el scroll se mueve se limpia el setTimeout para que no se ejecute
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      // si el scroll se detiene se ejecuta el setTimeout
      scrollTimeout = setTimeout(() => {
        //aparece la card despues de 0.3s de forma suave y se remueve el handlescroll
        setIsCardAdded(false);
      }, 150); // Tiempo de espera para detectar cuando el scroll se detiene
    };

    if (isCardAdded) {
      const doSomethingAfterDelay = async () => {
        // cuando se agregue la card se esperará 0.3s de forma sincrónica que es el tiempo que tarda el modal en cerrar
        await wait(300);
        // función que comprueba si el scroll ya está en el fondo de la página
        const checkIfAtBottom = async () => {
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;

          if (scrollTop + windowHeight >= documentHeight - 1) {
            // Espera 0.3 segundos de forma sincrónica
            await wait(150);
            // aparece la card despues de forma suave despues de 0.3s
            setIsCardAdded(false);
            //se sale del useEffect
            return true; // Retorna verdadero si ya está en el fondo
          }
          return false; // Retorna falso si no está en el fondo y continua con la ejecución del useEffect
        };

        // Se ejecuta la función para comprobar la posición del scroll
        const isBottom = await checkIfAtBottom();

        // Solo se agrega el evento handleScroll si no está al fondo
        if (!isBottom) {
          // se agrega el evento handleScroll para detectar cuando baja el scroll
          window.addEventListener("scroll", handleScroll);
          // se moverá el scroll automaticamente al fondo
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        }
      };

      doSomethingAfterDelay();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [isCardAdded]);

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

  /* //////////////////// Editar avatar //////////////////// */
  const handleFormEditAvatarSubmit = useCallback((url) => {
    return api.patch("users/me/avatar", {
      avatar: url,
    });
  }, []);

  /* ////////////////////// Crear Card ////////////////////// */
  const handleFormCreateCardSubmit = useCallback(async (name, imageUrl) => {
    try {
      await api.post("cards", {
        name: name,
        link: imageUrl,
      });
      //actualiza la lista de cards
      setUpdateCards((prev) => !prev);
      //oculta la card agregada recientemente para mostrarla de forma dinamica
      setIsCardAdded(true);
    } catch (error) {
      throw error; // re-lanza el error para ser capturado en handleSubmit en AddPlacePopup
    }
  }, []);

  /* //////////////////// Eliminar card //////////////////// */
  const handleCardDelete = useCallback(async (cardId) => {
    try {
      await api.delete(`cards/${cardId}`);
      setUpdateCards((prev) => !prev);
    } catch (error) {
      throw error; // re-lanza el error para ser capturado en handleConfirmDeleteSubmit en Main
    }
  }, []);

  /* ///////////////////// Like card ////////////////////// */
  const handleLikeCard = useCallback((idCard) => {
    return api.put(`cards/like/${idCard}`);
  }, []);

  /* //////////////////// Dislike card //////////////////// */
  const handleDislikeCard = useCallback((idCard) => {
    return api.delete(`cards/like/${idCard}`);
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
                    path="/login"
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
                    path="/register"
                    element={
                      <Register
                        navigate={navigate}
                        openModalInfoTooltip={openModalInfoTooltip}
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
                        openModalInfoTooltip={openModalInfoTooltip}
                        onSwitchCards={setSwitchCards}
                        switchCards={switchCards}
                        isLoadAllCards={isLoadAllCards}
                        allCards={allCards}
                        isLoadMyCards={isLoadMyCards}
                        myCards={myCards}
                        isCardAdded={isCardAdded}
                        onFetchUserCards={fetchUserCards}
                        onMyProfile={setIsMyProfile}
                        isMyProfile={isMyProfile}
                        userCards={userCards}
                        isLoadUserCards={isLoadUserCards}
                      ></ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </div>
            </CSSTransition>
          </SwitchTransition>
        ) : (
          <div className="loading-page-main">
            <ReactLoading type={"bubbles"} color="#f4f4f4" />
          </div>
        )}
        <Footer isLoggin={isLoggedIn} />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
