import authRouter from "../router/routes/auth.router.js";
import clientRouter from "../router/routes/client.router.js";
import installmentRouter from "../router/routes/installment.router.js";
import motorcycleRouter from "../router/routes/motorcycle.router.js";
import receiptRouter from "../router/routes/receipt.router.js";
import reportRouter from "../router/routes/report.router.js";
import saleRouter from "../router/routes/sale.router.js";
import userRouter from "../router/routes/user.router.js";

export function initRouters(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/clients", clientRouter);
  app.use("/api/installments", installmentRouter);
  app.use("/api/motorcycles", motorcycleRouter);
  app.use("/api/receipts", receiptRouter);
  app.use("/api/reports", reportRouter);
  app.use("/api/sales", saleRouter);
  app.use("/api/users", userRouter);

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
  });
}
