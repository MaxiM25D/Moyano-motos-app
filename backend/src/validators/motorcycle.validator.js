import Joi from "joi";

const optionalText = Joi.string().trim().max(100).allow("").optional();

export const createMotorcycleSchema = Joi.object({
  brand: Joi.string().trim().min(2).max(80).required().messages({
    "string.empty": "La marca es obligatoria",
    "string.min": "La marca debe tener al menos 2 caracteres"
  }),
  model: Joi.string().trim().min(1).max(80).required().messages({
    "string.empty": "El modelo es obligatorio"
  }),
  year: Joi.number().integer().min(1950).max(2100).optional(),
  domain: optionalText,
  chassisNumber: optionalText,
  engineNumber: optionalText,
  color: Joi.string().trim().max(50).allow("").optional()
});

export const updateMotorcycleSchema = Joi.object({
  brand: Joi.string().trim().min(2).max(80).optional(),
  model: Joi.string().trim().min(1).max(80).optional(),
  year: Joi.number().integer().min(1950).max(2100).allow(null).optional(),
  domain: optionalText,
  chassisNumber: optionalText,
  engineNumber: optionalText,
  color: Joi.string().trim().max(50).allow("").optional()
}).min(1).messages({
  "object.min": "Debes enviar al menos un campo para actualizar"
});
