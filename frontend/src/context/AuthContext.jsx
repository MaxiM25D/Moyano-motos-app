import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService.js";
import {
  getSessionEndReason,
  getTokenExpiration,
  resetSessionNotification,
  SESSION_END_EVENT,
  SESSION_WARNING_MS
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
      const token = localStorage.getItem("token");

      if (!token) {
        setReady(true);
        return;
      }

      if (getTokenExpiration(token) <= Date.now()) {
        endSession("expired");
        setReady(true);
        return;
      }

      try {
        const { user: currentUser } = await getCurrentUser();
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch {
        clearSession();
      } finally {
        setReady(true);
      }
    };

    restoreSession();
  }, [clearSession, endSession]);

  useEffect(() => {
    if (!user) return undefined;

    const token = localStorage.getItem("token");
    const expiresAt = getTokenExpiration(token || "");
    if (!expiresAt) {
      endSession("expired");
      return undefined;
    }

    const checkExpiration = () => {
      const reason = getSessionEndReason(expiresAt);
      if (reason) endSession(reason);
    };
    const warningDelay = Math.max(0, expiresAt - Date.now() - SESSION_WARNING_MS);
    const timer = window.setTimeout(checkExpiration, warningDelay);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") checkExpiration();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [endSession, user]);

  const login = useCallback((userData, token) => {
    resetSessionNotification();
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  if (!ready) {
    return <div className="app-loader" aria-label="Cargando" />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
