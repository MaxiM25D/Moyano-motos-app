import { MotorcycleDTO } from "../dto/motorcycle.dto.js";
import { MotorcycleService } from "../services/motorcycle.service.js";

const motorcycleService = new MotorcycleService();

const handleError = (res, error) => {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
};

export const getMotorcycles = async (req, res) => {
  try {
    const motorcycles = await motorcycleService.getMotorcycles(req.query.search);
    res.json({
      message: "Motos obtenidas",
      motorcycles: motorcycles.map((motorcycle) => new MotorcycleDTO(motorcycle))
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getMotorcycleById = async (req, res) => {
  try {
    const motorcycle = await motorcycleService.getMotorcycleById(req.params.id);
    res.json({
      message: "Moto encontrada",
      motorcycle: new MotorcycleDTO(motorcycle)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createMotorcycle = async (req, res) => {
  try {
    const motorcycle = await motorcycleService.createMotorcycle(req.body);
    res.status(201).json({
      message: "Moto creada",
      motorcycle: new MotorcycleDTO(motorcycle)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateMotorcycle = async (req, res) => {
  try {
    const motorcycle = await motorcycleService.updateMotorcycle(req.params.id, req.body);
    res.json({
      message: "Moto actualizada",
      motorcycle: new MotorcycleDTO(motorcycle)
    });
  } catch (error) {
    handleError(res, error);
  }
};
