import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser, refreshSession } from "../services/authService.js";
import { clearAccessToken, setAccessToken } from "../services/api.js";
import {
  resetSessionNotification,
  SESSION_END_EVENT
} from "../services/sessionEvents.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = useRef(location.pathname);

  useEffect(() => {
    currentPath.current = location.pathname;
  }, [location.pathname]);

  const clearSession = useCallback(() => {
    clearAccessToken();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionActive");
    setUser(null);
  }, []);

  const endSession = useCallback((reason) => {
    const returnPath = currentPath.current === "/login" ? "/" : currentPath.current;
    clearSession();
    navigate("/login", {
      replace: true,
      state: { from: returnPath, sessionReason: reason }
    });
  }, [clearSession, navigate]);

  useEffect(() => {
    const handleSessionEnd = (event) => endSession(event.detail?.reason || "expired");
    window.addEventListener(SESSION_END_EVENT, handleSessionEnd);
    return () => window.removeEventListener(SESSION_END_EVENT, handleSessionEnd);
  }, [endSession]);

  useEffect(() => {
    const restoreSession = async () => {
      const hadSession = localStorage.getItem("sessionActive") === "true"
        || Boolean(localStorage.getItem("token"));
      localStorage.removeItem("token");

      try {
        const { user: currentUser } = await refreshSession();
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
        localStorage.setItem("sessionActive", "true");
        resetSessionNotification();
      } catch {
        if (hadSession) {
          endSession("expired");
        } else {
          clearSession();
        }
      } finally {
        setReady(true);
      }
    };

    restoreSession();
  }, [clearSession, endSession]);

  const login = useCallback((userData, token) => {
    resetSessionNotification();
    setAccessToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("sessionActive", "true");
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      clearSession();
      navigate("/login", { replace: true });
    }
  }, [clearSession, navigate]);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  if (!ready) {
    return <div className="app-loader" aria-label="Cargando" />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
