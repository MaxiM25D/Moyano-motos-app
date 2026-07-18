# Moyano Motos

Sistema web para administrar ventas financiadas de motos y el cobro de cuotas.

## Funcionalidades

- Clientes y motos.
- Eliminacion protegida de clientes, motos y ventas.
- Ventas con planes de 12, 15, 18, 24 o 36 cuotas.
- Seguimiento de cuotas pendientes, vencidas y pagadas.
- Registro de cobranzas, medios de pago e intereses.
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

## Produccion en Render

El archivo `render.yaml` define tres recursos:

- `moyano-motos-demo`: frontend estatico.
- `moyano-motos-api`: API de Express.
- `moyano-motos-db`: PostgreSQL.

La API usa una instancia `starter`, PostgreSQL usa `basic-256mb` con 1 GB y el frontend es un sitio estatico. Render genera la clave JWT, conecta la base de datos y ejecuta las migraciones automaticamente.

Antes de entregar, verifica que ambos servicios esten en `Live`, que `/api/health` responda correctamente y que `CORS_ORIGIN` coincida con el dominio definitivo del frontend.
