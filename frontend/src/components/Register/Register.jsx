import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "../Register/Register.css";

function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    age: ""
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      setError("Error al registrarse, intentá de nuevo");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>CREAR CUENTA</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input name="first_name" placeholder="Nombre" onChange={handleChange} />
        <input name="last_name" placeholder="Apellido" onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
        <input name="age" type="number" placeholder="Edad" onChange={handleChange} />
        <button type="submit">REGISTRARSE</button>
      </form>
    </div>
  );
}

export default Register;