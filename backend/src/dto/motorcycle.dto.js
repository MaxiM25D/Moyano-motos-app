export class MotorcycleDTO {
  constructor(motorcycle) {
    this.id = motorcycle.id;
    this.brand = motorcycle.brand;
    this.model = motorcycle.model;
    this.year = motorcycle.year;
    this.domain = motorcycle.domain;
    this.chassisNumber = motorcycle.chassisNumber;
    this.engineNumber = motorcycle.engineNumber;
    this.color = motorcycle.color;
    this.createdAt = motorcycle.createdAt;
    this.updatedAt = motorcycle.updatedAt;
  }
}
