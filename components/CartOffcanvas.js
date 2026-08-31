"use client";

import { useCart } from "./CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CartOffcanvas() {
  const { isCartOpen, closeCart, items, updateQty, removeFromCart, subtotal, mrpTotal, count } = useCart();
  const savings = mrpTotal - subtotal;
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = freeShippingThreshold - subtotal;
  const shippingCharge = isFreeShipping || items.length === 0 ? 0 : 49;
  const finalTotal = subtotal + shippingCharge;

  // Lock body scroll when offcanvas is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 transition-opacity backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6">
        <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl animate-slide-in-right border-l border-slate-200">
          {/* Header */}
          <div className="p-4 bg-[#0c2340] text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#c59b27]" />
              <h2 className="font-bold text-base tracking-wide">
                Shopping Cart <span className="text-xs font-semibold px-2 py-0.5 bg-white/20 rounded ml-1.5">{count} items</span>
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="bg-[#f8fafc] px-4 py-2.5 border-b border-slate-200 text-xs">
              {isFreeShipping ? (
                <div className="flex items-center gap-1.5 text-green-700 font-semibold">
                  <Truck size={14} /> You've unlocked FREE Delivery across India!
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-slate-700 font-medium mb-1">
                    <span>Add <strong className="text-[#d32f2f]">₹{amountNeededForFreeShipping}</strong> more for FREE Shipping</span>
                    <span>₹{subtotal}/₹{freeShippingThreshold}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d32f2f] transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-[220px] mb-5">
                  Explore our premium textile collections and add items to your cart.
                </p>
                <button
                  onClick={closeCart}
                  className="btn-primary text-xs px-5 py-2.5 rounded"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.key} className="py-3.5 flex gap-3 items-start">
                  {/* Item Color Box */}
                  <div
                    className="w-16 h-16 rounded border border-slate-200 shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-inner"
                    style={{ backgroundColor: item.color || "#0c2340" }}
                  >
                    {item.brand ? item.brand.slice(0, 3).toUpperCase() : "KT"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {item.brand}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {item.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="text-slate-400 hover:text-[#d32f2f] transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Size: <span className="font-medium text-slate-700">{item.size}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-300 rounded bg-white">
                        <button
                          onClick={() => updateQty(item.key, item.qty - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-slate-800">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.key, item.qty + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-[#0c2340]">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </span>
                        {item.mrp > item.price && (
                          <span className="block text-[10px] text-slate-400 line-through">
                            ₹{(item.mrp * item.qty).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                <div className="flex justify-between">
                  <span>Items Total (MRP)</span>
                  <span className="font-medium text-slate-800">₹{mrpTotal.toLocaleString()}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Discount Savings</span>
                    <span>- ₹{savings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-slate-800">
                    {shippingCharge === 0 ? <span className="text-green-700 font-bold">FREE</span> : `₹${shippingCharge}`}
                  </span>
                </div>
                <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between text-sm font-extrabold text-[#0c2340]">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex-1 py-2.5 px-3 border border-[#0c2340] text-[#0c2340] hover:bg-slate-100 rounded text-center text-xs font-bold tracking-wide transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex-[2] py-2.5 px-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white rounded text-center text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-2.5">
                <ShieldCheck size={12} className="text-green-600" /> 100% Safe & Secure Payments | GST Invoice Available
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
