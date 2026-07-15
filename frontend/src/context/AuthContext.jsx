import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setReady(true);
        return;
      }

      try {
        const { user: currentUser } = await getCurrentUser();
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setReady(true);
      }
    };

    restoreSession();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  if (!ready) {
    return <div className="app-loader" aria-label="Cargando" />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
