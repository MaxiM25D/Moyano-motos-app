backend/
│
├── src/
│ ├── config/
│ │ └── db.js
│ │
│ ├── controllers/
│ │ ├── products.controller.js
│ │ ├── users.controller.js
│ │ └── auth.controller.js
│ │
│ ├── routes/
│ │ ├── products.routes.js
│ │ ├── users.routes.js
│ │ └── auth.routes.js
│ │
│ ├── models/
│ │ ├── product.model.js
│ │ └── user.model.js
│ │
│ ├── middlewares/
│ │ └── auth.middleware.js
│ │
│ ├── utils/
│ │ ├── bcrypt.js
│ │ └── jwt.js
│ │
│ └── app.js
│
├── .env
├── server.js
└── package.json

MongoDB – Colecciones
Users
{
first_name,
last_name,
email,
password,
role: "user" | "admin",
cart: ObjectId
}

Products
{
title,
description,
price,
stock,
category,
thumbnail
}

Carts
{
products: [
{
product: ObjectId,
quantity: Number
}
]
}

<!--  -->Separación de responsabilidades <!--  -->

Model → solo DB

Manager → lógica de negocio

Controller → maneja request/response

Route → conecta endpoint con controller

Frontend → solo consume JSON

React
↓
productService
↓
api.js (interceptor agrega token)
↓
Backend Express
↓
MongoDB
↓
Devuelve productos

React Router
↓
useParams() obtiene categoriaId
↓
Llama getProductsByCategory()
↓
Axios llama al backend
↓
Controller lee req.query.category
↓
Manager consulta Mongo
↓
Mongo devuelve productos filtrados
↓
React renderiza

PALETAS DE COLORES:
Base: #E8DED2

Secciones: #D8CFC3

Cards suaves: #CFC3B6

Texto principal: #1E1E1E

Dorado detalle: #B89B72

Hover: negro o #B89B72
