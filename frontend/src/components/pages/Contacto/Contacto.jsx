import "./Contacto.css";

function Contacto({ greeting }) {
  return (
    <section className="contacto">
      <h1>{greeting}</h1>
      <form className="form-contacto">
        <input type="text" placeholder="Nombre" required />
        <input type="email" placeholder="Email" required />
        <input type="text" placeholder="Num de Tel." required />
        <textarea placeholder="Escribe tu mensaje..." rows="5"></textarea>
        <button type="submit">Enviar</button>
      </form>
    </section>
  );
}

export default Contacto;