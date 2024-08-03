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
  isLoadCards,
  cards,
}) {
  //useRefs
  const nameRef = useRef(null);
  const aboutRef = useRef(null);
  const avatarRef = useRef(null);

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
