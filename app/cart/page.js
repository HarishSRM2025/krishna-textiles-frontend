"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Truck, ArrowRight, RotateCcw, Package } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useState } from "react";
import { categoryIconMap } from "@/components/Header";

export default function CartPage() {
  const { items, updateQty, removeFromCart, subtotal, mrpTotal, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);
  const savings = mrpTotal - subtotal;
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = isFreeShipping || items.length === 0 ? 0 : 49;
  const total = subtotal + shipping;

  if (placed) {
    return (
      <div className="container-x py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
          ✓
        </div>
        <h1 className="text-2xl font-extrabold text-[#0c2340] mb-2">Order Confirmed!</h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Thank you for ordering with Krishna Textiles. A confirmation with tax invoice and dispatch tracking link has been sent to your mobile number.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-6 text-xs text-left">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Order ID:</span>
            <span className="font-bold text-slate-800">#KT{Date.now().toString().slice(-6)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Amount Paid / Due:</span>
            <span className="font-bold text-[#0c2340]">₹{total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Dispatch Location:</span>
            <span className="font-medium text-slate-800">Erode Hub (Within 24h)</span>
          </div>
        </div>
        <Link href="/" className="btn-primary w-full py-2.5 rounded text-xs font-bold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={32} />
        </div>
        <h1 className="text-xl font-extrabold text-[#0c2340] mb-2">Your Shopping Cart is Empty</h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Looks like you haven&apos;t added any textiles to your cart yet. Explore our factory-direct collections.
        </p>
        <Link href="/category/all" className="btn-primary py-2.5 px-6 rounded text-xs font-bold">
          Explore Product Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <h1 className="text-xl sm:text-2xl font-extrabold text-[#0c2340] mb-6">
        Shopping Cart ({items.length} unique items)
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Cart Item Cards */}
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = categoryIconMap[item.category] || Package;
            return (
              <div
                key={item.key}
                className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
              >
                <div className="flex gap-3.5 items-center min-w-0">
                  <div
                    className="w-16 h-16 rounded border border-slate-200 flex items-center justify-center text-white shrink-0 font-bold"
                    style={{ backgroundColor: item.color || "#0c2340" }}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {item.brand}
                    </span>
                    <h3 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Size: <strong className="text-slate-700">{item.size}</strong>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-extrabold text-sm text-[#0c2340]">
                        ₹{item.price.toLocaleString()}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.mrp.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-300 rounded bg-white">
                    <button
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      className="px-2 py-1 text-slate-600 hover:bg-slate-100"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <span className="font-extrabold text-sm text-[#0c2340] min-w-[70px] text-right">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="p-1.5 text-slate-400 hover:text-[#d32f2f] transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center pt-2">
            <Link
              href="/category/all"
              className="text-xs font-bold text-[#0c2340] hover:underline"
            >
              ← Back to Catalog
            </Link>
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-slate-400 hover:text-[#d32f2f]"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Price Details Box */}
        <div className="bg-white rounded border border-slate-200 p-5 shadow-sm sticky top-24">
          <h2 className="font-extrabold text-sm text-[#0c2340] pb-3 border-b border-slate-200 mb-4">
            Price & Tax Summary
          </h2>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items MRP Total ({items.length} items)</span>
              <span className="font-medium text-slate-800">₹{mrpTotal.toLocaleString()}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-green-700 font-medium">
                <span>Discount Savings</span>
                <span>- ₹{savings.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-medium text-slate-800">
                {shipping === 0 ? <span className="text-green-700 font-bold">FREE</span> : `₹${shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>GST (Included)</span>
              <span>₹{Math.round(subtotal * 0.05).toLocaleString()} (5%)</span>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-200 my-4" />

          <div className="flex justify-between font-extrabold text-base text-[#0c2340] mb-5">
            <span>Total Payable Amount</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <button
            onClick={() => {
              clearCart();
              setPlaced(true);
            }}
            className="btn-red w-full py-3 rounded font-bold text-xs flex items-center justify-center gap-1.5 shadow"
          >
            Confirm & Place Order <ArrowRight size={14} />
          </button>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 space-y-1 text-center">
            <p className="flex items-center justify-center gap-1 text-green-700 font-semibold">
              <ShieldCheck size={12} /> 100% Safe & Secure Checkout
            </p>
            <p>Direct Mill Logistics · Official GST Tax Invoice Included</p>
          </div>
        </div>
      </div>
    </div>
  );
}
