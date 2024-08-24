import React, { useEffect, useState, useRef, memo } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import vector_close_icon from "../images/vector_close_icon.png";
import vector_error_icon from "../images/vector_icon_error.png";

const AddPlacePopup = memo(
  ({ isOpen, onClose, openModalInfoTooltip, formAddSubmit }) => {
    const inputNamePlaceRef = useRef(null);
    const inputUrlPlaceRef = useRef(null);
    const statusRef = useRef(null);

    const [errorNamePlace, setErrorNamePlace] = useState(false);
    const [errorUrlPlace, setErrorUrlPlace] = useState(false);

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

    const [namePlace, setNamePlace] = useState("");
    const [urlPlace, setUrlPlace] = useState("");

    const [statusCreateCard, setStatusCreateCard] = useState(false);

    const handleOutsideClick = (e) => {
      if (e.target === e.currentTarget && statusCreateCard === false) {
        onClose();
      }
    };

    useEffect(() => {
      const handleEscapeKeyPress = (e) => {
        if (e.key === "Escape" && statusCreateCard === false) {
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
    }, [isOpen, statusCreateCard, onClose]);

    const handleInputNamePlaceChange = (e) => {
      setErrorNamePlace(!inputNamePlaceRef.current.validity.valid);
      setNamePlace(e.target.value);
      setIsSubmitButtonDisabled(
        !inputNamePlaceRef.current.validity.valid ||
          !inputUrlPlaceRef.current.validity.valid
      );
    };

    const handleInputUrlPlaceChange = (e) => {
      setErrorUrlPlace(!inputUrlPlaceRef.current.validity.valid);
      setUrlPlace(e.target.value);
      setIsSubmitButtonDisabled(
        !inputNamePlaceRef.current.validity.valid ||
          !inputUrlPlaceRef.current.validity.valid
      );
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatusCreateCard(true);
      try {
        await formAddSubmit(namePlace, urlPlace);
      } catch (error) {
        if (error.message.includes("Failed to fetch")) {
          openModalInfoTooltip(
            "¡Uy!, falló en la conexión con el servidor.",
            vector_error_icon
          );
          //navigate("/login");
        } else {
          openModalInfoTooltip(
            "¡Uy!, algo salió mal. Uno o más campos contienen datos no válidos.",
            vector_error_icon
          );
        }
      } finally {
        setStatusCreateCard(false);
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
              if (statusCreateCard === false) {
                onClose();
              }
            }}
            type="button"
            className="modal__button-close"
          >
            <img alt="icono cerrar modal" src={vector_close_icon} />
          </button>
          <h2 className="modal__title">Nuevo lugar</h2>
          <form
            className="modal-form modal-form_add"
            noValidate
            onSubmit={handleSubmit}
          >
            <fieldset className="modal-form__set">
              <input
                className={`input input_name-place ${
                  errorNamePlace ? "input_error-active" : ""
                }`}
                id="input-name-place"
                type="text"
                name="name-place"
                placeholder="Ingrese el nombre del lugar"
                required
                minLength="2"
                maxLength="30"
                ref={inputNamePlaceRef}
                onChange={handleInputNamePlaceChange}
                disabled={statusCreateCard}
              />
              <span
                className={`error error_input-name-place ${
                  errorNamePlace ? "error_active" : ""
                }`}
              >
                {inputNamePlaceRef.current &&
                  inputNamePlaceRef.current.validationMessage}
              </span>
              <input
                className={`input input_url ${
                  errorUrlPlace ? "input_error-active" : ""
                }`}
                id="input-url"
                type="url"
                name="url"
                placeholder="Ingresa una URL de imagen (.jpg, .png) del lugar"
                required
                ref={inputUrlPlaceRef}
                onChange={handleInputUrlPlaceChange}
                disabled={statusCreateCard}
              />
              <span
                className={`error error_input-url ${
                  errorUrlPlace ? "error_active" : ""
                }`}
              >
                {inputUrlPlaceRef.current &&
                  inputUrlPlaceRef.current.validationMessage}
              </span>
              <button
                className={`button button_add ${
                  isSubmitButtonDisabled ? "button_inactive" : ""
                } ${statusCreateCard ? "button_inactive" : ""}`}
                type="submit"
                disabled={isSubmitButtonDisabled || statusCreateCard}
              >
                <SwitchTransition>
                  <CSSTransition
                    key={statusCreateCard}
                    nodeRef={statusRef}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                  >
                    <div ref={statusRef}>
                      {statusCreateCard ? "Creando..." : "Crear"}
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

export default AddPlacePopup;
