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

  /*
  useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      emailUser: inputEmailRef.current && inputEmailRef.current.value,
      passwordUser: inputPasswordRef.current && inputPasswordRef.current.value,
    }));
    console.log(values.emailUser);
    console.log(values.passwordUser);
  }, []);
  */

  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputEmailRef.current && inputPasswordRef.current) {
        setValues({
          emailUser: inputEmailRef.current.value,
          passwordUser: inputPasswordRef.current.value,
        });
      }
      console.log(values.emailUser);
      console.log(values.passwordUser);
    }, 500); // Espera 500ms para dar tiempo a que el navegador complete los campos

    return () => clearTimeout(timer);
  }, []);
  */

  /*
  useEffect(() => {
    setErrorEmail(!inputEmailRef.current.validity.valid);
  }, []);

  useEffect(() => {
    setErrorPassword(!inputPasswordRef.current.validity.valid);
  }, []);

  useEffect(() => {
    setIsSubmitButtonDisabled(errorEmail || errorPassword);
  }, []);
  */

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
        setEmailUser(values.emailUser);
        logginTrue();
        navigate("/main");
      })
      .catch((error) => {
        if (error.message.includes("Failed to fetch")) {
          openModalInfoTooltip(
            "¡Uy!, falló en la conexión con el servidor, intentalo más tarde.",
            vector_error_icon
          );
        } else {
          openModalInfoTooltip(
            "¡Uy!, algo salió mal. Uno o más campos contienen datos no válidos.",
            vector_error_icon
          );
        }
      })
      .finally(() => {
        setStatusLogin(false);
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
                placeholder="Correo electrónico"
                disabled={statusLogin}
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
                placeholder="Contraseña"
                disabled={statusLogin}
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
              } ${statusLogin ? "button_inactive" : ""}`}
              type="submit"
              disabled={isSubmitButtonDisabled || statusLogin}
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
