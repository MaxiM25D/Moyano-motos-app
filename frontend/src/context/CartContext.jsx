import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getCart, addProductToCart, createCart } from "../services/cart.service";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);  // array de items
  const [cartId, setCartId] = useState(null);
  const { user } = useAuth();

  // Al cargar, leer carrito según si hay usuario o no
  useEffect(() => {
    if (user) {
      loadUserCart();
    } else {
      loadGuestCart();
    }
  }, [user]);

  // Carrito invitado desde localStorage
  const loadGuestCart = () => {
    const stored = localStorage.getItem("guestCart");
    setCart(stored ? JSON.parse(stored) : []);
    setCartId(null);
  };

  // Carrito del usuario desde la DB
  const loadUserCart = async () => {
    try {
      const stored = localStorage.getItem("user");
      const userData = stored ? JSON.parse(stored) : null;
      if (!userData?.cartId) return;

      const data = await getCart(userData.cartId);
      setCartId(data.cart.id);
      setCart(data.cart.products ?? []);
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
  };

  // Guardar carrito invitado en localStorage
  const saveGuestCart = (items) => {
    localStorage.setItem("guestCart", JSON.stringify(items));
  };

  // Agregar producto
  const addToCart = async (product) => {
    if (user) {
      // Usuario logueado → DB
      try {
        const stored = localStorage.getItem("user");
        const userData = JSON.parse(stored);
        let cid = cartId;

        // Si no tiene cartId, crear uno
        if (!cid) {
          const newCart = await createCart();
          cid = newCart.cart.id;
          setCartId(cid);
        }

        await addProductToCart(cid, product.id);
        // Actualizamos el estado local
        setCart((prev) => {
          const existing = prev.find((p) => p.product?.id === product.id);
          if (existing) {
            return prev.map((p) =>
              p.product?.id === product.id
                ? { ...p, quantity: p.quantity + 1 }
                : p
            );
          }
          return [...prev, { product, quantity: 1 }];
        });
      } catch (err) {
        console.error("Error agregando al carrito:", err);
      }
    } else {
      // Invitado → localStorage
      setCart((prev) => {
        const existing = prev.find((p) => p.product?.id === product.id);
        let updated;
        if (existing) {
          updated = prev.map((p) =>
            p.product?.id === product.id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          );
        } else {
          updated = [...prev, { product, quantity: 1 }];
        }
        saveGuestCart(updated);
        return updated;
      });
    }
  };

  // Quitar producto
  const removeFromCart = (productId) => {
    setCart((prev) => {
      const updated = prev.filter((p) => p.product?.id !== productId);
      if (!user) saveGuestCart(updated);
      return updated;
    });
  };

  // Cambiar cantidad
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart((prev) => {
      const updated = prev.map((p) =>
        p.product?.id === productId ? { ...p, quantity } : p
      );
      if (!user) saveGuestCart(updated);
      return updated;
    });
  };

  // Fusionar carrito invitado al loguearse
  const mergeCart = async (cid) => {
    const guestCart = localStorage.getItem("guestCart");
    if (!guestCart) return;

    const items = JSON.parse(guestCart);
    for (const item of items) {
      try {
        await addProductToCart(cid, item.product.id);
      } catch (err) {
        console.error("Error mergeando producto:", err);
      }
    }
    localStorage.removeItem("guestCart");
  };

  // Total de items
  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0);

  // Total precio
  const totalPrice = cart.reduce(
    (acc, p) => acc + (p.product?.price ?? 0) * p.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, cartId, addToCart, removeFromCart, updateQuantity, mergeCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);