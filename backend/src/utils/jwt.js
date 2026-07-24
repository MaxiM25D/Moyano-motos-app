import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateToken = (user, sessionId) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m"
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
