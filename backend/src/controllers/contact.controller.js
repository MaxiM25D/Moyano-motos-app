import { ContactService } from "../services/contact.service.js";

const contactService = new ContactService();

export const sendContactMessage = async (req, res) => {
  try {
    await contactService.sendContactMessage(req.body);
    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error enviando mensaje de contacto:", error.message);
    res.status(error.status || 500).json({
      message: error.status
        ? error.message
        : "No se pudo enviar el mensaje. Intenta nuevamente mas tarde."
    });
  }
};
