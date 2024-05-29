import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import vector_edit_icon from "../images/editar.png";
import vector_add_icon from "../images/vector_add_icon.png";
import transparent from "../images/transparent.png";
import EditProfilePopup from "../components/EditProfilePopup";
import AddPlacePopup from "../components/AddPlacePopup";
import EditAvatarPopup from "../components/EditAvatarPopup";
import ImagePopup from "../components/ImagePopup";
import InfoTooltip from "../components/InfoTooltip";
import Card from "../components/Card";
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
  openModalError,
  isLoadCards,
  cards,
}) {
  //useRefs
  const nameRef = useRef(null);
  const aboutRef = useRef(null);
  const avatarRef = useRef(null);
  const statusRef = useRef(null);

  //user values
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState("");

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

  //Se cargan los datos de currentUser
  useEffect(() => {
    if (currentUser && currentUser) {
      setName(currentUser.name);
      setAbout(currentUser.about);
      setAvatar(currentUser.avatar);
      setIsLoadInfoUser(true);
    }
  }, [currentUser]);

  // LoadPageInfoUser
  const [isLoadInfoUser, setIsLoadInfoUser] = useState(false);

  // idCard
  const [isIdCard, setIsIdCard] = useState("");

  // card values
  const [isNameCard, setIsNameCard] = useState("");
  const [isLinkCard, setIsLinkCard] = useState("");

  // modales
  const [modalState, setModalState] = useState({
    editProfileModal: false,
    createCardModal: false,
    editAvatarModal: false,
    deleteCardModal: false,
    popUpImage: false,
  });

  const openModal = useCallback((modalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: false }));
  }, []);

  const openModalDeleteCard = useCallback((idCard) => {
    openModal("deleteCardModal");
    setIsIdCard(idCard);
  }, []);

  const closeModalDeleteCard = useCallback(() => {
    closeModal("deleteCardModal");
    setIsIdCard("");
  }, []);

  // status button deleteCardModal
  const [status, setStatus] = useState(false);

  const handleConfirmDeleteSubmit = useCallback(async () => {
    setStatus(true);
    try {
      await onDeleteCard(isIdCard);
      setStatus(false);
      closeModalDeleteCard();
    } catch (error) {
      closeModalDeleteCard();
      openModalError();
      setStatus(false);
    }
  }, [isIdCard]);

  const openPopUpImage = useCallback((name, link) => {
    setIsNameCard(name);
    setIsLinkCard(link);
    openModal("popUpImage");
  }, []);

  return (
    <>
      <EditProfilePopup
        nameUser={name}
        onNameUser={setNewName}
        aboutUser={about}
        onAboutUser={setNewAbout}
        isOpen={modalState.editProfileModal}
        onClose={() => closeModal("editProfileModal")}
        openModalError={openModalError}
        formEditSubmit={onEditProfile}
      ></EditProfilePopup>

      <AddPlacePopup
        isOpen={modalState.createCardModal}
        onClose={() => closeModal("createCardModal")}
        openModalError={openModalError}
        formAddSubmit={onAddPlace}
      ></AddPlacePopup>

      <EditAvatarPopup
        onAvatarUser={setNewAvatar}
        isOpen={modalState.editAvatarModal}
        onClose={() => closeModal("editAvatarModal")}
        openModalError={openModalError}
        formEditAvatarSubmit={onEditAvatar}
      ></EditAvatarPopup>

      <ImagePopup
        isOpen={modalState.popUpImage}
        onClose={() => closeModal("popUpImage")}
        nameCard={isNameCard}
        imageUrlCard={isLinkCard}
      ></ImagePopup>

      <InfoTooltip
        isOpen={modalState.deleteCardModal}
        onClose={() => closeModal("deleteCardModal")}
      >
        <h2 className="modal__title">¿Estás segudo/a?</h2>
        <form
          className="modal-form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirmDeleteSubmit();
          }}
        >
          <fieldset className="modal-form__set">
            <button className="button button_delete-card" type="submit">
              <SwitchTransition>
                <CSSTransition
                  key={status}
                  nodeRef={statusRef}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div ref={statusRef}>
                    {status ? "Eliminando..." : "Elimiar"}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            </button>
          </fieldset>
        </form>
      </InfoTooltip>

      <main className="content">
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
                        isLoadInfoUser ? "mi foto de perfil " + name : ""
                      }`}
                      src={isLoadInfoUser ? avatar : transparent}
                      className="profile-image__image"
                    />

                    <div
                      className="profile-image__edit-icon"
                      onClick={() => openModal("editAvatarModal")}
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
                  onClick={() => openModal("editProfileModal")}
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
              onClick={() => openModal("createCardModal")}
            >
              <img alt="icono agregar" src={vector_add_icon} />
            </button>
          </div>
        </section>
        <section className="photos-grid">
          {currentUser && currentUser && isLoadCards ? (
            <div className={`content-photos`}>
              {cards.map((item) => (
                <Card
                  key={item._id}
                  name={item.name}
                  link={item.link}
                  idCard={item._id}
                  likes={item.likes}
                  user={item.owner}
                  onLike={onLikeCard}
                  onDisLike={onDisLikeCard}
                  onOpenPopUpImage={openPopUpImage}
                  onOpenModalDeleteCard={openModalDeleteCard}
                ></Card>
              ))}
            </div>
          ) : (
            <div className="loading-page">
              <ReactLoading type={"bars"} color="#f4f4f4" />
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Main;
