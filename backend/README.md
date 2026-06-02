## Estructura del proyecto

category → accesorios | marroquineria
subcategory → aros | cadenas | pulseras | piercing | carteras | cintos
type → sets (solo cuando es conjunto)

{
"title": "Aros Corazón",
"category": "accesorios",
"subcategory": "aros",
"type": null
}
Set de cadenas
{
"title": "Set Cadena + Pulsera",
"category": "accesorios",
"subcategory": "cadenas",
"type": "sets"
}
Cartera
{
"title": "Cartera Bandolera",
"category": "marroquineria",
"subcategory": "carteras",
"type": null
}

ROUTES → CONTROLLER → MANAGER → MODEL (MongoDB)
-El manager habla con la base.
-El controller habla con el cliente.

ROUTES
↓
CONTROLLER (maneja HTTP)
↓
MANAGER (habla con Mongo)
↓
MODEL (schema Mongoose mongoDB)

Autenticación:
LOGIN → CONTROLLER → MANAGER → bcrypt → jwt → respuesta

Validación:
/current → passport jwt strategy → controller

POST /api/carts/:cid/product/:pid
↓ routes/cart.routes.js
↓ cart.controller.js
↓ cart.manager.js
↓ cart.model.js
↓ MongoDB

backend/
│
├── node_modules/
│
├── src/
│ │
│ ├── config/
│ │ ├── db/
│ │ │ └── connect.config.js
│ │ ├── auth/
│ │ │ └── passport.config.js
│ │ └── env.config.js
│ │
│ ├── controllers/
│ │ ├── cart.controller.js
│ │ ├── product.controller.js
│ │ ├── user.controller.js
│ │ └── auth.controller.js
│ │
│ ├── managers/
│ │ ├── cart.manager.js
│ │ ├── product.manager.js
│ │ └── user.manager.js
│ │
│ ├── middlewares/
│ │ ├── auth.middleware.js
│ │ ├── jwt.middleware.js
│ │ ├── role.middleware.js
│ │
│ ├── models/
│ │ ├── cart.model.js  
│ │ ├── product.model.js
│ │ └── user.model.js
│ │
│ ├── router/
│ │ ├── routes/
│ │ │ ├── cart.router.js  
│ │ │ ├── product.router.js  
│ │ │ ├── user.router.js  
│ │ │ └── auth.router.js
│ │ └── routes.js  
│ │
│ ├── server/
│ │ └── server.app.js
│ │
│ ├── utils/
│ │ ├── jwt.j
│ │ └── bcrypt.js
│ └── app.js
│
├── .env
├── .gitignore
├── package.json
└── package-lock.json

## MODELO DE PRODUCTOS:

{
"title": "Aros Corazón Dorado",
"slug": "aros-corazon-dorado",
"category": "accesorios",
"subcategory": "aros",
"type": null,
"isFeatured": true,
"featuredOrder": 1,
"brand": "LUNEK",
"tags": ["aros", "accesorio", "dorado"],
"price": 8500,
"stock": 10,
"images": [
"https://res.cloudinary.com/xxxx/aros.jpg"
]
}
