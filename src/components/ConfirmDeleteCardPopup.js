import React, { useState, useEffect, memo, useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import vector_close_icon from "../images/vector_close_icon.png";

const ConfirmDeleteCardPopup = memo(
  ({ isOpen, onClose, idCard, onDeleteCard, openModalError }) => {
    const statusRef = useRef(null);
    const [status, setStatus] = useState(false);

    const handleOutsideClick = (e) => {
      if (e.target === e.currentTarget && status === false) {
        onClose();
      }
    };

    useEffect(() => {
      const handleEscapeKeyPress = (e) => {
        if (e.key === "Escape" && status === false) {
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
    }, [isOpen, status]);

    const handleConfirmDeleteSubmit = async (e) => {
      e.preventDefault();
      setStatus(true);
      try {
        await onDeleteCard(idCard);
        setStatus(false);
        onClose();
      } catch (error) {
        setStatus(false);
        onClose();
        openModalError();
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
              if (status === false) {
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
        </div>
      </div>
    );
  }
);

export default ConfirmDeleteCardPopup;
