//ROUTES
import authRouter from "../router/routes/auth.router.js";
import productRouter from "../router/routes/product.router.js";
import userRouter from "../router/routes/user.router.js";
import cartRouter from "../router/routes/cart.router.js";

export function initRouters(app) {

  app.use("/api/auth", authRouter);
  app.use("/api/products", productRouter);
  app.use("/api/users", userRouter);
  app.use("/api/carts", cartRouter);
  // 404
  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
}