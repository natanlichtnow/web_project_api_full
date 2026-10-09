import logo from "../../images/logo.svg";

function Header({ onLogout }) {
  return (
    <header className="header page__section">
      <img
        src={logo}
        alt="Around the U.S logo"
        className="logo header__logo"
      />
      {onLogout && (
        <button 
          className="header__logout-button"
          onClick={onLogout}
        >
          Sair
        </button>
      )}
    </header>
  );
}

export default Header;