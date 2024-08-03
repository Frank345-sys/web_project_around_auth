import vector_close_icon from "../images/vector_close_icon.png";
import React, { useEffect, memo } from "react";

const ImagePopup = memo(({ isOpen, onClose, nameCard, imageUrlCard }) => {
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscapeKeyPress = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKeyPress);
      document.body.style.overflow = "hidden";
    }
    // Se limpia el evento cuando se ejecuta useEffect o cuando se desmonta el componente
    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`content-pop-up content-pop-up_image ${
        isOpen ? "content-pop-up_visibility_visible" : ""
      }`}
      onClick={handleOutsideClick}
    >
      <div className="pop-up-window">
        <button
          type="button"
          className="pop-up-window__button-close"
          onClick={onClose}
        >
          <img alt="icono cerrar pop-up" src={vector_close_icon} />
        </button>
        <img
          src={imageUrlCard}
          alt={"Vista previa imagen de la card " + nameCard}
        />
        <h3>{nameCard}</h3>
      </div>
    </div>
  );
});

export default ImagePopup;
