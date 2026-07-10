import { ClientDTO } from "../dto/client.dto.js";
import { ClientService } from "../services/client.service.js";

const clientService = new ClientService();

const handleError = (res, error) => {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
};

export const getClients = async (req, res) => {
  try {
    const clients = await clientService.getClients(req.query.search);
    res.json({
      message: "Clientes obtenidos",
      clients: clients.map((client) => new ClientDTO(client))
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    res.json({
      message: "Cliente encontrado",
      client: new ClientDTO(client)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createClient = async (req, res) => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json({
      message: "Cliente creado",
      client: new ClientDTO(client)
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
    res.json({
      message: "Cliente actualizado",
      client: new ClientDTO(client)
    });
  } catch (error) {
    handleError(res, error);
  }
};
