import logo_header from "../images/logo/logo.png";
import btn_nav_bar_mb from "../images/btn-nav-bar-m.png";
import vector_close_icon from "../images/vector_close_icon.png";
import React, { useState, useRef, useEffect } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";

function Header({ isLoggin, isSingOut, navigate, email }) {
  const handleSubmit = () => {
    setIsOpenNav(false);
    setChangeLogo(btn_nav_bar_mb);
    isSingOut();
    navigate("/login");
  };

  const [isOpenNav, setIsOpenNav] = useState(false);

  const [changeLogo, setChangeLogo] = useState(btn_nav_bar_mb);

  const imglRef = useRef(null);

  const closeOrOpenNav = () => {
    setIsOpenNav(!isOpenNav);
    setChangeLogo(!isOpenNav ? vector_close_icon : btn_nav_bar_mb);
  };

  return (
    <header className="header">
      <ul
        className={`nav-bar-movil ${
          isOpenNav ? "nav-bar-movil_visibility_visible-movil" : ""
        }`}
      >
        <li>{email}</li>
        <li className="link">
          <button
            className="link__access link__access_sign-off"
            onClick={handleSubmit}
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
      <div className="content-header">
        <img
          alt="Logo-header"
          src={logo_header}
          className="content-header__logo"
        />
        <button
          className={`nav-bar-button ${
            isLoggin ? "nav-bar-button_visibility_visible" : ""
          }`}
          onClick={closeOrOpenNav}
        >
          <SwitchTransition>
            <CSSTransition
              key={changeLogo}
              nodeRef={imglRef}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <img
                ref={imglRef}
                alt="Logo-header"
                src={changeLogo}
                className="content-header__logo"
              />
            </CSSTransition>
          </SwitchTransition>
        </button>
        <ul
          className={`nav-bar-pc ${
            isLoggin ? "nav-bar-pc_visibility_visible-pc" : ""
          }`}
        >
          <li>{email}</li>
          <li className="link">
            <button
              className="link__access link__access_sign-off"
              onClick={handleSubmit}
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
