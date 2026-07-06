import { Link } from "react-router-dom";
import { useState } from "react";
import "../NavBar/NavBar.css";
import CartWidget from "../Cartwidget/CartWidget.jsx";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { categorias } from "../../data/categorias.js";

function NavBar() {

  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header>
      <nav className="nav">

        <div className="logo-container">
          <Link to="/" className="logo-text">LUNEK</Link>
        </div>

        <ul className="nav-links">

          <li>
            <Link to="/">INICIO</Link>
          </li>

          <li
            className="dropdown"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >

            <Link to="/productos" className="dropdown-title">PRODUCTOS v</Link>
            {open && (
              <div className="mega-menu">

                <div className="menu-column">
                  <Link to="/productos/accesorios">
                    <h4>Accesorios</h4>
                  </Link>

                  {categorias.accesorios.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/productos/accesorios/${item.slug}`}
                    >
                      {item.name}
                    </Link>
                  ))}

                </div>

                <div className="menu-column">
                  <Link to="/productos/marroquineria">
                    <h4>Marroquineria</h4>
                  </Link>

                  {categorias.marroquineria.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/productos/marroquineria/${item.slug}`}
                    >
                      {item.name}
                    </Link>
                  ))}

                </div>

              </div>
            )}

          </li>

          <li>
            <Link to="/contacto">CONTACTO</Link>
          </li>

        </ul>

        <div className="nav-auth">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin/products" className="btn-admin-nav">
                  ADMIN
                </Link>
              )}
              <span className="nav-username">Hola, {user.first_name}</span>
              <button onClick={handleLogout} className="btn-logout">SALIR</button>
            </>
          ) : (
            <Link to="/login" className="btn-login">LOGIN</Link>
          )}
        </div>
        
        
        <Link to="/cart" className="cart-link"><CartWidget /></Link>

      </nav>
    </header>
  );
}

export default NavBar;
