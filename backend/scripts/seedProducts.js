import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../src/models/product.model.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const baseUrl = "https://res.cloudinary.com/dvezltuwq/image/upload/f_auto,q_auto/";

// ⬇️ PEGÁ ACA EL ARRAY products
const products = [
  {
    title: "Cinto Hebilla Chapon",
    slug: "cinto-hebilla-chapon",
    category: "Cinto",
    description: "Cinto con hebilla chapón grande y elegante. Color mmarron, negro y diferentes hebillas.",
    price: 18700,
    stock: 5,
    images: [`${baseUrl}cinto-hebilla-chapon`]
  },
  {
    title: "Cinto Negro Hebilla Serpiente",
    slug: "cinto-negro-hebilla-serpiente",
    category: "Cinto",
    description: "Cinto elegante ideal para uso diario.",
    price: 16700,
    stock: 1,
    images: [`${baseUrl}cinto-negro-hebilla-serpiente`]
  },
  {
    title: "Cinto Negro Hebilla Flor",
    slug: "cinto-negro-hebilla-flor",
    category: "Cinto",
    description: "Cinto con detalle de hebilla dorada.",
    price: 17400,
    stock: 1,
    images: [`${baseUrl}cinto-negro-hebilla-flor`]
  },
  {
    title: "Cinto Hebilla Diesel",
    slug: "cinto-hebilla-diesel",
    category: "Cinto",
    description: "Cinto elegante con hebilla plateada.",
    price: 15600,
    stock: 2,
    images: [`${baseUrl}cinto-hebilla-diesel`]
  },
  {
    title: "Anillo Dorado Dos Gotas",
    slug: "anillo-dorado-dos-gotas",
    category: "Anillo",
    description: "Material: Acero. Color: Dorado. Medida: 18mm.",
    price: 11400,
    stock: 1,
    images: [`${baseUrl}anillo-dorado-dos-gotas`]
  },
  {
    title: "Anillo Dorado Cruzado con Cubic",
    slug: "anillo-dorado-cruzado-con-cubic",
    category: "Anillo",
    description: "Material: Acero. Color: Dorado. Medida: 16mm.",
    price: 16100,
    stock: 1,
    images: [`${baseUrl}anillo-dorado-cruzado-con-cubic`]
  },
  {
    title: "Anillo Nudo",
    slug: "anillo-nudo",
    category: "Anillo",
    description: "Material: Acero. Color: Blanco. Medida: 17mm.",
    price: 11900,
    stock: 1,
    images: [`${baseUrl}anillo-nudo`]
  },
  {
    title: "Anillo Dorado Chunky",
    slug: "anillo-dorado-chunky",
    category: "Anillo",
    description: "Material: Acero. Color: Dorado. Medida: 17mm.",
    price: 14500,
    stock: 1,
    images: [`${baseUrl}anillo-dorado-chunky`]
  },
  {
    title: "Anillo Dorado Micropave",
    slug: "anillo-dorado-micropave",
    category: "Anillo",
    description: "Material: Acero. Color: Dorado. Medida: 17mm.",
    price: 16000,
    stock: 1,
    images: [`${baseUrl}anillo-dorado-micropave`]
  },
  {
    title: "Aros Dorado Media Caña",
    slug: "aros-dorado-media-cana",
    category: "Aros",
    description: "Material: Acero. Color: Dorado. Medida: 1.5mm.",
    price: 7100,
    stock: 3,
    images: [`${baseUrl}aros-dorado-media-cana`]
  },
  {
    title: "Argollitas Doradas 1.8cm",
    slug: "argollitas-doradas-1-8cm",
    category: "Aros",
    description: "Material: Acero. Color: Dorado. Medida: 1.8mm.",
    price: 7500,
    stock: 2,
    images: [`${baseUrl}argollitas-doradas-1-8cm`]
  },
  {
    title: "Argollitas Doradas 1cm",
    slug: "argollitas-doradas-1cm",
    category: "Aros",
    description: "Material: Acero. Color: Dorado. Medida: 1mm.",
    price: 7500,
    stock: 2,
    images: [`${baseUrl}argollitas-doradas-1cm`]
  },
  {
    title: "Aros Irregulares",
    slug: "aros-irregulares",
    category: "Aros",
    description: "Material: Acero. Color: Dorado. Medida: 2cm.",
    price: 5900,
    stock: 2,
    images: [`${baseUrl}aros-irregulares`]
  },
  {
    title: "Aros Cuadrados Calados Empedrado",
    slug: "aros-cuadrados-calados-empedrado",
    category: "Aros",
    description: "Material: Acero. Color: Dorado. Medida: 18mm.",
    price: 11200,
    stock: 1,
    images: [`${baseUrl}aros-cuadrados-calados-empedrado`]
  },
  {
    title: "Argollitas Combinadas Labradas 1.2cm",
    slug: "argollitas-combinadas-labradas-1-2cm",
    category: "Aros",
    description: "Argollitas combinadas labradas de 1.2 cm.",
    price: 10400,
    stock: 1,
    images: [`${baseUrl}argollitas-combinadas-labradas-1-2cm`]
  },
  {
    title: "Aros Cubano Italiano Flor con Cubic 1.5cm",
    slug: "aros-cubano-italiano-flor-con-cubic",
    category: "Aros",
    description: "Material: Acero. Color: Dorado. Medida: 1.5cm.",
    price: 16000,
    stock: 1,
    images: [`${baseUrl}aros-cubano-italiano-flor-con-cubic`]
  },
  {
    title: "Aros Dona Combinada",
    slug: "aros-dona-combinada",
    category: "Aros",
    description: "Material: Acero. Color: Dorado. Medida: 18mm.",
    price: 17400,
    stock: 1,
    images: [`${baseUrl}aros-dona-combinada`]
  },
  {
    title: "Aros Nudo Combinado",
    slug: "aros-nudo-combinado",
    category: "Aros",
    description: "Material: Acero. Color: Dorado. Medida: 18mm.",
    price: 17400,
    stock: 1,
    images: [`${baseUrl}aros-nudo-combinado`]
  },
  {
    title: "Conjunto Dorado con Perla 45 a 50cm",
    slug: "conjunto-dorado-con-perla-45-50cm",
    category: "Conjunto",
    description: "Conjunto dorado con perla regulable 45 a 50 cm.",
    price: 20000,
    stock: 1,
    images: [`${baseUrl}conjunto-dorado-con-perla-45-50cm`]
  },
  {
    title: "Conjunto Dorado Corazón con Cubic 45 a 50cm",
    slug: "conjunto-dorado-corazon-con-cubic-45-50cm",
    category: "Conjunto",
    description: "Conjunto dorado corazón con cubic regulable.",
    price: 19300,
    stock: 1,
    images: [`${baseUrl}conjunto-dorado-corazon-con-cubic-45-50cm`]
  },
  {
    title: "Conjunto Perlas 6mm 40cm",
    slug: "conjunto-perlas-6mm-40cm",
    category: "Conjunto",
    description: "Conjunto de perlas 6mm 40 cm.",
    price: 19200,
    stock: 1,
    images: [`${baseUrl}conjunto-perlas-6mm-40cm`]
  },
  {
    title: "Cadena Bolitas 2 y 4mm 50cm",
    slug: "cadena-bolitas-2-4mm-50cm",
    category: "Cadena",
    description: "Cadena bolitas 2 y 4 mm 50 cm.",
    price: 10500,
    stock: 1,
    images: [`${baseUrl}cadena-bolitas-2-4mm-50cm`]
  },
  {
    title: "Conjunto Mariposa Rosa 45 a 50cm",
    slug: "conjunto-mariposa-rosa-45-50cm",
    category: "Conjunto",
    description: "Conjunto mariposa rosa regulable.",
    price: 18300,
    stock: 1,
    images: [`${baseUrl}conjunto-mariposa-rosa-45-50cm`]
  },
  {
    title: "Pulsera Dorada Grumet 6mm 20cm",
    slug: "pulsera-dorada-grumet-6mm-20cm",
    category: "Pulsera",
    description: "Pulsera dorada grumet 6 mm 20 cm.",
    price: 9300,
    stock: 1,
    images: [`${baseUrl}pulsera-dorada-grumet-6mm-20cm`]
  },
  {
    title: "Pulsera Dorada Bolitas 6mm 18cm",
    slug: "pulsera-dorada-bolitas-6mm-18cm",
    category: "Pulsera",
    description: "Pulsera dorada bolitas 6 mm 18 cm.",
    price: 10200,
    stock: 1,
    images: [`${baseUrl}pulsera-dorada-bolitas-6mm-18cm`]
  },
  {
    title: "Pulsera Dorada Eslabones 19cm",
    slug: "pulsera-dorada-eslabones-19cm",
    category: "Pulsera",
    description: "Pulsera dorada eslabones 19 cm.",
    price: 14800,
    stock: 1,
    images: [`${baseUrl}pulsera-dorada-eslabones-19cm`]
  },
  {
    title: "Pulsera Eslabones 19cm",
    slug: "pulsera-eslabones-19cm",
    category: "Pulsera",
    description: "Pulsera eslabones 19 cm.",
    price: 14800,
    stock: 1,
    images: [`${baseUrl}pulsera-eslabones-19cm`]
  },
  {
    title: "Conjunto Bolitas 45 a 50cm",
    slug: "conjunto-bolitas-45-50cm",
    category: "Conjunto",
    description: "Conjunto bolitas regulable 45 a 50 cm.",
    price: 17000,
    stock: 1,
    images: [`${baseUrl}conjunto-bolitas-45-50cm`]
  },
  {
    title: "Set Conjunto y Aros Corazón",
    slug: "set-conjunto-y-aros-corazon",
    category: "Set",
    description: "Set conjunto y aros corazón.",
    price: 27800,
    stock: 1,
    images: [`${baseUrl}set-conjunto-y-aros-corazon`]
  }
];
const seedProducts = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_ATLAS_URL);
    await mongoose.connect(process.env.MONGO_ATLAS_URL);
    console.log("Mongo conectado ✅");

    for (const product of products) {
      await Product.updateOne(
        { slug: product.slug },
        { $set: product },
        { upsert: true }
      );
    }

    console.log("Productos sincronizados correctamente 🚀");
    process.exit();
  } catch (error) {
    console.error("Error al cargar productos:", error);
    process.exit(1);
  }
};

seedProducts();