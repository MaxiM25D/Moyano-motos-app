import arosAD from "./img/aros-a-d.jpeg";
import cadenaAB1 from "./img/cadena-a-b1.jpg";
import cadenaAD from "./img/cadena-a-d.jpg";
import cadenaPlata from "./img/cadena-plata.jpeg";
import cadenaAD2 from "./img/cadena-a-d2.jpg";
import pulceraAB from "./img/pulcera-a-b.jpg";
import pulceraAD from "./img/pulcera-a-d.jpg";
import anilloAQ from "./img/anillo-a-q.jpeg";
import anilloAB from "./img/anillo-a-b.jpg";
import anilloAD from "./img/anillo-a-d.jpg";
import anilloAB1 from "./img/anillo-a-b1.jpg";

const productos = [
  { id: "1", nombre: "Aros de acero Blanco", precio: 4000, categoria: "aros", img: arosAD },
  { id: "2", nombre: "Aros de acero Dorado", precio: 5000, categoria: "aros", img: arosAD },
  { id: "3", nombre: "Aros de Plata", precio: 7000, categoria: "aros", img: arosAD },
  { id: "4", nombre: "Aros de acero quirurgico", precio: 4500, categoria: "aros", img: arosAD },

  { id: "5", nombre: "Cadena de acero Blanco", precio: 6000, categoria: "cadenas", img: cadenaAB1 },
  { id: "6", nombre: "Cadena de acero Dorado", precio: 6500, categoria: "cadenas", img: cadenaAD },
  { id: "7", nombre: "Cadena de Plata", precio: 7500, categoria: "cadenas", img: cadenaPlata },
  { id: "8", nombre: "Cadena de acero quirurgico", precio: 5000, categoria: "cadenas", img: cadenaAD2 },

  { id: "9", nombre: "Pulcera de acero quirurgico", precio: 3000, categoria: "pulceras", img: pulceraAB },
  { id: "10", nombre: "Pulcera de acero Blanco", precio: 3500, categoria: "pulceras", img: pulceraAD },
  { id: "11", nombre: "Pulcera de acero Dorado", precio: 5000, categoria: "pulceras", img: pulceraAB },
  { id: "12", nombre: "Pulcera de Plata", precio: 5500, categoria: "pulceras", img: pulceraAD },

  { id: "13", nombre: "Anillos de acero quirurgico", precio: 3000, categoria: "anillos", img: anilloAQ },
  { id: "14", nombre: "Anillos de acero Blanco", precio: 3500, categoria: "anillos", img: anilloAB },
  { id: "15", nombre: "Anillos de acero Dorado", precio: 4000, categoria: "anillos", img: anilloAD },
  { id: "16", nombre: "Anillos de Plata", precio: 5000, categoria: "anillos", img: anilloAB1 },
];

export default productos;

export const getProductos = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productos);
    }, 1000);
  });
};

export const getProductoById = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productos.find((prod) => prod.id === id));
    }, 1000);
  });
};

export const getProductosByCategoria = (categoria) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productos.filter((prod) => prod.categoria === categoria));
    }, 1000);
  });
};