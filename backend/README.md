## Estructura del proyecto

src
│
├── config
├── controllers
├── dao
├── dto
├── middlewares
├── models
├── repositories
├── router
├── server
├── services
├── utils
└── validators

Tenés una separación clara de responsabilidades:

Controller → recibe la petición.
Service → lógica de negocio.
Repository → comunicación con la base.
DAO → acceso directo a los datos.
DTO → respuesta al frontend.
Validators → validaciones.
Utils → helpers.

backend/
|-- prisma/
| |-- migrations/
| | |-- 20260708234125_init/
| | | +-- migration.sql
| | +-- migration_lock.toml
| +-- schema.prisma
|-- scripts/
| +-- seedProducts.js
|-- src/
| |-- config/
| |-- controllers/
| |-- dto/
| |-- generated/
| |-- middlewares/
| |-- repositories/
| |-- router/
| | |-- routes/
| | | |-- auth.router.js
| | | |-- cart.router.js
| | | |-- contact.router.js
| | | |-- order.router.js
| | | |-- product.router.js
| | | +-- user.router.js
| | +-- routes.js
| |-- routes/
| |-- server/
| | +-- server.app.js
| |-- services/
| |-- utils/
| +-- validators/
|-- app.js
|-- package.json
|-- package-lock.json
+-- prisma.config.ts

routes Define endpoints HTTP.
controllers Recibe request/response, no lógica pesada.
services Casos de uso y reglas de negocio.
repositories Acceso a Prisma/Base de datos.
dto Formato de respuestas.
validators Validación de inputs.
middlewares Auth, roles, errores, validaciones.
utils Helpers reutilizables.
config DB, env, auth, etc.
