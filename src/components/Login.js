import React, { useState, useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { Link } from "react-router-dom";
import * as auth from "../utils/auth";
import vector_error_icon from "../images/vector_icon_error.png";
import vector_success_icon from "../images/vector_icon_success.png";

function Login({ navigate, logginTrue, openModalInfoTooltip, setEmailUser }) {
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const statusRef = useRef(null);

  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const [statusLogin, setStatusLogin] = useState(false);

  const [values, setValues] = useState({
    emailUser: "",
    passwordUser: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusLogin(true);
    auth
      .authorize(values.passwordUser, values.emailUser)
      .then(() => {
        openModalInfoTooltip(
          "¡Correcto! Sesión iniciada.",
          vector_success_icon
        );
        setStatusLogin(false);
        setEmailUser(values.emailUser);
        logginTrue();
        navigate("/main");
      })
      .catch(() => {
        setStatusLogin(false);
        //openModalError();
        openModalInfoTooltip(
          "Uy, algo salió mal. Por favor, inténtalo de nuevo.",
          vector_error_icon
        );
      });
  };

  return (
    <div className="content-start">
      <div className="login">
        <h2 className="login__title">Iniciar sesión</h2>
        <form
          className="modal-form modal-form_login"
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
                      !inputPasswordRef.current.validity.valid
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
                      !inputPasswordRef.current.validity.valid
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
            <button
              className={`button button_login ${
                isSubmitButtonDisabled ? "button_inactive" : ""
              }`}
              type="submit"
              disabled={isSubmitButtonDisabled}
            >
              <SwitchTransition>
                <CSSTransition
                  key={statusLogin}
                  nodeRef={statusRef}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div ref={statusRef}>
                    {statusLogin ? "Iniciando..." : "Iniciar sesión"}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            </button>
            <div className="link">
              <p className="link__title">¿Aún no eres miembro?</p>
              <Link to="/register" className="link__access">
                Regístrate aquí
              </Link>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default Login;
