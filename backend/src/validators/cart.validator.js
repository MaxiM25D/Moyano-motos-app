import Joi from "joi";

export const addProductToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});

export const updateCartQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "La cantidad debe ser un numero",
    "number.integer": "La cantidad debe ser un numero entero",
    "number.min": "La cantidad debe ser al menos 1",
    "any.required": "La cantidad es obligatoria"
  })
});
