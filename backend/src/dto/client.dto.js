export class ClientDTO {
  constructor(client) {
    this.id = client.id;
    this.name = client.name;
    this.dni = client.dni;
    this.phone = client.phone;
    this.address = client.address;
    this.notes = client.notes;
    this.createdAt = client.createdAt;
    this.updatedAt = client.updatedAt;
  }
}
