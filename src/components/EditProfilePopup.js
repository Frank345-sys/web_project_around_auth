import React, { useEffect, useState, useRef } from "react";
import vector_close_icon from "../images/vector_close_icon.png";

function EditProfilePopup({
  nameUser,
  onNameUser,
  aboutUser,
  onAboutUser,
  isOpen,
  onClose,
  formEditSubmit,
}) {
  const inputNameRef = useRef(null);
  const inputOccupationRef = useRef(null);
  const [errorName, setErrorName] = useState(false);
  const [errorOccupation, setErrorOccupation] = useState(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");

  const [statusEdit, setStatusEdit] = useState(false);

  useEffect(() => {
    setName(nameUser);
    setOccupation(aboutUser);
  }, [isOpen, nameUser, aboutUser]);

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
      await formEditSubmit(name, occupation).then((result) => {
        setStatusEdit(false);
        onClose();
        onNameUser(result.name);
        onAboutUser(result.about);
      });
    } catch (error) {
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
              {statusEdit ? "Guardando..." : "Guardar"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePopup;
