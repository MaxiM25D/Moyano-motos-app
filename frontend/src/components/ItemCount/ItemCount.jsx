import { useState } from "react";
import "./ItemCount.css";

export default function ItemCount({ stock = 10, initial = 1, onAdd }) {
  const init = Number(initial) > 0 ? Number(initial) : 1;
  const [cantidad, setCantidad] = useState(init);

  const incrementar = () => {
    if (cantidad < stock) setCantidad((c) => c + 1);
  };
  const decrementar = () => {
    if (cantidad > 1) setCantidad((c) => c - 1);
  };

  const handleAdd = () => {
    if (typeof onAdd === "function") {
      onAdd(Number(cantidad));
    }
  };

  return (
    <div className="itemcount">
      <div className="itemcount-controls">
        <button onClick={decrementar} className="btn-count" aria-label="Disminuir">-</button>
        <span className="itemcount-num">{cantidad}</span>
        <button onClick={incrementar} className="btn-count" aria-label="Aumentar">+</button>
      </div>

      <button onClick={handleAdd} className="btn-agregar">
        🛒 Agregar {cantidad}
      </button>
    </div>
  );
}