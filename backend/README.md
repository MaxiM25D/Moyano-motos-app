# Moyano Motos - Backend

API REST para administrar clientes, motos, ventas financiadas, cuotas, pagos, recibos, reportes y usuarios.

## Tecnologias

- Node.js y Express.
- Prisma ORM.
- PostgreSQL.
- JWT y roles de usuario.
- Joi para validaciones.

## Arquitectura

```text
src/
|-- config/
|-- controllers/
|-- dto/
|-- middlewares/
|-- repositories/
|-- router/
|-- server/
|-- services/
|-- utils/
+-- validators/
```

Los controladores manejan HTTP, los servicios contienen las reglas de negocio y los repositorios concentran el acceso a Prisma.

## Variables de entorno

```env
PORT=8000
DATABASE_URL=postgresql://usuario:password@localhost:5432/moyano_motos
JWT_SECRET=una_clave_segura
CORS_ORIGIN=http://localhost:5173
```

## Comandos

```bash
npm install
npx prisma migrate dev
npm run dev
```
