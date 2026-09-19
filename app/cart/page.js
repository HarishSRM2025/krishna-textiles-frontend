"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Truck, ArrowRight, Package, User, MapPin } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { categoryIconMap } from "@/components/Header";
import { api } from "@/lib/api";

export default function CartPage() {
  const { items, updateQty, removeFromCart, subtotal, mrpTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Erode");
  const [pincode, setPincode] = useState("638001");

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const savings = mrpTotal - subtotal;
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = isFreeShipping || items.length === 0 ? 0 : 49;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter the recipient full name for delivery.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please provide a valid 10-digit delivery mobile number.");
      return;
    }
    if (!address.trim()) {
      setError("Please enter the delivery street address.");
      return;
    }

    setSubmitting(true);

    try {
      const fullShippingAddress = `${address.trim()}, ${city.trim()}, Tamil Nadu - ${pincode.trim()}`;

      const payload = {
        customerId: user?.id || undefined,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || user?.email || undefined,
        shippingAddress: fullShippingAddress,
        paymentMethod: "ONLINE_GPAY",
        items: items.map((i) => ({
          productId: i.id,
          productName: i.name,
          size: i.size || "Free Size",
          quantity: i.qty,
          unitPrice: i.price,
        })),
      };

      const res = await api.orders.create(payload);
      if (res?.data) {
        setPlacedOrder(res.data);
        clearCart();
      } else {
        throw new Error("Order creation failed on backend");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      setError(err.message || "Failed to place order into database. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="container-x py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-sm">
          ✓
        </div>
        <h1 className="text-2xl font-extrabold text-[#0c2340] mb-2">Order Confirmed in Database!</h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Thank you for ordering with Krishna Textiles. Your order has been recorded into our PostgreSQL database and dispatched to our warehouse fulfillment queue.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-xs text-left space-y-2.5 shadow-sm">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Official Order Number:</span>
            <span className="font-extrabold text-[#0c2340] font-mono text-sm">#{placedOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Customer Name:</span>
            <span className="font-semibold text-slate-800">{placedOrder.customerName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Amount Payable:</span>
            <span className="font-bold text-[#0c2340] text-sm">₹{placedOrder.totalAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500">Delivery Destination:</span>
            <span className="font-medium text-slate-700 text-right max-w-[240px] truncate">{placedOrder.shippingAddress}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Initial Status:</span>
            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {placedOrder.status || "CONFIRMED"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {isAuthenticated ? (
            <Link href="/profile" className="flex-1 btn-primary py-2.5 rounded text-xs font-bold text-center">
              View in My Orders
            </Link>
          ) : (
            <Link href="/signin" className="flex-1 btn-primary py-2.5 rounded text-xs font-bold text-center">
              Sign In to Track Order
            </Link>
          )}
          <Link href="/category/all" className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-bold text-center transition-colors">
            Continue Shopping
          </Link>
        </div>
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
        <Link href="/category/all" className="btn-primary py-2.5 px-6 rounded text-xs font-bold inline-block">
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

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Cart Item Cards & Delivery Info Form */}
        <div className="space-y-6">
          {/* Cart Items List */}
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
                          ₹{item.price}
                        </span>
                        {item.mrp > item.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{item.mrp}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                      <button
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#0c2340]">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-sm text-[#0c2340] block">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="text-[11px] text-red-600 hover:underline inline-flex items-center gap-1 mt-0.5 cursor-pointer"
                      >
                        <Trash2 size={11} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery & Shipping Details Form */}
          <div className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="text-[#d32f2f]" size={18} />
                <h3 className="font-extrabold text-sm text-[#0c2340]">Shipping & Dispatch Address</h3>
              </div>
              {!isAuthenticated && (
                <span className="text-xs text-slate-500">
                  Have an account? <Link href="/signin" className="text-[#d32f2f] font-bold hover:underline">Sign In</Link>
                </span>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Suresh Babu"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">10-Digit Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City / Hub *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Erode / Coimbatore / Chennai"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Delivery Street Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Door No, Street Name, Landmark"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="638001"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
            <Link href="/category/all" className="font-bold text-[#0c2340] hover:underline flex items-center gap-1">
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-red-600 hover:underline cursor-pointer"
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
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="btn-red w-full py-3 rounded font-bold text-xs flex items-center justify-center gap-1.5 shadow disabled:opacity-60 cursor-pointer"
          >
            {submitting ? (
              <span>Placing Order in DB...</span>
            ) : (
              <>
                <span>Confirm & Place Order</span> <ArrowRight size={14} />
              </>
            )}
          </button>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 space-y-1 text-center">
            <p className="flex items-center justify-center gap-1 text-green-700 font-semibold">
              <ShieldCheck size={12} /> 100% Safe & Secure Checkout
            </p>
            <p>Direct Mill Logistics · Official GST Tax Invoice Generated</p>
          </div>
        </div>
      </div>
    </div>
  );
}
