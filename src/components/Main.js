import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import vector_edit_icon from "../images/editar.png";
import vector_add_icon from "../images/vector_add_icon.png";
import arrow_return from "../images/arrow_return.png";
import vector_error_icon from "../images/vector_icon_error.png";
import transparent from "../images/transparent.png";
import EditProfilePopup from "../components/EditProfilePopup";
import AddPlacePopup from "../components/AddPlacePopup";
import EditAvatarPopup from "../components/EditAvatarPopup";
import ImagePopup from "../components/ImagePopup";
import Card from "../components/Card";
import ConfirmDeleteCardPopup from "../components/ConfirmDeleteCardPopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ReactLoading from "react-loading";
import { CSSTransition, SwitchTransition } from "react-transition-group";

function Main({
  onEditProfile,
  onEditAvatar,
  onAddPlace,
  onDeleteCard,
  onLikeCard,
  onDisLikeCard,
  openModalInfoTooltip,
  onSwitchCards,
  switchCards,
  isLoadAllCards,
  allCards,
  isLoadMyCards,
  myCards,
  isCardAdded,
  onFetchUserCards,
  onMyProfile,
  isMyProfile,
  userCards,
  isLoadUserCards,
}) {
  //useRefs
  const nameRef = useRef(null);
  const aboutRef = useRef(null);
  const avatarRef = useRef(null);
  const containerRef = useRef(null);
  const containerMain = useRef(null);

  //my profile values
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState("");

  //view user profile
  const [visitedUserData, setVisitedUserData] = useState("");
  const [isVisitedUserProfile, setIsVisitedUserProfile] = useState(false);

  const setNewName = useCallback((newName) => {
    setName(newName);
  }, []);

  const setNewAbout = useCallback((newAbout) => {
    setAbout(newAbout);
  }, []);

  const setNewAvatar = useCallback((newAvatar) => {
    setAvatar(newAvatar);
  }, []);

  //context
  const currentUser = useContext(CurrentUserContext);

  // LoadPageInfoUser
  const [isLoadInfoUser, setIsLoadInfoUser] = useState(false);

  //Se cargan los datos de currentUser
  useEffect(() => {
    if (currentUser && currentUser) {
      setName(currentUser.name);
      setAbout(currentUser.about);
      setAvatar(currentUser.avatar);
      setIsLoadInfoUser(true);
    }
  }, [currentUser]);

  // card values
  const [isNameCard, setIsNameCard] = useState("");
  const [isLinkCard, setIsLinkCard] = useState("");
  const [isIdCard, setIsIdCard] = useState("");

  //Metodos para abrir o cerrar modal createCard
  const [isCreateCardModal, setIsCreateCardModal] = useState(false);

  const openModalCreateCard = useCallback(() => {
    setIsCreateCardModal(true);
  }, []);

  const closeModalCreateCard = useCallback(() => {
    setIsCreateCardModal(false);
  }, []);

  //Metodos para abrir o cerrar editProfile
  const [isEditProfileModal, setIsEditProfileModal] = useState(false);

  const openModalEditProfile = useCallback(() => {
    setIsEditProfileModal(true);
  }, []);

  const closeModalEditProfile = useCallback(() => {
    setIsEditProfileModal(false);
  }, []);

  //Metodos para abrir o cerrar editAvatar
  const [isEditAvatarModal, setIsEditAvatarModal] = useState(false);

  const openModalEditAvatar = useCallback(() => {
    setIsEditAvatarModal(true);
  }, []);

  const closeModalEditAvatar = useCallback(() => {
    setIsEditAvatarModal(false);
  }, []);

  //Metodos para abrir o cerrar deleteCard
  const [isDeleteCardModal, setIsDeleteCardModal] = useState(false);

  const openModalDeleteCard = useCallback((idCard) => {
    setIsDeleteCardModal(true);
    setIsIdCard(idCard);
  }, []);

  const closeModalDeleteCard = useCallback(() => {
    setIsDeleteCardModal(false);
    setIsIdCard("");
  }, []);

  //Metodos para abrir o cerrar popUpImage
  const [isPopupImage, setIsPopupImage] = useState(false);

  const openPopUpImage = useCallback((name, link) => {
    setIsNameCard(name);
    setIsLinkCard(link);
    setIsPopupImage(true);
  }, []);

  const closePopUpImage = useCallback(() => {
    setIsPopupImage(false);
  }, []);

  useEffect(() => {
    let scrollTimeout;

    const viewProfile = async () => {
      try {
        onMyProfile(false);
        await onFetchUserCards(visitedUserData._id);
      } catch (error) {
        if (error.message.includes("Failed to fetch")) {
          openModalInfoTooltip(
            "¡Uy!, falló en la conexión con el servidor.",
            vector_error_icon
          );
        } else {
          openModalInfoTooltip(
            "¡Uy!, error al obtener las cards del usuario visitado.",
            vector_error_icon
          );
        }
        onMyProfile(true);
        setVisitedUserData("");
      } finally {
        setIsVisitedUserProfile(false);
      }
    };

    const handleScroll = () => {
      //si el scroll se mueve se limpia el setTimeout para que no se ejecute
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      // si el scroll se detiene se ejecuta el setTimeout
      scrollTimeout = setTimeout(() => {
        viewProfile();
        //aparece los datos del perfil visitado de forma suave
      }, 150); // Tiempo de espera para detectar cuando el scroll se detiene
    };

    if (isVisitedUserProfile) {
      const doSomethingAfterDelay = async () => {
        // función que comprueba si el scroll ya está al principio de la página
        const checkIfAtTop = async () => {
          if (window.scrollY === 0) {
            // aparece el perfil del usuario visitado de forma suave
            viewProfile();
            //se sale de la función
            return true; // Retorna verdadero si el scroll ya está en el inicio
          }
          return false; // Retorna falso si no está al inicio de la página y continua con la ejecución
        };

        // Se ejecuta la función para comprobar la posición del scroll
        const isTop = await checkIfAtTop();

        // Solo se agrega el evento handleScroll si el scroll no está al inicio de la página
        if (!isTop) {
          // se agrega el evento handleScroll para detectar cuando sube el scroll
          window.addEventListener("scroll", handleScroll);
          // se moverá el scroll automaticamente al inicio de la página
          window.scrollTo({
            top: 0,
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
  }, [
    isVisitedUserProfile,
    onFetchUserCards,
    onMyProfile,
    openModalInfoTooltip,
    visitedUserData._id,
  ]);

  const handleViewProfile = useCallback((user) => {
    setVisitedUserData(user);
    setIsVisitedUserProfile(true);
  }, []);

  const handleReturnProfile = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    onMyProfile(true);
    setVisitedUserData("");
  }, [onMyProfile]);

  return (
    <>
      <EditProfilePopup
        nameUser={name}
        onNameUser={setNewName}
        aboutUser={about}
        onAboutUser={setNewAbout}
        isOpen={isEditProfileModal}
        onClose={closeModalEditProfile}
        openModalInfoTooltip={openModalInfoTooltip}
        formEditSubmit={onEditProfile}
      ></EditProfilePopup>

      <AddPlacePopup
        isOpen={isCreateCardModal}
        onClose={closeModalCreateCard}
        openModalInfoTooltip={openModalInfoTooltip}
        formAddSubmit={onAddPlace}
      ></AddPlacePopup>

      <EditAvatarPopup
        onAvatarUser={setNewAvatar}
        isOpen={isEditAvatarModal}
        onClose={closeModalEditAvatar}
        openModalInfoTooltip={openModalInfoTooltip}
        formEditAvatarSubmit={onEditAvatar}
      ></EditAvatarPopup>

      <ImagePopup
        isOpen={isPopupImage}
        onClose={closePopUpImage}
        nameCard={isNameCard}
        imageUrlCard={isLinkCard}
      ></ImagePopup>

      <ConfirmDeleteCardPopup
        isOpen={isDeleteCardModal}
        onClose={closeModalDeleteCard}
        idCard={isIdCard}
        onDeleteCard={onDeleteCard}
        openModalInfoTooltip={openModalInfoTooltip}
      ></ConfirmDeleteCardPopup>

      <SwitchTransition>
        <CSSTransition
          key={isMyProfile}
          nodeRef={containerMain}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <main className="main" ref={containerMain}>
            {isMyProfile ? (
              <div className="content-main">
                <section className="profile">
                  <div className="content-profile">
                    <div className="profile-info">
                      <SwitchTransition>
                        <CSSTransition
                          key={avatar}
                          nodeRef={avatarRef}
                          timeout={300}
                          classNames="fade"
                          unmountOnExit
                        >
                          <div
                            ref={avatarRef}
                            className={`profile-image ${
                              isLoadInfoUser ? "" : "shimmer"
                            }`}
                          >
                            <img
                              alt={`${
                                isLoadInfoUser
                                  ? "mi foto de perfil " + name
                                  : ""
                              }`}
                              src={isLoadInfoUser ? avatar : transparent}
                              className="profile-image__image"
                            />

                            <div
                              className="profile-image__edit-icon"
                              onClick={openModalEditAvatar}
                            >
                              <img src={vector_edit_icon} alt="Editar" />
                            </div>
                          </div>
                        </CSSTransition>
                      </SwitchTransition>
                      <div className="content-prof-info-text">
                        <SwitchTransition>
                          <CSSTransition
                            key={name}
                            nodeRef={nameRef}
                            timeout={300}
                            classNames="fade"
                            unmountOnExit
                          >
                            <h2
                              ref={nameRef}
                              className={`content-prof-info-text__name ${
                                isLoadInfoUser ? "" : "shimmer"
                              }`}
                            >
                              {name}
                            </h2>
                          </CSSTransition>
                        </SwitchTransition>
                        <button
                          type="button"
                          className="content-prof-info-text__edit-button"
                          onClick={openModalEditProfile}
                        >
                          <img alt="icono editar" src={vector_edit_icon} />
                        </button>
                        <SwitchTransition>
                          <CSSTransition
                            key={about}
                            nodeRef={aboutRef}
                            timeout={300}
                            classNames="fade"
                            unmountOnExit
                          >
                            <h3
                              ref={aboutRef}
                              className={`content-prof-info-text__ocupation ${
                                isLoadInfoUser ? "" : "shimmer"
                              }`}
                            >
                              {about}
                            </h3>
                          </CSSTransition>
                        </SwitchTransition>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="content-profile__add-button"
                      onClick={openModalCreateCard}
                    >
                      <img alt="icono agregar" src={vector_add_icon} />
                    </button>
                  </div>
                  <div className="profile__content-navegate-buttons">
                    <button
                      type="button"
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                        onSwitchCards(false);
                      }}
                      className={`button button_profile ${
                        switchCards ? "" : "button_profile-active"
                      }`}
                    >
                      Todas las tarjetas
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                        onSwitchCards(true);
                      }}
                      className={`button button_profile ${
                        switchCards ? "button_profile-active" : ""
                      }`}
                    >
                      Mis tarjetas
                    </button>
                  </div>
                </section>
                <SwitchTransition>
                  <CSSTransition
                    key={switchCards}
                    nodeRef={containerRef}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                  >
                    <section className="photos-grid" ref={containerRef}>
                      {switchCards ? (
                        currentUser && currentUser && isLoadMyCards ? (
                          myCards.length === 0 ? (
                            <div className="photos-grid__message">
                              Aún no has creado ninguna carta.
                            </div>
                          ) : (
                            <div className={`content-photos`}>
                              {myCards.map((item) => (
                                <Card
                                  key={item._id}
                                  name={item.name}
                                  link={item.link}
                                  idCard={item._id}
                                  likes={item.likes}
                                  user={item.owner}
                                  date={item.createAt}
                                  onLike={onLikeCard}
                                  onDisLike={onDisLikeCard}
                                  onOpenPopUpImage={openPopUpImage}
                                  onOpenModalDeleteCard={openModalDeleteCard}
                                  openModalInfoTooltip={openModalInfoTooltip}
                                  isCardAdded={isCardAdded}
                                  tooltipMs={"Tú"}
                                ></Card>
                              ))}
                            </div>
                          )
                        ) : (
                          <div className="loading-page">
                            <ReactLoading type={"bars"} color="#f4f4f4" />
                          </div>
                        )
                      ) : currentUser && currentUser && isLoadAllCards ? (
                        allCards.length === 0 ? (
                          <div className="photos-grid__message">
                            No existen cartas
                          </div>
                        ) : (
                          <div className={`content-photos`}>
                            {allCards.map((item) => (
                              <Card
                                key={item._id}
                                name={item.name}
                                link={item.link}
                                idCard={item._id}
                                likes={item.likes}
                                user={item.owner}
                                date={item.createAt}
                                onLike={onLikeCard}
                                onDisLike={onDisLikeCard}
                                onOpenPopUpImage={openPopUpImage}
                                onOpenModalDeleteCard={openModalDeleteCard}
                                openModalInfoTooltip={openModalInfoTooltip}
                                isCardAdded={isCardAdded}
                                onViewProfile={handleViewProfile}
                                tooltipMs={"Visitar perfil: " + item.owner.name}
                              ></Card>
                            ))}
                          </div>
                        )
                      ) : (
                        <div className="loading-page">
                          <ReactLoading type={"bars"} color="#f4f4f4" />
                        </div>
                      )}
                    </section>
                  </CSSTransition>
                </SwitchTransition>
              </div>
            ) : (
              <div className="content-main">
                <section className="profile">
                  <div className="content-profile">
                    <div className="profile-info">
                      <div className={`profile-image `}>
                        <img
                          alt={"foto de perfil de " + visitedUserData.name}
                          src={visitedUserData.avatar}
                          className="profile-image__image"
                        />
                      </div>
                      <div className="content-prof-info-text">
                        <h2
                          className={`content-prof-info-text__name content-prof-info-text__name_with-100`}
                        >
                          {visitedUserData.name}
                        </h2>
                        <h3 className={`content-prof-info-text__ocupation`}>
                          {visitedUserData.about}
                        </h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="content-profile__return-button"
                      onClick={handleReturnProfile}
                    >
                      <img alt="boton para regresar" src={arrow_return} />
                    </button>
                  </div>
                  <div className="profile__content-navegate-buttons">
                    <button type="button" className={`button`} disabled>
                      Targetas del usuario.
                    </button>
                  </div>
                </section>
                <section className="photos-grid">
                  {isLoadUserCards ? (
                    userCards.length === 0 ? (
                      <div className="photos-grid__message">
                        El usuario no tiene ninguna carta.
                      </div>
                    ) : (
                      <div className={`content-photos`}>
                        {userCards.map((item) => (
                          <Card
                            key={item._id}
                            name={item.name}
                            link={item.link}
                            idCard={item._id}
                            likes={item.likes}
                            user={item.owner}
                            date={item.createAt}
                            onLike={onLikeCard}
                            onDisLike={onDisLikeCard}
                            onOpenPopUpImage={openPopUpImage}
                            openModalInfoTooltip={openModalInfoTooltip}
                            isCardAdded={isCardAdded}
                            tooltipMs={item.owner.name}
                          ></Card>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="loading-page">
                      <ReactLoading type={"bars"} color="#f4f4f4" />
                    </div>
                  )}
                </section>
              </div>
            )}
          </main>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
}

export default Main;
