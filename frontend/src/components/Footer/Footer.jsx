import '../Footer/Footer.css';
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { contactChannels } from "../../data/contacto";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} LUNEK | Todos los derechos reservados</p>
      
      <div className="social-icons">
        <a href={contactChannels.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram de LUNEK">
          <FaInstagram />
        </a>
        <a href={contactChannels.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook de LUNEK">
          <FaFacebook />
        </a>
        <a href={contactChannels.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de LUNEK">
          <FaWhatsapp />
        </a>
      </div>
    </footer>
  );
}
