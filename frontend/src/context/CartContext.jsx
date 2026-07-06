import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  getCart,
  addProductToCart,
  createCart,
  updateProductQuantity,
  removeProductFromCart
} from "../services/cart.service";

const CartContext = createContext();

const normalizeId = (value) => {
  if (typeof value === "string") return value;
  if (typeof value?._id === "string") return value._id;
  if (typeof value?.id === "string") return value.id;
  if (typeof value?.$oid === "string") return value.$oid;
  return null;
};

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
      const userCartId = normalizeId(user?.cartId);
      if (!userCartId) return;

      const data = await getCart(userCartId);
      setCartId(normalizeId(data.cart.id));
      setCart(data.cart.products ?? data.cart.items ?? []);
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
        let cid = cartId;

        // Si no tiene cartId, crear uno
        if (!cid) {
          const newCart = await createCart();
          cid = normalizeId(newCart.cart.id);
          if (!cid) throw new Error("El backend no devolvio un cartId valido");
          setCartId(cid);
        }

        const data = await addProductToCart(cid, product.id);
        setCart(data.cart.products ?? []);
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
  const removeFromCart = async (productId) => {
    if (user && cartId) {
      try {
        const data = await removeProductFromCart(cartId, productId);
        setCart(data.cart.products ?? []);
      } catch (err) {
        console.error("Error eliminando producto del carrito:", err);
      }
      return;
    }

    setCart((prev) => {
      const updated = prev.filter((p) => p.product?.id !== productId);
      saveGuestCart(updated);
      return updated;
    });
  };

  // Cambiar cantidad
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    if (user && cartId) {
      try {
        const data = await updateProductQuantity(cartId, productId, quantity);
        setCart(data.cart.products ?? []);
      } catch (err) {
        console.error("Error actualizando cantidad:", err);
      }
      return;
    }

    setCart((prev) => {
      const updated = prev.map((p) =>
        p.product?.id === productId ? { ...p, quantity } : p
      );
      saveGuestCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Fusionar carrito invitado al loguearse
  const mergeCart = async (cid) => {
    const guestCart = localStorage.getItem("guestCart");
    if (!guestCart) return;

    const items = JSON.parse(guestCart);
    for (const item of items) {
      try {
        await addProductToCart(cid, item.product.id);
        if (item.quantity > 1) {
          await updateProductQuantity(cid, item.product.id, item.quantity);
        }
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
      value={{ cart, cartId, addToCart, removeFromCart, updateQuantity, clearCart, mergeCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
