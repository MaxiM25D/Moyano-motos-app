# Frontend

Proyecto frontend construido con React 19 y Vite. Esta aplicación utiliza componentes, rutas y servicios para conectar con el backend y administrar un carrito de compras.

## Descripción general

- `index.html`: plantilla HTML principal.
- `package.json`: dependencias, scripts y configuración del proyecto.
- `vite.config.js`: configuración de Vite para desarrollo y build.
- `eslint.config.js`: reglas de linting para el frontend.
- `public/`: recursos estáticos (imágenes, favicon, etc.).
- `src/`: código fuente de la aplicación.
- `src/components/`: componentes reutilizables y páginas.
- `src/context/`: estados globales de aplicación (Auth y Cart).
- `src/data/`: datos estáticos y configuración de Firebase.
- `src/services/`: servicios para integración con APIs y lógica de negocio.

## Scripts disponibles

- `npm install`: instala dependencias.
- `npm run dev`: arranca el servidor de desarrollo de Vite.
- `npm run build`: genera la versión de producción en `dist/`.
- `npm run preview`: previsualiza el build de producción.
- `npm run lint`: ejecuta ESLint sobre el código.

## Estructura completa de la carpeta

frontend/
├── .env
├── .gitignore
├── dist/ # build generado
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public/
│ ├── img/
├── README.md
├── src/
│ ├── App.css
│ ├── App.jsx
│ ├── assets/
│ │ └── img/
│ │ ├── img1.PNG
│ │ ├── Logo-lunek.png
│ │ └── react.svg
│ ├── components/
│ │ ├── Admin/
│ │ │ ├── AdminLayaout/
│ │ │ │ ├── AdminLayout.css
│ │ │ │ └── AdminLayout.jsx
│ │ │ ├── pages/
│ │ │ │ ├── AdminProducts/
│ │ │ │ │ ├── AdminProducts.css
│ │ │ │ │ └── AdminProducts.jsx
│ │ │ │ └── Users/
│ │ │ │ ├── AdminUsers.css
│ │ │ │ └── AdminUsers.jsx
│ │ │ ├── ProductForm/
│ │ │ │ ├── ProductForm.css
│ │ │ │ └── ProductForm.jsx
│ │ │ └── SideBar/
│ │ │ ├── SideBar.css
│ │ │ └── SideBar.jsx
│ │ ├── CartContext/
│ │ │ ├── CartContext.css
│ │ │ └── CartContext.jsx
│ │ ├── Cartwidget/
│ │ │ ├── CartWidget.css
│ │ │ └── CartWidget.jsx
│ │ ├── Footer/
│ │ │ ├── Footer.css
│ │ │ └── Footer.jsx
│ │ ├── Item/
│ │ │ ├── Item.css
│ │ │ └── Item.jsx
│ │ ├── ItemCount/
│ │ │ ├── ItemCount.css
│ │ │ └── ItemCount.jsx
│ │ ├── ItemDetail/
│ │ │ ├── ItemDetail.css
│ │ │ └── ItemDetail.jsx
│ │ ├── ItemDetailContainer/
│ │ │ ├── ItemDetailContainer.css
│ │ │ └── ItemDetailContainer.jsx
│ │ ├── ItemList/
│ │ │ ├── ItemList.css
│ │ │ └── ItemList.jsx
│ │ ├── ItemListContainer/
│ │ │ ├── ItemListContainer.css
│ │ │ └── ItemListContainer.jsx
│ │ ├── Login/
│ │ │ ├── Login.css
│ │ │ └── Login.jsx
│ │ ├── NavBar/
│ │ │ ├── NavBar.css
│ │ │ └── NavBar.jsx
│ │ ├── pages/
│ │ │ ├── Cart/
│ │ │ │ ├── Cart.css
│ │ │ │ └── Cart.jsx
│ │ │ ├── Contacto/
│ │ │ │ ├── Contacto.css
│ │ │ │ └── Contacto.jsx
│ │ │ ├── Inicio/
│ │ │ │ ├── Inicio.css
│ │ │ │ └── Inicio.jsx
│ │ │ └── Store/
│ │ ├── Register/
│ │ │ ├── Register.css
│ │ │ └── Register.jsx
│ │ └── Store/
│ ├── context/
│ │ ├── AuthContext.jsx
│ │ └── CartContext.jsx
│ ├── data/
│ │ ├── categorias.js
│ │ ├── firebaseConfig.js
│ │ ├── img/
│ │ └── productos.js
│ ├── index.css
│ ├── main.jsx
│ └── services/
│ ├── api.js
│ ├── authService.js
│ ├── cart.service.js
│ ├── cloudinary.service.js
│ ├── productService.js
│ └── userService.js
├── vite.config.js

## Notas

- `dist/` se genera al ejecutar `npm run build` y no es necesario versionarlo si el objetivo es mantener sólo el código fuente.
- Si el proyecto requiere variables de entorno para Firebase o API, agrégalas en `.env`.
- El frontend está diseñado para consumir servicios del backend y gestionar carrito, login y administración de productos.
