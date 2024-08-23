import React, { useState, useContext, memo } from "react";
import vector_delete_icon from "../images/vector_delete_icon.png";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import vector_error_icon from "../images/vector_icon_error.png";

const Card = memo(
  ({
    name,
    link,
    idCard,
    likes,
    user,
    date,
    onLike,
    onDisLike,
    onOpenPopUpImage,
    onOpenModalDeleteCard = () => {},
    openModalInfoTooltip,
    isCardAdded,
    onViewProfile = () => {},
    tooltipMs,
  }) => {
    //context
    const currentUser = useContext(CurrentUserContext);
    /*
    const [isLiked, setIsLiked] = useState(
      likes.some((element) => element._id === currentUser._id)
    );
    */
    const dateCard = new Date(date);

    const formattedDate = dateCard.toLocaleDateString("es-ES");

    const [isLiked, setIsLiked] = useState(likes.includes(currentUser._id));

    const [countLikes, setCountLikes] = useState(likes.length);

    const handleOpenPopUpImageClick = () => {
      onOpenPopUpImage(name, link);
    };

    const handleOpenModalDeleteCard = () => {
      onOpenModalDeleteCard(idCard);
    };

    const handleLikeClick = async () => {
      if (isLiked) {
        try {
          const result = await onDisLike(idCard);
          setCountLikes(result.length);
          setIsLiked(!isLiked);
        } catch (error) {
          if (error.message.includes("Failed to fetch")) {
            openModalInfoTooltip(
              "¡Uy!, falló en la conexión con el servidor. Serás redirigido.",
              vector_error_icon
            );
            //navigate("/login");
          } else {
            openModalInfoTooltip(
              "¡Uy!, algo salió mal. Error al dar Dislike a la tarjeta.",
              vector_error_icon
            );
          }
        }
      } else {
        try {
          const result = await onLike(idCard);
          setCountLikes(result.length);
          setIsLiked(!isLiked);
        } catch (error) {
          if (error.message.includes("Failed to fetch")) {
            openModalInfoTooltip(
              "¡Uy!, falló en la conexión con el servidor. Serás redirigido.",
              vector_error_icon
            );
            //navigate("/login");
          } else {
            openModalInfoTooltip(
              "¡Uy!, algo salió mal. Error al dar like a la tarjeta.",
              vector_error_icon
            );
          }
        }
      }
    };

    return (
      <>
        <article
          className={`card ${isCardAdded ? "card-added" : ""} ${
            currentUser._id === user._id ? "card_border" : ""
          }`}
        >
          <button
            type="button"
            className={`card__button-delete ${
              currentUser._id === user._id
                ? ""
                : "card__button-delete_visibility_visible"
            }`}
            onClick={handleOpenModalDeleteCard}
          >
            <img alt="icono borrar" src={vector_delete_icon} />
          </button>
          <p className="card__date">{formattedDate}</p>
          <button
            className="card__photo-item-user"
            disabled={currentUser._id === user._id}
            onClick={() => onViewProfile(user)}
          >
            <img
              alt={"Imagen ilustrativa del usuario " + user.name}
              src={user.avatar}
            />
          </button>
          <div class="card__tooltip">
            <span>{currentUser._id === user._id ? "Tú" : tooltipMs}</span>
          </div>

          <div className="card__photo-item">
            <img
              alt={"Imagen ilustrativa de " + name}
              src={link}
              onClick={handleOpenPopUpImageClick}
            />
          </div>
          <div className="content-footer-card">
            <h2 className="content-footer-card__title">{name}</h2>
            <div className="content-footer-card__content-button">
              <button
                type="button"
                className="heart-button"
                onClick={handleLikeClick}
              >
                <span
                  className={`heart-button__icon ${
                    isLiked ? "heart-button__icon_liked" : ""
                  }`}
                >
                  ❤️
                </span>
              </button>
              <span className="heart-button__likes">{countLikes}</span>
            </div>
          </div>
        </article>
      </>
    );
  }
);

export default Card;
