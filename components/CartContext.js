"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { calculateUnitPrice } from "@/lib/pricing";

const CartContext = createContext(null);
const STORAGE_KEY = "krishna-textiles-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  function addToCart(product, size, qty = 1, openDrawer = true, customUnitPrice = null, color = null, itemImageUrl = null) {
    const rawCategory = product.category?.slug || product.categoryId || product.category || "";
    const basePrice = Number(product.price) || 0;
    const finalUnitPrice =
      customUnitPrice !== null
        ? Number(customUnitPrice)
        : calculateUnitPrice(basePrice, qty, rawCategory);
    const itemColor = color || product.color || null;
    // Use the explicitly passed image (e.g. color-specific photo), else fall back to product default
    const resolvedImageUrl = itemImageUrl || product.imageUrl || (product.images && product.images[0]) || "";

    setItems((prev) => {
      const key = `${product.id}-${size}${itemColor ? `-${itemColor}` : ""}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        const newQty = existing.qty + qty;
        const newPrice = calculateUnitPrice(
          existing.basePrice || basePrice,
          newQty,
          rawCategory
        );
        return prev.map((i) =>
          i.key === key ? { ...i, qty: newQty, price: newPrice } : i
        );
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          brand: product.brand,
          basePrice,
          price: finalUnitPrice,
          mrp: product.mrp,
          imageUrl: resolvedImageUrl,
          color: itemColor,
          category: product.category,
          categorySlug: rawCategory,
          stock: product.stock,
          size,
          qty,
        },
      ];
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  }

  function updateQty(key, qty) {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => {
            if (i.key !== key) return i;
            const updatedPrice = calculateUnitPrice(
              i.basePrice || i.price,
              qty,
              i.categorySlug || i.category
            );
            return { ...i, qty, price: updatedPrice };
          })
    );
  }

  function removeFromCart(key) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function clearCart() {
    setItems([]);
  }

  // Convenience: add product with its first size (used by quick-add buttons)
  function addItem(product, qty = 1, openDrawer = true) {
    const size = product.sizes?.[0] || "Free Size";
    addToCart(product, size, qty, openDrawer);
  }

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((v) => !v);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const mrpTotal = items.reduce((sum, i) => sum + i.qty * i.mrp, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addItem,
        updateQty,
        removeFromCart,
        clearCart,
        count,
        subtotal,
        mrpTotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
