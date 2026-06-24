import '../Footer/Footer.css';
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} LUNEK | Todos los derechos reservados</p>
      
      <div className="social-icons">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp />
        </a>
      </div>
    </footer>
  );
}