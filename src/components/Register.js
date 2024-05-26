import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import * as auth from "../utils/auth";
import { CSSTransition, SwitchTransition } from "react-transition-group";

function Register({ navigate, openModalError, openCorrectModal }) {
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const inputConfirmPasswordRef = useRef(null);
  const statusRef = useRef(null);

  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const [statusRegister, setStatusRegister] = useState(false);

  const [values, setValues] = useState({
    emailUser: "",
    passwordUser: "",
    confirmPasswordUser: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusRegister(true);
    if (values.passwordUser === values.confirmPasswordUser) {
      auth
        .register(values.passwordUser, values.emailUser)
        .then(() => {
          setStatusRegister(false);
          openCorrectModal();
          navigate("/login");
        })
        .catch(() => {
          setStatusRegister(false);
          openModalError();
        });
    } else {
      openModalError();
    }
  };

  return (
    <div className="content-start">
      <div className="register">
        <h2 className="register__title">Regístrate</h2>
        <form
          className="modal-form modal-form_register"
          noValidate
          onSubmit={handleSubmit}
        >
          <fieldset className="modal-form__set">
            <div className="wrapper">
              <input
                className={`wrapper__input input_email ${
                  errorEmail ? "input_error-active" : ""
                }`}
                id="input-email"
                type="email"
                name="emailUser"
                required
                minLength="2"
                maxLength="40"
                ref={inputEmailRef}
                value={values.emailUser}
                onChange={(e) => {
                  setErrorEmail(!inputEmailRef.current.validity.valid);
                  setValues({ ...values, [e.target.name]: e.target.value });
                  setIsSubmitButtonDisabled(
                    !inputEmailRef.current.validity.valid ||
                      !inputPasswordRef.current.validity.valid ||
                      !inputConfirmPasswordRef.current.validity.valid
                  );
                }}
              />
              <label className="wrapper__label">Correo electrónico</label>
            </div>
            <span
              className={`error error_input-name ${
                errorEmail ? "error_active" : ""
              }`}
            >
              {inputEmailRef.current && inputEmailRef.current.validationMessage}
            </span>
            <div className="wrapper">
              <input
                className={`wrapper__input input_password ${
                  errorPassword ? "input_error-active" : ""
                }`}
                id="input-password"
                type="password"
                name="passwordUser"
                required
                minLength="2"
                maxLength="200"
                ref={inputPasswordRef}
                value={values.passwordUser}
                onChange={(e) => {
                  setErrorPassword(!inputPasswordRef.current.validity.valid);
                  setValues({ ...values, [e.target.name]: e.target.value });
                  setIsSubmitButtonDisabled(
                    !inputEmailRef.current.validity.valid ||
                      !inputPasswordRef.current.validity.valid ||
                      !inputConfirmPasswordRef.current.validity.valid
                  );
                }}
              />
              <label className="wrapper__label">Contraseña</label>
            </div>

            <span
              className={`error error_input-password ${
                errorPassword ? "error_active" : ""
              }`}
            >
              {inputPasswordRef.current &&
                inputPasswordRef.current.validationMessage}
            </span>
            <div className="wrapper">
              <input
                className={`wrapper__input input_password ${
                  errorConfirmPassword ? "input_error-active" : ""
                }`}
                id="input-password-confirm"
                type="password"
                name="confirmPasswordUser"
                required
                minLength="2"
                maxLength="200"
                ref={inputConfirmPasswordRef}
                value={values.confirmPasswordUser}
                onChange={(e) => {
                  setErrorConfirmPassword(
                    !inputConfirmPasswordRef.current.validity.valid
                  );
                  setValues({ ...values, [e.target.name]: e.target.value });
                  setIsSubmitButtonDisabled(
                    !inputEmailRef.current.validity.valid ||
                      !inputPasswordRef.current.validity.valid ||
                      !inputConfirmPasswordRef.current.validity.valid
                  );
                }}
              />
              <label className="wrapper__label">Confirmar contraseña</label>
            </div>
            <span
              className={`error error_input-password ${
                errorConfirmPassword ? "error_active" : ""
              }`}
            >
              {inputConfirmPasswordRef.current &&
                inputConfirmPasswordRef.current.validationMessage}
            </span>
            <button
              className={`button button_register ${
                isSubmitButtonDisabled ? "button_inactive" : ""
              }`}
              type="submit"
              disabled={isSubmitButtonDisabled}
            >
              <SwitchTransition>
                <CSSTransition
                  key={statusRegister}
                  nodeRef={statusRef}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div ref={statusRef}>
                    {statusRegister ? "Registrando..." : "Regístrate"}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            </button>
            <div className="link">
              <p className="link__title">¿Ya tienes una cuenta?</p>
              <Link to="/login" className="link__access">
                Inicia sesión aquí
              </Link>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default Register;
