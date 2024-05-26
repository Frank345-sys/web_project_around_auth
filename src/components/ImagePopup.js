import vector_close_icon from "../images/vector_close_icon.png";
import React, { useEffect, useRef } from "react";

function ImagePopup({ isOpen, onClose, nameCard, imageUrlCard }) {
  const handleEscapeKeyPress = useRef((e) => {
    if (e.key === "Escape") {
      onClose();
    }
  });

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKeyPress.current);
      document.body.style.overflow = "hidden";
    } else if (isOpen === false && document.body.style.overflow === "hidden") {
      document.removeEventListener("keydown", handleEscapeKeyPress.current);
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

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
}

export default ImagePopup;
