import React, { useEffect, memo } from "react";
import vector_close_icon from "../images/vector_close_icon.png";

const InfoTooltip = memo(({ isOpen, onClose, src, title }) => {
  const handleEscapeKeyPress = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKeyPress);
      document.body.style.overflow = "hidden";
    }
    // Se limpia el evento cuando se ejecuta useEffect o cuando se desmonta el componente
    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div
      className={`content-modal ${
        isOpen ? "content-modal_visibility_visible" : ""
      }`}
      onClick={handleOutsideClick}
    >
      <div className="modal">
        <button onClick={onClose} type="button" className="modal__button-close">
          <img alt="icono cerrar modal" src={vector_close_icon} />
        </button>
        <img className="modal__icon" src={src} alt="ilustración status"></img>
        <h2 className="modal__title modal__title_aling-self-center">{title}</h2>
      </div>
    </div>
  );
});

export default InfoTooltip;
