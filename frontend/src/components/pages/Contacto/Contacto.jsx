import { useState } from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiClock, FiMail, FiSend } from "react-icons/fi";
import { contactChannels } from "../../../data/contacto";
import { sendContactMessage } from "../../../services/contact.service";
import "./Contacto.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "Consulta desde la tienda",
  message: "",
};

function Contacto() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "" });

    try {
      const data = await sendContactMessage(form);
      setStatus({ type: "success", message: data.message });
      setForm(initialForm);
    } catch (error) {
      const responseData = error.response?.data;
      setStatus({
        type: "error",
        message:
          responseData?.message ||
          responseData?.errors?.join(" ") ||
          "No se pudo enviar el mensaje. Intenta nuevamente."
      });
    }
  };

  return (
    <section className="contact-page">
      <header className="contact-header">
        <p className="contact-eyebrow">Atencion personalizada</p>
        <h1>Contactanos</h1>
        <p>Estamos para ayudarte con productos, pedidos y envios.</p>
      </header>

      <div className="contact-layout">
        <div className="contact-info">
          <div className="contact-info-heading">
            <h2>Hablemos</h2>
            <p>Elegi el canal que te resulte mas comodo.</p>
          </div>

          <a className="contact-method" href={`mailto:${contactChannels.email}`}>
            <span className="contact-method-icon"><FiMail aria-hidden="true" /></span>
            <span>
              <strong>Email</strong>
              <small>{contactChannels.email}</small>
            </span>
          </a>

          <a className="contact-method" href={contactChannels.whatsapp} target="_blank" rel="noopener noreferrer">
            <span className="contact-method-icon contact-method-whatsapp"><FaWhatsapp aria-hidden="true" /></span>
            <span>
              <strong>WhatsApp</strong>
              <small>Consultas y seguimiento de pedidos</small>
            </span>
          </a>

          <div className="contact-method contact-hours">
            <span className="contact-method-icon"><FiClock aria-hidden="true" /></span>
            <span>
              <strong>Horario de atencion</strong>
              <small>Lunes a viernes, de 9 a 18 hs.</small>
            </span>
          </div>

          <div className="contact-social">
            <p>Seguinos en nuestras redes</p>
            <div>
              <a href={contactChannels.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram de LUNEK">
                <FaInstagram aria-hidden="true" />
              </a>
              <a href={contactChannels.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook de LUNEK">
                <FaFacebookF aria-hidden="true" />
              </a>
              <a href={contactChannels.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de LUNEK">
                <FaWhatsapp aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-heading">
            <h2>Envianos un mensaje</h2>
            <p>Completá tus datos y te responderemos por correo.</p>
          </div>

          <div className="contact-form-row">
            <label>
              Nombre completo
              <input name="name" type="text" value={form.name} onChange={handleChange} autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />
            </label>
          </div>

          <div className="contact-form-row">
            <label>
              Telefono
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" />
            </label>
            <label>
              Asunto
              <select name="subject" value={form.subject} onChange={handleChange}>
                <option>Consulta desde la tienda</option>
                <option>Estado de mi pedido</option>
                <option>Consulta sobre un producto</option>
                <option>Cambios y devoluciones</option>
              </select>
            </label>
          </div>

          <label>
            Mensaje
            <textarea name="message" rows="6" value={form.message} onChange={handleChange} required />
          </label>

          <button type="submit" disabled={status.type === "loading"}>
            <FiSend aria-hidden="true" />
            {status.type === "loading" ? "Enviando..." : "Enviar mensaje"}
          </button>
          {status.message && (
            <p className={`contact-form-status contact-form-status-${status.type}`} role="status">
              {status.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contacto;
