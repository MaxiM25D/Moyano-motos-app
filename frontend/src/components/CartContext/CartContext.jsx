import { createContext, useState, useMemo } from "react";

export const CartContext = createContext();

export function CartCustomProvider({ children }) {
  const [items, setItems] = useState([]);

  // Agrega item al carrito (producto: objeto, cantidad: number)
  const addItemToCart = (producto, cantidad) => {
    const qty = Number(cantidad);
    if (!producto || isNaN(qty) || qty <= 0) return; // validación

    setItems((prev) => {
      const existe = prev.find((it) => String(it.id) === String(producto.id));
      if (existe) {
        return prev.map((it) =>
          String(it.id) === String(producto.id)
            ? { ...it, cantidad: Number(it.cantidad) + qty }
            : it
        );
      } else {
        // asegurar que precio y cantidad sean números
        return [
          ...prev,
          {
            ...producto,
            precio: Number(producto.precio) || 0,
            cantidad: qty,
          },
        ];
      }
    });
  };

  const removeItemFromCart = (id) => {
    setItems((prev) => prev.filter((it) => String(it.id) !== String(id)));
  };

  const clearCart = () => setItems([]);

  // derivados (siempre Number)
  const totalQuantity = items.reduce(
    (acc, it) => acc + (Number(it.cantidad) || 0),
    0
  );
  const totalPrice = items.reduce(
    (acc, it) => acc + (Number(it.precio) || 0) * (Number(it.cantidad) || 0),
    0
  );

  const value = useMemo(
    () => ({
      items,
      totalPrice,
      totalQuantity,
      addItemToCart,
      removeItemFromCart,
      clearCart,
    }),
    [items, totalPrice, totalQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}