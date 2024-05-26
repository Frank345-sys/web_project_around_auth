import React, { useEffect, useState, useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import vector_close_icon from "../images/vector_close_icon.png";

function EditProfilePopup({
  nameUser,
  onNameUser,
  aboutUser,
  onAboutUser,
  isOpen,
  onClose,
  openModalError,
  formEditSubmit,
}) {
  const inputNameRef = useRef(null);
  const inputOccupationRef = useRef(null);
  const statusRef = useRef(null);

  const [errorName, setErrorName] = useState(false);
  const [errorOccupation, setErrorOccupation] = useState(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [statusEdit, setStatusEdit] = useState(false);

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
      setName(nameUser);
      setOccupation(aboutUser);
      document.addEventListener("keydown", handleEscapeKeyPress.current);
      document.body.style.overflow = "hidden";
    } else if (isOpen === false && document.body.style.overflow === "hidden") {
      document.removeEventListener("keydown", handleEscapeKeyPress.current);
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    setErrorName(!inputNameRef.current.validity.valid);
  }, [name]);

  useEffect(() => {
    setErrorOccupation(!inputOccupationRef.current.validity.valid);
  }, [occupation]);

  useEffect(() => {
    setIsSubmitButtonDisabled(errorName || errorOccupation);
  }, [errorName, errorOccupation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusEdit(true);
    try {
      const result = await formEditSubmit(name, occupation);
      setStatusEdit(false);
      onClose();
      onNameUser(result.name);
      onAboutUser(result.about);
    } catch (error) {
      onClose();
      openModalError();
      console.error("Error al actualizar los datos del usuario :", error);
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
        <button onClick={onClose} type="button" className="modal__button-close">
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
              placeholder="Ingrese el nombre"
              required
              minLength="2"
              maxLength="40"
              ref={inputNameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span
              className={`error error_input-name ${
                errorName ? "error_active" : ""
              }`}
            >
              {inputNameRef.current && inputNameRef.current.validationMessage}
            </span>
            <input
              className={`input input_occupation ${
                errorOccupation ? "input_error-active" : ""
              }`}
              id="input-occupation"
              type="text"
              name="occupation"
              placeholder="Ingrese la ocupación"
              required
              minLength="2"
              maxLength="200"
              ref={inputOccupationRef}
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
            <span
              className={`error error_input-occupation ${
                errorOccupation ? "error_active" : ""
              }`}
            >
              {inputOccupationRef.current &&
                inputOccupationRef.current.validationMessage}
            </span>
            <button
              className={`button button_edit ${
                isSubmitButtonDisabled ? "button_inactive" : ""
              }`}
              type="submit"
              disabled={isSubmitButtonDisabled}
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

export default EditProfilePopup;
