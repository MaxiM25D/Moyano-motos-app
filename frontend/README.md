# Frontend

Este proyecto frontend está construido con React y Vite. A continuación se describe la estructura principal de la carpeta `frontend`.

## Estructura de carpetas y archivos

frontend/

- eslint.config.js
- index.html
- package.json
- README.md
- vite.config.js
- public/
- src/
  - App.css
  - App.jsx
  - index.css
  - main.jsx
  - assets/
    - img/
  - components/
    - Admin/
      - AdminLayaout/
      - ProductForm/
      - SideBar/
    - Cartwidget/
      - CartWidget.css
      - CartWidget.jsx
    - Footer/
      - Footer.css
      - Footer.jsx
    - Item/
      - Item.css
      - Item.jsx
    - ItemDetailContainer/
      - ItemDetailContainer.css
      - ItemDetailContainer.jsx
    - ItemList/
      - ItemList.css
      - ItemList.jsx
    - ItemListContainer/
      - ItemListContainer.css
      - ItemListContainer.jsx
    - Login/
      - Login.css
      - Login.jsx
    - NavBar/
      - NavBar.css
      - NavBar.jsx
    - pages/
      - Admin/
      - Carrito/
      - Contacto/
      - Inicio/
      - Store/
    - Store/
  - data/
    - productos.js
    - img/
  - services/
    - api.js
    - authService.js
    - cart.service.js
    - cloudinary.service.js
    - productService.js

## Descripción general

- `index.html`: entrada principal del HTML.
- `package.json`: dependencias y scripts del frontend.
- `vite.config.js`: configuración de Vite.
- `public/`: archivos estáticos disponibles directamente en la aplicación.
- `src/`: código fuente de la aplicación.
- `src/components/`: componentes reutilizables y páginas.
- `src/data/`: datos locales y recursos de imagen.
- `src/services/`: servicios para llamadas a APIs y lógica de integración.

src/
├── services/
│ ├── cloudinary.service.js ← reemplaza el que tenías vacío
│ └── userService.js ← nuevo
├── components/
│ └── Admin/
│ ├── AdminLayout/
│ │ ├── AdminLayout.jsx
│ │ └── AdminLayout.css
│ ├── SideBar/
│ │ ├── SideBar.jsx
│ │ └── SideBar.css
│ ├── ProductForm/
│ │ ├── ProductForm.jsx
│ │ └── ProductForm.css
│ └── pages/
│ ├── products/
│ │ ├── AdminProducts.jsx
│ │ └── AdminProducts.css
│ └── users/
│ ├── AdminUsers.jsx
│ └── AdminUsers.css
