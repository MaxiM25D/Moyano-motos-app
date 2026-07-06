import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "../Login/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { mergeCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      login(data.user);

      // Fusionar carrito invitado si existe
      if (data.user?.cartId) {
        await mergeCart(data.user.cartId);
      }

      navigate(location.state?.from || "/", { replace: true });
    } catch {
      setError("Email o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>INICIAR SESIÓN</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">INGRESAR</button>
      </form>
    </div>
  );
}

export default Login;
