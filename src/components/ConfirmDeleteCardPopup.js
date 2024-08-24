import React, { useState, useEffect, memo, useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import vector_close_icon from "../images/vector_close_icon.png";
import vector_error_icon from "../images/vector_icon_error.png";

const ConfirmDeleteCardPopup = memo(
  ({ isOpen, onClose, idCard, onDeleteCard, openModalInfoTooltip }) => {
    const statusRef = useRef(null);
    const [isStatus, setIsStatus] = useState(false);

    const handleOutsideClick = (e) => {
      if (e.target === e.currentTarget && isStatus === false) {
        onClose();
      }
    };

    useEffect(() => {
      const handleEscapeKeyPress = (e) => {
        if (e.key === "Escape" && isStatus === false) {
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
    }, [isOpen, isStatus, onClose]);

    const handleConfirmDeleteSubmit = async (e) => {
      e.preventDefault();
      setIsStatus(true);
      try {
        await onDeleteCard(idCard);
      } catch (error) {
        if (error.message.includes("Failed to fetch")) {
          openModalInfoTooltip(
            "¡Uy!, falló en la conexión con el servidor.",
            vector_error_icon
          );
          //navigate("/login");
        } else {
          openModalInfoTooltip(
            "¡Uy!, algo salió mal. Error al eliminar la card.",
            vector_error_icon
          );
        }
      } finally {
        setIsStatus(false);
        onClose();
      }
    };

    return (
      <div
        className={`content-modal ${
          isOpen ? "content-modal_visibility_visible" : ""
        }`}
        onClick={handleOutsideClick}
      >
        <div className="modal">
          <button
            onClick={() => {
              if (isStatus === false) {
                onClose();
              }
            }}
            type="button"
            className="modal__button-close"
          >
            <img alt="icono cerrar modal" src={vector_close_icon} />
          </button>
          <h2 className="modal__title">¿Estás segudo/a?</h2>
          <form
            className="modal-form"
            noValidate
            onSubmit={handleConfirmDeleteSubmit}
          >
            <fieldset className="modal-form__set">
              <button
                className={`button button_delete-card ${
                  isStatus ? "button_inactive" : ""
                }`}
                type="submit"
                disabled={isStatus}
              >
                <SwitchTransition>
                  <CSSTransition
                    key={isStatus}
                    nodeRef={statusRef}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                  >
                    <div ref={statusRef}>
                      {isStatus ? "Eliminando..." : "Elimiar"}
                    </div>
                  </CSSTransition>
                </SwitchTransition>
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
);

export default ConfirmDeleteCardPopup;
