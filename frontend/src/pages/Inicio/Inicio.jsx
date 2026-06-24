import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../data/firebaseConfig";
import "./Inicio.css";

function Inicio({ greeting }) {
  const [destacados, setDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        // Creamos una query para traer productos destacados (ejemplo: id 1 o 7)
        const q = query(
          collection(db, "productos"),
          where("destacado", "==", true)
        );

        const querySnapshot = await getDocs(q);

        const productosFirebase = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDestacados(productosFirebase);
      } catch (error) {
        console.error("Error obteniendo destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestacados();
  }, []);

  return (
    <section className="inicio">
      <h1 className="inicio-title">{greeting}</h1>
      <p className="inicio-subtitle">
        Bienvenido a <span className="brand">SM Glamour 🌟</span>, tu tienda de accesorios exclusivos.
      </p>

      <div className="inicio-destacados">
        {loading ? (
          <p>Cargando destacados...</p>
        ) : destacados.length > 0 ? (
          destacados.map((prod) => (
            <div key={prod.id} className="inicio-banner">
              <Link to={`/producto/${prod.id}`}>
                <img
                  className="banner-img"
                  src={prod.img}
                  alt={prod.nombre}
                />
              </Link>
              <h3 className="banner-title">{prod.nombre}</h3>
              <p className="producto-precio">${prod.precio}</p>
              <Link to={`/producto/${prod.id}`} className="btn-detalle">
                Ver Detalle...
              </Link>
            </div>
          ))
        ) : (
          <p>No se encontraron productos destacados...</p>
        )}
      </div>
    </section>
  );
}

export default Inicio;