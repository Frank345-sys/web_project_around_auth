import React, { useEffect, useState, useRef, memo } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import vector_close_icon from "../images/vector_close_icon.png";
import vector_error_icon from "../images/vector_icon_error.png";

const EditAvatarPopup = memo(
  ({
    onAvatarUser,
    isOpen,
    onClose,
    openModalInfoTooltip,
    formEditAvatarSubmit,
  }) => {
    const inputUrlAvatarRef = useRef(null);
    const statusRef = useRef(null);

    const [statusEditPhoto, setStatusEditPhoto] = useState(false);
    const [urlAvatar, setUrlAvatar] = useState("");
    const [errorUrlAvatar, setErrorUrlAvatar] = useState(false);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

    const handleOutsideClick = (e) => {
      if (e.target === e.currentTarget && statusEditPhoto === false) {
        onClose();
      }
    };

    useEffect(() => {
      if (!isOpen) {
        inputUrlAvatarRef.current.value = "";
        setErrorUrlAvatar(false);
        setIsSubmitButtonDisabled(true);
      }
    }, [isOpen]);

    useEffect(() => {
      const handleEscapeKeyPress = (e) => {
        if (e.key === "Escape" && statusEditPhoto === false) {
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
    }, [isOpen, statusEditPhoto, onClose]);

    /*
    useEffect(() => {
      setErrorUrlAvatar(!inputUrlAvatarRef.current.validity.valid);
    }, [urlAvatar]);
    */

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
        console.log(result);
        onAvatarUser(result.avatar);
      } catch (error) {
        if (error.message.includes("Failed to fetch")) {
          openModalInfoTooltip(
            "¡Uy!, falló en la conexión con el servidor.",
            vector_error_icon
          );
          //navigate("/login");
        } else {
          openModalInfoTooltip(
            "¡Uy!, algo salió mal. Error al actualizar la foto de tu perfil.",
            vector_error_icon
          );
        }
      } finally {
        setStatusEditPhoto(false);
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
              if (statusEditPhoto === false) {
                onClose();
              }
            }}
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
                placeholder="Ingresa una URL de imagen (.jpg, .png)"
                required
                ref={inputUrlAvatarRef}
                onChange={handleAvatarChange}
                disabled={statusEditPhoto}
              />
              <span
                className={`error error_input-url-edit ${
                  errorUrlAvatar
                    ? "error_active"
                    : `${
                        inputUrlAvatarRef.current &&
                        inputUrlAvatarRef.current.value.length >= 2
                          ? "error_inactive"
                          : ""
                      } `
                }`}
              >
                {`${
                  inputUrlAvatarRef.current &&
                  inputUrlAvatarRef.current.validationMessage
                } caracteres: ${
                  inputUrlAvatarRef.current &&
                  inputUrlAvatarRef.current.value.length
                }/30`}
              </span>
              <button
                className={`button button_edit-photo ${
                  isSubmitButtonDisabled ? "button_inactive" : ""
                } ${statusEditPhoto ? "button_inactive" : ""}`}
                type="submit"
                disabled={isSubmitButtonDisabled || statusEditPhoto}
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
