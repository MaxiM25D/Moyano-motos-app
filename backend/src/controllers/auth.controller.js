import { UserDTO } from "../dto/user.dto.js";
import { AuthService } from "../services/auth.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const authService = new AuthService();
const REFRESH_COOKIE = "moyano_refresh";

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth"
});

const setRefreshCookie = (res, refreshToken, expiresAt) => {
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...getRefreshCookieOptions(),
    expires: new Date(expiresAt)
  });
};

export const login = async (req, res) => {
  try {
    const { token, refreshToken, sessionExpiresAt, user } = await authService.login(
      req.body.email,
      req.body.password,
      req.body.rememberDevice
    );
    setRefreshCookie(res, refreshToken, sessionExpiresAt);
    return sendSuccess(res, "Login correcto", {
      token,
      sessionExpiresAt,
      user: new UserDTO(user)
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const refresh = async (req, res) => {
  try {
    const { token, refreshToken, sessionExpiresAt, user } = await authService.refresh(
      req.cookies?.[REFRESH_COOKIE]
    );
    setRefreshCookie(res, refreshToken, sessionExpiresAt);
    return sendSuccess(res, "Sesion renovada", {
      token,
      sessionExpiresAt,
      user: new UserDTO(user)
    });
  } catch (error) {
    res.clearCookie(REFRESH_COOKIE, getRefreshCookieOptions());
    return sendError(res, error);
  }
};

export const logout = async (req, res) => {
  try {
    await authService.logout(req.cookies?.[REFRESH_COOKIE]);
    res.clearCookie(REFRESH_COOKIE, getRefreshCookieOptions());
    return sendSuccess(res, "Sesion cerrada");
  } catch (error) {
    return sendError(res, error);
  }
};

export const current = async (req, res) => {
  try {
    const user = await authService.current(req.user.id);
    return sendSuccess(res, "Usuario actual", {
      user: new UserDTO(user)
    });
  } catch (error) {
    return sendError(res, error);
  }
};
