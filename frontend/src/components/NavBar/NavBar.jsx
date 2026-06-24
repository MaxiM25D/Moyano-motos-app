import { Link } from "react-router-dom";
import { useState } from "react";
import "../NavBar/NavBar.css";
import CartWidget from "../Cartwidget/CartWidget.jsx";
<<<<<<< HEAD
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
=======
import logo from "../../assets/img/img1.PNG";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
>>>>>>> 1d41361186b3b67662fda3e163815ae28950ff3f

  return (
    <header>
      <nav className="nav">
<<<<<<< HEAD

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

            <Link to="/productos" className="dropdown-title">PRODUCTOS ▾</Link>
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
=======
        <div className="logo-container">
          <Link to="/" className="logo-text">SM GLAMOUR🌟</Link>
          <Link to="/">
            <img className="logo-img" src={logo} alt="logo" />
          </Link>
        </div>

        {/* Botón Hamburguesa */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li
            className="dropdown"
            onMouseEnter={() => window.innerWidth > 768 && setOpenDropdown(true)}
            onMouseLeave={() => window.innerWidth > 768 && setOpenDropdown(false)}
          >
            <Link
              to="/productos"
              className="dropdown-title"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setOpenDropdown(!openDropdown);
                }
              }}
            >
              Productos ▾
            </Link>
            {openDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/categoria/anillos" onClick={() => setMenuOpen(false)}>Anillos</Link></li>
                <li><Link to="/categoria/aros" onClick={() => setMenuOpen(false)}>Aros</Link></li>
                <li><Link to="/categoria/cadenas" onClick={() => setMenuOpen(false)}>Cadenas</Link></li>
                <li><Link to="/categoria/pulceras" onClick={() => setMenuOpen(false)}>Pulceras</Link></li>
              </ul>
>>>>>>> 1d41361186b3b67662fda3e163815ae28950ff3f
            )}

          </li>
<<<<<<< HEAD

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
        
        <CartWidget />
        

=======
          <li><Link to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</Link></li>
        </ul>

        <Link to="/carrito" onClick={() => setMenuOpen(false)}>
          <CartWidget />
        </Link>
>>>>>>> 1d41361186b3b67662fda3e163815ae28950ff3f
      </nav>
    </header>
  );
}

export default NavBar;