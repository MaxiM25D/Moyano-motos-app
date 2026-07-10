import { ClientRepository } from "../repositories/client.repository.js";
import { HttpError } from "../utils/httpError.js";

const clientRepository = new ClientRepository();

export class ClientService {
  getClients(search) {
    return clientRepository.getClients(search);
  }

  async getClientById(id) {
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
    const client = await clientRepository.getClientById(id);
    if (!client) throw new HttpError("Cliente no encontrado", 404);

    if (data.dni && data.dni !== client.dni) {
      const existingClient = await clientRepository.getClientByDni(data.dni);
      if (existingClient) throw new HttpError("Ya existe un cliente con ese DNI", 409);
    }

    return clientRepository.updateClient(id, data);
  }
}
