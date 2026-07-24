import { createHash, randomBytes } from "node:crypto";
import { AuthSessionRepository } from "../repositories/authSession.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { HttpError } from "../utils/httpError.js";

const userRepository = new UserRepository();
const authSessionRepository = new AuthSessionRepository();
const DEFAULT_SESSION_MS = 12 * 60 * 60 * 1000;
const REMEMBERED_SESSION_MS = 7 * 24 * 60 * 60 * 1000;

const createRefreshToken = () => randomBytes(48).toString("base64url");
const hashRefreshToken = (token) => createHash("sha256").update(token).digest("hex");
const getSessionExpiration = (rememberDevice) => new Date(
  Date.now() + (rememberDevice ? REMEMBERED_SESSION_MS : DEFAULT_SESSION_MS)
);

export class AuthService {
  async login(email, password, rememberDevice = false) {
    const user = await userRepository.getUserByEmail(email);
    if (!user) throw new HttpError("Credenciales invalidas", 401);
    if (!user.active) throw new HttpError("Usuario inactivo", 403);
    if (!isValidPassword(user, password)) throw new HttpError("Credenciales invalidas", 401);

    await authSessionRepository.deleteExpired();

    const refreshToken = createRefreshToken();
    const expiresAt = getSessionExpiration(rememberDevice);
    const session = await authSessionRepository.create({
      userId: user.id,
      tokenHash: hashRefreshToken(refreshToken),
      rememberDevice,
      expiresAt
    });

    return {
      token: generateToken(user, session.id),
      refreshToken,
      sessionExpiresAt: session.expiresAt,
      user
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new HttpError("Sesion no disponible", 401);

    const session = await authSessionRepository.getByTokenHash(hashRefreshToken(refreshToken));
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      throw new HttpError("La sesion vencio", 401);
    }
    if (!session.user.active) throw new HttpError("Usuario inactivo", 403);

    const nextRefreshToken = createRefreshToken();
    const expiresAt = getSessionExpiration(session.rememberDevice);
    const updatedSession = await authSessionRepository.rotate(
      session.id,
      hashRefreshToken(nextRefreshToken),
      expiresAt
    );

    return {
      token: generateToken(updatedSession.user, updatedSession.id),
      refreshToken: nextRefreshToken,
      sessionExpiresAt: updatedSession.expiresAt,
      user: updatedSession.user
    };
  }

  async logout(refreshToken) {
    if (!refreshToken) return;
    await authSessionRepository.revokeByTokenHash(hashRefreshToken(refreshToken));
  }

  async current(userId) {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new HttpError("Usuario no encontrado", 404);
    if (!user.active) throw new HttpError("Usuario inactivo", 403);

    return user;
  }
}
