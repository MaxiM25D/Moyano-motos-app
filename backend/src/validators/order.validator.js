import Joi from "joi";

export const createOrderSchema = Joi.object({
  cartId: Joi.string().required().messages({
    "string.empty": "El cartId es obligatorio",
    "any.required": "El cartId es obligatorio"
  }),
  shipping: Joi.object({
    full_name: Joi.string().trim().min(2).required().messages({
      "string.empty": "El nombre completo es obligatorio",
      "string.min": "El nombre completo debe tener al menos 2 caracteres",
      "any.required": "El nombre completo es obligatorio"
    }),
    phone: Joi.string().trim().min(6).required().messages({
      "string.empty": "El telefono es obligatorio",
      "string.min": "El telefono debe tener al menos 6 caracteres",
      "any.required": "El telefono es obligatorio"
    }),
    address: Joi.string().trim().min(3).required().messages({
      "string.empty": "La direccion es obligatoria",
      "string.min": "La direccion debe tener al menos 3 caracteres",
      "any.required": "La direccion es obligatoria"
    }),
    city: Joi.string().trim().min(2).required().messages({
      "string.empty": "La ciudad es obligatoria",
      "string.min": "La ciudad debe tener al menos 2 caracteres",
      "any.required": "La ciudad es obligatoria"
    }),
    province: Joi.string().trim().min(2).required().messages({
      "string.empty": "La provincia es obligatoria",
      "string.min": "La provincia debe tener al menos 2 caracteres",
      "any.required": "La provincia es obligatoria"
    }),
    zip_code: Joi.string().trim().min(3).required().messages({
      "string.empty": "El codigo postal es obligatorio",
      "string.min": "El codigo postal debe tener al menos 3 caracteres",
      "any.required": "El codigo postal es obligatorio"
    }),
    notes: Joi.string().trim().allow("").optional()
  }).required().messages({
    "any.required": "Los datos de envio son obligatorios"
  })
});
