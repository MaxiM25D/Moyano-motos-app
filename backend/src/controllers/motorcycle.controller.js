import { MotorcycleDTO } from "../dto/motorcycle.dto.js";
import { MotorcycleService } from "../services/motorcycle.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const motorcycleService = new MotorcycleService();

export const getMotorcycles = async (req, res) => {
  try {
    const motorcycles = await motorcycleService.getMotorcycles(req.query.search);
    return sendSuccess(res, "Motos obtenidas", {
      motorcycles: motorcycles.map((motorcycle) => new MotorcycleDTO(motorcycle))
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getMotorcycleById = async (req, res) => {
  try {
    const motorcycle = await motorcycleService.getMotorcycleById(req.params.id);
    return sendSuccess(res, "Moto encontrada", {
      motorcycle: new MotorcycleDTO(motorcycle)
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const createMotorcycle = async (req, res) => {
  try {
    const motorcycle = await motorcycleService.createMotorcycle(req.body);
    return sendSuccess(res, "Moto creada", {
      motorcycle: new MotorcycleDTO(motorcycle)
    }, 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateMotorcycle = async (req, res) => {
  try {
    const motorcycle = await motorcycleService.updateMotorcycle(req.params.id, req.body);
    return sendSuccess(res, "Moto actualizada", {
      motorcycle: new MotorcycleDTO(motorcycle)
    });
  } catch (error) {
    return sendError(res, error);
  }
};
