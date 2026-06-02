import Joi from "joi";

export const productSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "El título es obligatorio",
      "string.min": "El título debe tener al menos 3 caracteres"
    }),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "El precio debe ser un número",
      "number.positive": "El precio debe ser mayor a 0"
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "El stock debe ser un número",
      "number.min": "El stock no puede ser negativo"
    }),

  image: Joi.string()
    .uri()
    .optional()
});