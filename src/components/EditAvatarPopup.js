import React, { useEffect, useState, useRef, memo } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import vector_close_icon from "../images/vector_close_icon.png";

const EditAvatarPopup = memo(
  ({ onAvatarUser, isOpen, onClose, openModalError, formEditAvatarSubmit }) => {
    const inputUrlAvatarRef = useRef(null);
    const statusRef = useRef(null);

    const [statusEditPhoto, setStatusEditPhoto] = useState(false);
    const [urlAvatar, setUrlAvatar] = useState("");
    const [errorUrlAvatar, setErrorUrlAvatar] = useState(false);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

    const handleOutsideClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    const handleEscapeKeyPress = useRef((e) => {
      if (e.key === "Escape") {
        onClose();
      }
    });

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("keydown", handleEscapeKeyPress.current);
        document.body.style.overflow = "hidden";
        setUrlAvatar("");
      } else if (
        isOpen === false &&
        document.body.style.overflow === "hidden"
      ) {
        document.removeEventListener("keydown", handleEscapeKeyPress.current);
        document.body.style.overflow = "auto";
        setErrorUrlAvatar(false);
        setIsSubmitButtonDisabled(true);
      }
    }, [isOpen]);

    const handleAvatarChange = (e) => {
      setErrorUrlAvatar(!inputUrlAvatarRef.current.validity.valid);
      setIsSubmitButtonDisabled(!inputUrlAvatarRef.current.validity.valid);
      setUrlAvatar(e.target.value);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatusEditPhoto(true);
      try {
        const result = await formEditAvatarSubmit(urlAvatar);
        setStatusEditPhoto(false);
        onClose();
        onAvatarUser(result.avatar);
      } catch (error) {
        onClose();
        openModalError();
        console.error("Error al actualizar foto de perfil:", error);
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
            onClick={onClose}
            type="button"
            className="modal__button-close"
          >
            <img alt="icono cerrar modal" src={vector_close_icon} />
          </button>
          <h2 className="modal__title">Cambiar foto de perfil</h2>
          <form
            className="modal-form modal-form_edit-photo"
            noValidate
            onSubmit={handleSubmit}
          >
            <fieldset className="modal-form__set">
              <input
                className={`input input_url-edit ${
                  errorUrlAvatar ? "input_error-active" : ""
                }`}
                id="input-url-edit"
                type="url"
                name="url"
                placeholder="Ingrese la URL de la foto"
                required
                value={urlAvatar}
                ref={inputUrlAvatarRef}
                onChange={handleAvatarChange}
              />
              <span
                className={`error error_input-url-edit ${
                  errorUrlAvatar ? "input_error-active" : ""
                }`}
              >
                {inputUrlAvatarRef.current &&
                  inputUrlAvatarRef.current.validationMessage}
              </span>
              <button
                className={`button button_edit-photo ${
                  isSubmitButtonDisabled ? "button_inactive" : ""
                }`}
                type="submit"
                disabled={isSubmitButtonDisabled}
              >
                <SwitchTransition>
                  <CSSTransition
                    key={statusEditPhoto}
                    nodeRef={statusRef}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                  >
                    <div ref={statusRef}>
                      {statusEditPhoto ? "Guardando..." : "Guardar"}
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

export default EditAvatarPopup;
