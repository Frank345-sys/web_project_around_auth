import React, { useEffect, useState, useRef, memo } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import vector_close_icon from "../images/vector_close_icon.png";
import vector_error_icon from "../images/vector_icon_error.png";

const EditProfilePopup = memo(
  ({
    nameUser,
    onNameUser,
    aboutUser,
    onAboutUser,
    isOpen,
    onClose,
    openModalInfoTooltip,
    formEditSubmit,
  }) => {
    const inputNameRef = useRef(null);
    const inputOccupationRef = useRef(null);
    const statusRef = useRef(null);

    const [errorName, setErrorName] = useState(false);
    const [errorOccupation, setErrorOccupation] = useState(false);
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const [name, setName] = useState("");
    const [occupation, setOccupation] = useState("");
    const [statusEdit, setStatusEdit] = useState(false);

    const handleOutsideClick = (e) => {
      if (e.target === e.currentTarget && statusEdit === false) {
        onClose();
      }
    };

    useEffect(() => {
      if (isOpen) {
        setName(nameUser);
        //setErrorName(!inputNameRef.current.validity.valid);
        setOccupation(aboutUser);
        //setErrorOccupation(!inputOccupationRef.current.validity.valid);
        setIsSubmitButtonDisabled(true);
      }
    }, [isOpen, nameUser, aboutUser]);

    useEffect(() => {
      const handleEscapeKeyPress = (e) => {
        if (e.key === "Escape" && statusEdit === false) {
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
    }, [isOpen, statusEdit, onClose]);

    useEffect(() => {
      setErrorName(!inputNameRef.current.validity.valid);
    }, [name]);

    useEffect(() => {
      setErrorOccupation(!inputOccupationRef.current.validity.valid);
    }, [occupation]);

    /*
  useEffect(() => {
    setIsSubmitButtonDisabled(errorName || errorOccupation);
  }, [errorName, errorOccupation]);
  */

    const handleInputNameChange = (e) => {
      //setErrorName(!inputNameRef.current.validity.valid);
      setName(e.target.value);
      setIsSubmitButtonDisabled(
        !inputNameRef.current.validity.valid ||
          !inputOccupationRef.current.validity.valid
      );
    };

    const handleInputOccupationChange = (e) => {
      //setErrorOccupation(!inputOccupationRef.current.validity.valid);
      setOccupation(e.target.value);
      setIsSubmitButtonDisabled(
        !inputNameRef.current.validity.valid ||
          !inputOccupationRef.current.validity.valid
      );
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatusEdit(true);
      try {
        const result = await formEditSubmit(name, occupation);
        onNameUser(result.name);
        onAboutUser(result.about);
      } catch (error) {
        if (error.message.includes("Failed to fetch")) {
          openModalInfoTooltip(
            "¡Uy!, falló en la conexión con el servidor.",
            vector_error_icon
          );
          //navigate("/login");
        } else {
          openModalInfoTooltip(
            "¡Uy!, algo salió mal, error al actualizar tus datos.",
            vector_error_icon
          );
        }
      } finally {
        setStatusEdit(false);
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
              if (statusEdit === false) {
                onClose();
              }
            }}
            type="button"
            className="modal__button-close"
          >
            <img alt="icono cerrar modal" src={vector_close_icon} />
          </button>
          <h2 className="modal__title">Editar perfil</h2>
          <form
            className="modal-form modal-form_edit"
            noValidate
            onSubmit={handleSubmit}
          >
            <fieldset className="modal-form__set">
              <input
                className={`input input_name ${
                  errorName ? "input_error-active" : ""
                }`}
                id="input-name"
                type="text"
                name="name"
                placeholder="Ingrese su nombre"
                required
                minLength="2"
                maxLength="30"
                ref={inputNameRef}
                value={name}
                onChange={handleInputNameChange}
                disabled={statusEdit}
              />
              <span
                className={`error error_input-name ${
                  errorName
                    ? "error_active"
                    : `${
                        inputNameRef.current &&
                        inputNameRef.current.value.length >= 2
                          ? "error_inactive"
                          : ""
                      } `
                }`}
              >
                {`${
                  inputNameRef.current && inputNameRef.current.validationMessage
                } caracteres: ${
                  inputNameRef.current && inputNameRef.current.value.length
                }/30`}
              </span>
              <input
                className={`input input_occupation ${
                  errorOccupation ? "input_error-active" : ""
                }`}
                id="input-occupation"
                type="text"
                name="occupation"
                placeholder="Ingrese su ocupación"
                required
                minLength="2"
                maxLength="30"
                ref={inputOccupationRef}
                value={occupation}
                onChange={handleInputOccupationChange}
                disabled={statusEdit}
              />
              <span
                className={`error error_input-occupation ${
                  errorOccupation
                    ? "error_active"
                    : `${
                        inputOccupationRef.current &&
                        inputOccupationRef.current.value.length >= 2
                          ? "error_inactive"
                          : ""
                      } `
                }`}
              >
                {`${
                  inputOccupationRef.current &&
                  inputOccupationRef.current.validationMessage
                } caracteres: ${
                  inputOccupationRef.current &&
                  inputOccupationRef.current.value.length
                }/30`}
              </span>
              <button
                className={`button button_edit ${
                  isSubmitButtonDisabled ? "button_inactive" : ""
                } ${statusEdit ? "button_inactive" : ""}`}
                type="submit"
                disabled={isSubmitButtonDisabled || statusEdit}
              >
                <SwitchTransition>
                  <CSSTransition
                    key={statusEdit}
                    nodeRef={statusRef}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                  >
                    <div ref={statusRef}>
                      {statusEdit ? "Guardando..." : "Guardar"}
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

export default EditProfilePopup;
