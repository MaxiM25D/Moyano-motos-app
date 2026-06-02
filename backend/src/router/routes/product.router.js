import { Router } from "express";
import passport from "passport";
import {getProducts, getProductById, createProduct, updateProduct, deleteProduct} from "../../controllers/product.controller.js";
import { authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { productSchema } from "../../validators/product.validator.js";


const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", passport.authenticate("jwt", { session: false }), authorize("admin"), validate(productSchema), createProduct);
router.put("/:id", passport.authenticate("jwt", { session: false }), authorize("admin"), validate(productSchema), updateProduct);
router.delete("/:id", passport.authenticate("jwt", { session: false }), authorize("admin"), deleteProduct);

export default router;