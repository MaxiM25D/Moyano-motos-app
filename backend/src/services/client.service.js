import { ClientRepository } from "../repositories/client.repository.js";
import { HttpError } from "../utils/httpError.js";

const clientRepository = new ClientRepository();

const validateId = (id) => {
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new HttpError("ID de cliente invalido", 400);
  }
  return parsedId;
};

export class ClientService {
  getClients(search) {
    return clientRepository.getClients(search);
  }

  async getClientById(id) {
    validateId(id);
    const client = await clientRepository.getClientById(id);
    if (!client) throw new HttpError("Cliente no encontrado", 404);
    return client;
  }

  async createClient(data) {
    const existingClient = await clientRepository.getClientByDni(data.dni);
    if (existingClient) throw new HttpError("Ya existe un cliente con ese DNI", 409);

    return clientRepository.createClient(data);
  }

  async updateClient(id, data) {
    validateId(id);
    const client = await clientRepository.getClientById(id);
    if (!client) throw new HttpError("Cliente no encontrado", 404);

    if (data.dni && data.dni !== client.dni) {
      const existingClient = await clientRepository.getClientByDni(data.dni);
      if (existingClient) throw new HttpError("Ya existe un cliente con ese DNI", 409);
    }

    return clientRepository.updateClient(id, data);
  }

  async deleteClient(id) {
    validateId(id);

    const client = await clientRepository.getClientById(id);
    if (!client) throw new HttpError("Cliente no encontrado", 404);

    const salesCount = await clientRepository.countSales(id);
    if (salesCount > 0) {
      throw new HttpError("No se puede eliminar un cliente con ventas registradas", 409);
    }

    return clientRepository.deleteClient(id);
  }
}
