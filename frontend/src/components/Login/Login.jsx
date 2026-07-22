import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail, FiShield } from "react-icons/fi";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { getApiError } from "../../services/api.js";
import { loginUser } from "../../services/authService.js";
import moyanoLogo from "../../assets/moyano-logo.png";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionReason = location.state?.sessionReason;

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      login(data.user, data.token);
      navigate(location.state?.from || "/", { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError, "Email o contrasena incorrectos"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-brand" aria-label="Moyano Motos">
        <div className="login-brand-content">
          <img src={moyanoLogo} alt="Moyano Motos" />
          <p className="brand-copy">Gestion de ventas y cobranzas</p>
        </div>
      </section>

      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <header>
            <p className="login-kicker">Panel de gestion</p>
            <h1>Bienvenido</h1>
            <p>Ingresa con tu cuenta para continuar.</p>
          </header>

          {error && <div className="form-error" role="alert">{error}</div>}
          {sessionReason && (
            <div className="session-notice" role="alert">
              <FiShield />
              <span>{sessionReason === "expiring"
                ? "Tu sesion esta por vencer. Inicia sesion nuevamente para continuar de forma segura."
                : "Tu sesion vencio por seguridad. Inicia sesion nuevamente para continuar."}</span>
            </div>
          )}

          <label htmlFor="email">Email</label>
          <div className="input-wrap">
            <FiMail aria-hidden="true" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nombre@empresa.com"
              autoComplete="email"
              required
            />
          </div>

          <label htmlFor="password">Contrasena</label>
          <div className="input-wrap">
            <FiLock aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tu contrasena"
              autoComplete="current-password"
              required
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
              title={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
