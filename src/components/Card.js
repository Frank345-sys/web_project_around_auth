import React, { useState, useContext, memo } from "react";
import vector_delete_icon from "../images/vector_delete_icon.png";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const Card = memo(
  ({
    name,
    link,
    idCard,
    likes,
    user,
    onLike,
    onDisLike,
    onOpenPopUpImage,
    onOpenModalDeleteCard,
  }) => {
    //context
    const currentUser = useContext(CurrentUserContext);

    const [isLiked, setIsLiked] = useState(
      likes.some((element) => element._id === currentUser._id)
    );

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
          setCountLikes(result.likes.length);
          setIsLiked(!isLiked);
        } catch (error) {
          console.error("Error al dar Dislike a la tarjeta:", error);
        }
      } else {
        try {
          const result = await onLike(idCard);
          setCountLikes(result.likes.length);
          setIsLiked(!isLiked);
        } catch (error) {
          console.error("Error al dar like a la tarjeta:", error);
        }
      }
    };

    return (
      <>
        <article className="card">
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

          <img
            alt={"Imagen ilustrativa del usuario " + user.name}
            src={user.avatar}
            className="card__photo-item-user"
          />
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
