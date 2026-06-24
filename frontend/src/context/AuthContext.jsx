import { createContext, useContext, useState, useEffect } from "react";
import { logoutUser } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // ← nuevo


  // Al cargar la app, revisamos si hay usuario guardado
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setReady(true); // ← marca que ya terminó de cargar
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  // No renderiza nada hasta que no cargó el estado
  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);