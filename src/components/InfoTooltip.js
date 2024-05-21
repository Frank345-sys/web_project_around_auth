import React, { useEffect } from "react";
import vector_close_icon from "../images/vector_close_icon.png";

function InfoTooltip({ isOpen, onClose, children }) {
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKeyPress = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKeyPress);
      document.body.style.overflow = "hidden";
    }

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
        {children}
      </div>
    </div>
  );
}

export default InfoTooltip;
