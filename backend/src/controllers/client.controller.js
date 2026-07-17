import { ClientDTO } from "../dto/client.dto.js";
import { ClientService } from "../services/client.service.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const clientService = new ClientService();

export const getClients = async (req, res) => {
  try {
    const clients = await clientService.getClients(req.query.search);
    return sendSuccess(res, "Clientes obtenidos", {
      clients: clients.map((client) => new ClientDTO(client))
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    return sendSuccess(res, "Cliente encontrado", {
      client: new ClientDTO(client)
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const createClient = async (req, res) => {
  try {
    const client = await clientService.createClient(req.body);
    return sendSuccess(res, "Cliente creado", {
      client: new ClientDTO(client)
    }, 201);
  } catch (error) {
    return sendError(res, error);
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
    return sendSuccess(res, "Cliente actualizado", {
      client: new ClientDTO(client)
    });
  } catch (error) {
    return sendError(res, error);
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await clientService.deleteClient(req.params.id);
    return sendSuccess(res, "Cliente eliminado", {
      client: new ClientDTO(client)
    });
  } catch (error) {
    return sendError(res, error);
  }
};
