import arrow_up from "../images/arrow_up.png";

function Footer({ isLoggin }) {
  const handleButton = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  //className="footer__button"

  return (
    <footer className="footer">
      <div className="content-footer">
        <p className="content-footer__copyright">
          © 2021 Alrededor de los EEUU
        </p>
        <button
          className={`footer__button ${
            isLoggin ? "footer__button_visibility-visible" : ""
          }`}
          onClick={handleButton}
        >
          <img src={arrow_up} alt="botón para subir" />
        </button>
      </div>
    </footer>
  );
}

export default Footer;
