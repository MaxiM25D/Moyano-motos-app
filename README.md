# Moyano Motos

Sistema web para administrar ventas financiadas de motos y el cobro de cuotas.

## Funcionalidades

- Clientes y motos.
- Ventas con planes de 12, 15, 18, 24 o 36 cuotas.
- Seguimiento de cuotas pendientes, vencidas y pagadas.
- Registro de cobranzas y medios de pago.
- Recibos imprimibles.
- Reportes de ventas, deuda y cobranzas.
- Usuarios con roles de administrador, vendedor y cobrador.

## Tecnologias

- Frontend: React, Vite, React Router y Axios.
- Backend: Node.js, Express, Prisma y JWT.
- Base de datos: PostgreSQL.

## Desarrollo local

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173` y la API en `http://localhost:8000/api`.

## Demo en Render

El archivo `render.yaml` define tres recursos para una demostracion:

- `moyano-motos-demo`: frontend estatico.
- `moyano-motos-api`: API de Express.
- `moyano-motos-db`: PostgreSQL.

En Render, crea un nuevo Blueprint, conecta este repositorio y selecciona `render.yaml`. Render genera las claves secretas, conecta la base de datos y ejecuta las migraciones automaticamente.

Cuando termine el primer despliegue, crea el administrador inicial con `POST /api/users/bootstrap-admin`. Usa datos ficticios y una clave exclusiva para la demostracion.
