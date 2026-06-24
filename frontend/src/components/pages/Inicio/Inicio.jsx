import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../../services/productService.js";
import "./Inicio.css";

function Inicio({ greeting }) {
  const [destacados, setDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const data = await getProducts({featured: true,limit: 4}); 
        setDestacados(data.products.slice(0, 2)); 
      } catch (error) {
        console.error("Error cargando destacados", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestacados();
  }, []);

  if (loading) return <p className="loading">Cargando destacados...</p>;

  return (
    <section className="inicio">
      <h1 className="inicio-title">{greeting}</h1>
      <p className="inicio-subtitle">
        Bienvenido a <span className="brand">LUNEK</span>
      </p>

      <div className="inicio-destacados">
        {destacados.map((prod) => (
        <div key={prod.id} className="inicio-banner"> 
          <Link to={`/producto/${prod.id}`}>
            <img
              className="banner-img"
              src={prod.images[0]}
              alt={prod.title}
            />
          </Link>

          <h3 className="banner-title">{prod.title}</h3>
          <p className="producto-precio">${prod.price}</p>

          <Link
            to={`/producto/${prod.id}`}
            className="btn-detalle"
          >
            Ver Detalle
          </Link>
        </div>
      ))}
      </div>
    </section>
  );
}

export default Inicio;