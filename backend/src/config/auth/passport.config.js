import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserManager } from "../../managers/user.manager.js";
import { isValidPassword } from "../../utils/bcrypt.js";
import env from "../env.config.js";

const userManager = new UserManager();

export const initPassport = () => {

  /**
   * ==========================
   * 🔐 LOCAL STRATEGY (LOGIN)
   * ==========================
*/
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        try {
          const user = await userManager.findByEmail(email);

          if (!user) {
            return done(null, false, { message: "Invalid credentials" });
          }

          const validPassword = isValidPassword(user, password);

          if (!validPassword) {
            return done(null, false, { message: "Invalid credentials" });
          }

          return done(null, user);

        } catch (error) {
          return done(error);
        }
      }
    )
  );

  /**
   * ==========================
   * 🔐 JWT STRATEGY (PROTECT ROUTES)
   * ==========================
   */
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: env.JWT_SECRET,
        issuer: "tu-app-api",
        audience: "tu-app-client"
      },
      async (payload, done) => {
        try {

          // 🔎 Validación básica del payload
          if (!payload?.sub) {
            return done(null, false);
          }

          const user = await userManager.findById(payload.sub);

          if (!user) {
            return done(null, false);
          }

          // 👇 Lo que se adjunta a req.user
          return done(null, {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
          });

        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};