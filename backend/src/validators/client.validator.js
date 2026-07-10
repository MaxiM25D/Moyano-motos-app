import Joi from "joi";

export const createClientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 2 caracteres"
  }),
  dni: Joi.string().trim().pattern(/^[0-9]{7,11}$/).required().messages({
    "string.empty": "El DNI es obligatorio",
    "string.pattern.base": "El DNI debe contener entre 7 y 11 numeros"
  }),
  phone: Joi.string().trim().min(6).max(30).required().messages({
    "string.empty": "El telefono es obligatorio",
    "string.min": "El telefono debe tener al menos 6 caracteres"
  }),
  address: Joi.string().trim().max(150).allow("").optional(),
  notes: Joi.string().trim().max(500).allow("").optional()
});

export const updateClientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  dni: Joi.string().trim().pattern(/^[0-9]{7,11}$/).optional().messages({
    "string.pattern.base": "El DNI debe contener entre 7 y 11 numeros"
  }),
  phone: Joi.string().trim().min(6).max(30).optional(),
  address: Joi.string().trim().max(150).allow("").optional(),
  notes: Joi.string().trim().max(500).allow("").optional()
}).min(1).messages({
  "object.min": "Debes enviar al menos un campo para actualizar"
});
