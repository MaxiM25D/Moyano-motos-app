import { MotorcycleRepository } from "../repositories/motorcycle.repository.js";
import { HttpError } from "../utils/httpError.js";
import { buildPagination, parsePagination } from "../utils/pagination.js";

const motorcycleRepository = new MotorcycleRepository();

const uniqueFields = [
  ["domain", "Ya existe una moto con ese dominio"],
  ["chassisNumber", "Ya existe una moto con ese numero de chasis"],
  ["engineNumber", "Ya existe una moto con ese numero de motor"]
];

const validateId = (id) => {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new HttpError("ID de moto invalido", 400);
  }
  return parsedId;
};

export class MotorcycleService {
  async getMotorcycles(query = {}) {
    const { page, pageSize, skip } = parsePagination(query);
    const { motorcycles, total } = await motorcycleRepository.getMotorcycles({
      search: query.search?.trim(),
      available: query.available === "true",
      skip,
      take: pageSize
    });

    return { motorcycles, pagination: buildPagination(total, page, pageSize) };
  }

  async getMotorcycleById(id) {
    validateId(id);

    const motorcycle = await motorcycleRepository.getMotorcycleById(id);
    if (!motorcycle) throw new HttpError("Moto no encontrada", 404);

    return motorcycle;
  }

  async createMotorcycle(data) {
    await this.validateUniqueFields(data);
    return motorcycleRepository.createMotorcycle(data);
  }

  async updateMotorcycle(id, data) {
    validateId(id);

    const motorcycle = await motorcycleRepository.getMotorcycleById(id);
    if (!motorcycle) throw new HttpError("Moto no encontrada", 404);

    await this.validateUniqueFields(data, motorcycle.id);
    return motorcycleRepository.updateMotorcycle(id, data);
  }

  async deleteMotorcycle(id) {
    validateId(id);

    const motorcycle = await motorcycleRepository.getMotorcycleById(id);
    if (!motorcycle) throw new HttpError("Moto no encontrada", 404);

    const sale = await motorcycleRepository.getSaleByMotorcycleId(id);
    if (sale) {
      throw new HttpError("No se puede eliminar una moto con una venta registrada", 409);
    }

    return motorcycleRepository.deleteMotorcycle(id);
  }

  async validateUniqueFields(data, currentMotorcycleId = null) {
    for (const [field, message] of uniqueFields) {
      if (!data[field]) continue;

      const motorcycle = await motorcycleRepository.getMotorcycleByUniqueField(field, data[field]);
      if (motorcycle && motorcycle.id !== currentMotorcycleId) {
        throw new HttpError(message, 409);
      }
    }
  }
}
