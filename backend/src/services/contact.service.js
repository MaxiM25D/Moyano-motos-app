import nodemailer from "nodemailer";
import { HttpError } from "../utils/httpError.js";

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export class ContactService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      throw new HttpError("El servicio de email no esta configurado", 503);
    }

    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS
        }
      });
    }

    return this.transporter;
  }

  async sendContactMessage({ name, email, phone, subject, message }) {
    const transporter = this.getTransporter();
    const destination = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
    const sender = process.env.SMTP_FROM || process.env.SMTP_USER;

    return transporter.sendMail({
      from: `LUNEK Web <${sender}>`,
      to: destination,
      replyTo: email,
      subject: `[Contacto web] ${subject}`,
      text: [
        `Nombre: ${name}`,
        `Email: ${email}`,
        `Telefono: ${phone || "No informado"}`,
        "",
        message
      ].join("\n"),
      html: `
        <h2>Nuevo mensaje desde LUNEK</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefono:</strong> ${escapeHtml(phone || "No informado")}</p>
        <p><strong>Asunto:</strong> ${escapeHtml(subject)}</p>
        <hr>
        <p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>
      `
    });
  }
}
