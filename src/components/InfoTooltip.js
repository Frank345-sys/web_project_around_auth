import React, { useEffect, useRef } from "react";
import vector_close_icon from "../images/vector_close_icon.png";

function InfoTooltip({ isOpen, onClose, children }) {
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
