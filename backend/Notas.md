Orden recomendado de trabajo

1. Definir schema.prisma.
2. Crear migración inicial.
3. Crear módulos base: clients, motorcycles, sales, installments.
4. Implementar generación automática de cuotas.
5. Implementar pago de cuotas.
6. Implementar vencimientos.
7. Implementar recibos.
8. Implementar reportes.
9. Agregar roles y permisos finos.

10. Estructura De Carpetas
    La base que ya veníamos armando tiene sentido:
    backend/
    ├── prisma/
    │ ├── schema.prisma
    │ └── migrations/
    ├── scripts/
    ├── src/
    │ ├── config/
    │ ├── controllers/
    │ ├── dto/
    │ ├── generated/
    │ ├── middlewares/
    │ ├── repositories/
    │ ├── routes/
    │ ├── server/
    │ ├── services/
    │ ├── utils/
    │ └── validators/
    ├── app.js
    ├── package.json
    └── prisma.config.ts
    Responsabilidad de cada capa:
    routes Define endpoints HTTP.
    controllers Recibe request/response, no lógica pesada.
    services Casos de uso y reglas de negocio.
    repositories Acceso a Prisma/Base de datos.
    dto Formato de respuestas.
    validators Validación de inputs.
    middlewares Auth, roles, errores, validaciones.
    utils Helpers reutilizables.
    config DB, env, auth, etc.
11. Modelo De Base De Datos
    Entidades principales:
    User
    Client
    Motorcycle
    Sale
    Installment
    Payment
    Receipt
    Opcionales para más adelante:
    Expense
    CashMovement
    Notification
    AuditLog
    Modelo conceptual:
    User

- id
- name
- email
- password
- role
- active
- createdAt

Client

- id
- name
- dni
- phone
- address
- notes
- createdAt

Motorcycle

- id
- brand
- model
- year
- domain / patent
- chassisNumber
- engineNumber
- color
- createdAt

Sale

- id
- clientId
- motorcycleId
- sellerId
- salePrice
- downPayment
- financedAmount
- installmentPlan
- installmentAmount
- status
- saleDate
- createdAt

Installment

- id
- saleId
- number
- amount
- dueDate
- status
- paidAt
- createdAt

Payment

- id
- installmentId
- userId
- amount
- paymentMethod
- paidAt
- notes

Receipt

- id
- paymentId
- receiptNumber
- printedAt
- createdAt

3. Relaciones Entre Tablas
   Client 1 ── N Sale
   Motorcycle 1 ── 1 Sale
   Sale 1 ── N Installment
   Installment 1 ── 0/1 Payment
   Payment 1 ── 0/1 Receipt
   User 1 ── N Sale
   User 1 ── N Payment
   Idea simple:
   Un cliente puede comprar varias motos.
   Una venta pertenece a un cliente.
   Una venta genera cuotas.
   Cada cuota puede estar pendiente, pagada o vencida.
   Cada pago puede emitir un recibo.
   Cada venta y cada pago quedan asociados a un usuario del sistema.
4. Casos De Uso
   Primera etapa, núcleo del negocio:
   Clientes

- Crear cliente.
- Editar cliente.
- Buscar cliente por nombre, DNI o teléfono.
- Ver historial del cliente.

Ventas

- Registrar moto vendida.
- Registrar venta.
- Cargar entrega.
- Elegir plan: 12, 15, 18, 24 o 36 cuotas.
- Generar cuotas automáticamente.

Cuotas

- Listar cuotas de una venta.
- Registrar pago de cuota.
- Marcar cuotas vencidas.
- Ver cuotas pendientes.
- Ver cuotas vencidas.

Recibos

- Generar recibo por pago.
- Imprimir recibo.
- Consultar recibos emitidos.

Reportes

- Cobrado por día.
- Cobrado por mes.
- Cuotas vencidas.
- Deuda total pendiente.
- Ventas financiadas.
- Pagos por método.

5. Roles De Usuario
   Arrancaría con 3 roles:
   admin

- Acceso total.
- Gestiona usuarios.
- Ve reportes completos.
- Puede modificar ventas/pagos sensibles.

seller

- Registra clientes.
- Registra ventas.
- Consulta cuotas.
- No elimina pagos.

collector

- Registra pagos.
- Imprime recibos.
- Ve cuotas vencidas.
- Ve cobranzas propias.
  Más adelante se puede agregar:
  viewer
- Solo lectura.

6. APIs
   Propuesta inicial:
   /auth
   POST /auth/login
   POST /auth/logout
   GET /auth/current

/users
GET /users
POST /users
PATCH /users/:id
PATCH /users/:id/status

/clients
GET /clients?search=
GET /clients/:id
POST /clients
PATCH /clients/:id

/motorcycles
GET /motorcycles
GET /motorcycles/:id
POST /motorcycles
PATCH /motorcycles/:id

/sales
GET /sales
GET /sales/:id
POST /sales
GET /sales/:id/installments

/installments
GET /installments/pending
GET /installments/overdue
PATCH /installments/:id/pay

/payments
GET /payments
GET /payments/:id

/receipts
GET /receipts/:id
POST /receipts/:paymentId/print

/reports
GET /reports/collections/daily
GET /reports/collections/monthly
GET /reports/installments/overdue
GET /reports/debt
GET /reports/sales 7. Reportes
Reportes mínimos útiles para el cliente:
Cobranzas del día

- Total cobrado.
- Cantidad de cuotas cobradas.
- Método de pago.
- Usuario que cobró.

Cobranzas mensuales

- Total del mes.
- Comparación por día.
- Cantidad de clientes que pagaron.

Cuotas vencidas

- Cliente.
- DNI.
- Teléfono.
- Moto.
- Número de cuota.
- Fecha de vencimiento.
- Días de atraso.
- Monto.

Deuda pendiente

- Total financiado pendiente.
- Total vencido.
- Total por vencer.

Ventas financiadas

- Cantidad de ventas.
- Monto total vendido.
- Monto financiado.
- Entregas recibidas.
