"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  Package,
  MapPin,
  Check,
  Calendar,
  CreditCard,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/context/AuthContext";
import { categoryIconMap } from "@/components/Header";
import { api } from "@/lib/api";
import {
  getSavedAddresses,
  addSavedAddress,
  setDefaultSavedAddress,
} from "@/lib/addresses";

// Helper to calculate expected delivery date string
function getDeliveryDateString(minDays = 3, maxDays = 5) {
  const now = new Date();
  const minDate = new Date(now);
  minDate.setDate(now.getDate() + minDays);

  const maxDate = new Date(now);
  maxDate.setDate(now.getDate() + maxDays);

  const minFormatted = minDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  const maxFormatted = maxDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return `${minFormatted} – ${maxFormatted}`;
}

export default function CartPage() {
  const { items, updateQty, removeFromCart, subtotal, mrpTotal, clearCart } =
    useCart();
  const { user, isAuthenticated } = useAuth();

  // 3-step checkout stepper state: 1: Items & Delivery, 2: Address, 3: Review
  const [currentStep, setCurrentStep] = useState(1);

  // Address state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: "",
    phone: "",
    email: "",
    label: "Home",
    address: "",
    city: "Erode",
    state: "Tamil Nadu",
    pincode: "638001",
    saveForFuture: true,
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState("ONLINE_GPAY");

  // Submission / error state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  // Synchronize saved addresses
  useEffect(() => {
    const list = getSavedAddresses(user?.id);
    setSavedAddresses(list);
    if (list.length > 0) {
      const defaultAddr = list.find((a) => a.isDefault) || list[0];
      setSelectedAddressId(defaultAddr.id);
      setShowNewAddressForm(false);
    } else {
      setShowNewAddressForm(true);
    }
  }, [user]);

  // Pre-fill new address form with user details
  useEffect(() => {
    if (user) {
      setNewAddr((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        phone: prev.phone || user.phone || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const savings = mrpTotal - subtotal;
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = isFreeShipping || items.length === 0 ? 0 : 49;
  const total = subtotal + shipping;
  const deliveryWindow = getDeliveryDateString(3, 5);

  // Determine active delivery address
  const getActiveAddress = () => {
    if (!showNewAddressForm && selectedAddressId) {
      const found = savedAddresses.find((a) => a.id === selectedAddressId);
      if (found) return found;
    }
    return {
      name: newAddr.name,
      phone: newAddr.phone,
      email: newAddr.email || user?.email || "",
      address: newAddr.address,
      city: newAddr.city,
      state: newAddr.state,
      pincode: newAddr.pincode,
      label: newAddr.label,
    };
  };

  // Step 1 to Step 2
  const handleProceedToAddress = () => {
    if (items.length === 0) return;
    setError("");
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2 to Step 3
  const handleProceedToReview = (e) => {
    if (e) e.preventDefault();
    setError("");

    if (showNewAddressForm) {
      if (!newAddr.name.trim()) {
        setError("Please enter the recipient full name.");
        return;
      }
      if (!newAddr.phone.trim() || newAddr.phone.replace(/\D/g, "").length < 10) {
        setError("Please enter a valid 10-digit delivery mobile number.");
        return;
      }
      if (!newAddr.address.trim()) {
        setError("Please enter the street delivery address.");
        return;
      }
      if (!newAddr.city.trim()) {
        setError("Please enter the delivery city/town.");
        return;
      }
      if (!newAddr.pincode.trim() || newAddr.pincode.length < 6) {
        setError("Please enter a valid 6-digit postal pincode.");
        return;
      }

      // If user opted to save
      if (newAddr.saveForFuture) {
        const updated = addSavedAddress(user?.id, {
          ...newAddr,
          isDefault: savedAddresses.length === 0,
        });
        setSavedAddresses(updated);
        setSelectedAddressId(updated[0]?.id);
        setShowNewAddressForm(false);
      }
    } else {
      if (!selectedAddressId) {
        setError("Please select a delivery address or add a new one.");
        return;
      }
    }

    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 3: Place real order
  const handlePlaceOrder = async () => {
    setError("");
    setSubmitting(true);

    const activeAddr = getActiveAddress();
    const formattedAddress = `${activeAddr.address.trim()}, ${activeAddr.city.trim()}, ${activeAddr.state || "Tamil Nadu"} - ${activeAddr.pincode.trim()}`;

    try {
      const payload = {
        // Do NOT send raw user.id as customerId to avoid foreign key violation
        customerName: activeAddr.name.trim(),
        customerPhone: activeAddr.phone.trim(),
        customerEmail: activeAddr.email ? activeAddr.email.trim() : (user?.email || undefined),
        shippingAddress: formattedAddress,
        paymentMethod,
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
        window.scrollTo({ top: 0, behavior: "smooth" });
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

  // ORDER SUCCESS VIEW
  if (placedOrder) {
    return (
      <div className="container-x py-16 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-4 font-black text-2xl shadow-sm">
          ✓
        </div>
        <h1 className="text-2xl font-extrabold text-[#0c2340] mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Your order has been recorded in the database and submitted to our Tiruppur mill fulfillment queue.
        </p>

        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 text-xs text-left space-y-3 shadow-sm">
          <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Order Reference:</span>
            <span className="font-mono font-extrabold text-[#0c2340] text-sm bg-slate-100 px-2 py-0.5 rounded">
              #{placedOrder.orderNumber}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Customer:</span>
            <span className="font-bold text-slate-800">{placedOrder.customerName}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Total Paid / Payable:</span>
            <span className="font-extrabold text-[#0c2340] text-sm">
              ₹{placedOrder.totalAmount?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Expected Delivery:</span>
            <span className="font-bold text-green-700 flex items-center gap-1">
              <Truck size={13} /> {deliveryWindow}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Delivery Destination:</span>
            <span className="font-medium text-slate-700 text-right max-w-[260px] truncate">
              {placedOrder.shippingAddress}
            </span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-500 font-medium">Fulfillment Status:</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
              {placedOrder.status || "CONFIRMED"} (Dispatch Pending)
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {isAuthenticated ? (
            <Link
              href="/profile"
              className="flex-1 btn-primary py-2.5 rounded text-xs font-bold text-center"
            >
              View in My Orders
            </Link>
          ) : (
            <Link
              href="/signin"
              className="flex-1 btn-primary py-2.5 rounded text-xs font-bold text-center"
            >
              Sign In to Track Order
            </Link>
          )}
          <Link
            href="/category/all"
            className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-bold text-center transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // EMPTY CART VIEW
  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={30} />
        </div>
        <h1 className="text-xl font-extrabold text-[#0c2340] mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Looks like you haven&apos;t added any textiles to your cart yet. Explore our factory-direct collections.
        </p>
        <Link
          href="/category/all"
          className="btn-primary py-2.5 px-6 rounded text-xs font-bold inline-block"
        >
          Explore Product Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      {/* 3-STEP STEPPER HEADER */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between relative">
          {/* Background progress track */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#0c2340] -translate-y-1/2 z-0 transition-all duration-300"
            style={{
              width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
            }}
          />

          {/* STEP 1 PILL */}
          <button
            onClick={() => setCurrentStep(1)}
            className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep === 1
                  ? "bg-[#0c2340] text-white ring-4 ring-blue-100 shadow-sm"
                  : currentStep > 1
                  ? "bg-green-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {currentStep > 1 ? <Check size={16} /> : "1"}
            </div>
            <span
              className={`text-[11px] mt-2 font-bold transition-colors ${
                currentStep === 1 ? "text-[#0c2340]" : "text-slate-500"
              }`}
            >
              1. Cart Items & Delivery
            </span>
          </button>

          {/* STEP 2 PILL */}
          <button
            onClick={() => {
              if (currentStep > 2) setCurrentStep(2);
            }}
            disabled={currentStep < 2}
            className={`relative z-10 flex flex-col items-center group ${
              currentStep >= 2 ? "cursor-pointer" : "cursor-not-allowed opacity-70"
            } focus:outline-none`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep === 2
                  ? "bg-[#0c2340] text-white ring-4 ring-blue-100 shadow-sm"
                  : currentStep > 2
                  ? "bg-green-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {currentStep > 2 ? <Check size={16} /> : "2"}
            </div>
            <span
              className={`text-[11px] mt-2 font-bold transition-colors ${
                currentStep === 2 ? "text-[#0c2340]" : "text-slate-500"
              }`}
            >
              2. Delivery Address
            </span>
          </button>

          {/* STEP 3 PILL */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                currentStep === 3
                  ? "bg-[#0c2340] text-white ring-4 ring-blue-100 shadow-sm"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              3
            </div>
            <span
              className={`text-[11px] mt-2 font-bold transition-colors ${
                currentStep === 3 ? "text-[#0c2340]" : "text-slate-500"
              }`}
            >
              3. Review & Order
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* STEP 1: CART ITEMS & EXPECTED DELIVERY */}
      {currentStep === 1 && (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-[#0c2340]">
                Review Items ({items.length} textiles)
              </h2>
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:underline cursor-pointer"
              >
                Clear Cart
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {items.map((item) => {
                const Icon = categoryIconMap[item.category] || Package;
                return (
                  <div
                    key={item.key}
                    className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
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

                    {/* Quantity controls & delivery badge */}
                    <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-4 justify-between sm:justify-end">
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

                      {/* Expected delivery badge per item */}
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                        <Truck size={12} className="text-[#0c2340]" />
                        <span>Expected Delivery:</span>
                        <strong className="text-slate-800">{deliveryWindow}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
              <Link
                href="/category/all"
                className="font-bold text-[#0c2340] hover:underline flex items-center gap-1"
              >
                <ArrowLeft size={13} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Summary Card for Step 1 */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm sticky top-24 space-y-4">
            <h3 className="font-extrabold text-sm text-[#0c2340] pb-3 border-b border-slate-200">
              Price & Delivery Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items MRP ({items.length} items)</span>
                <span className="font-medium text-slate-800">₹{mrpTotal.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Product Discount</span>
                  <span>- ₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Direct Mill Shipping</span>
                <span className="font-medium text-slate-800">
                  {shipping === 0 ? (
                    <span className="text-green-700 font-bold">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (Included)</span>
                <span>₹{Math.round(subtotal * 0.05).toLocaleString()} (5%)</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#0c2340]">
                <Truck size={14} className="text-[#d32f2f]" />
                <span>Standard Mill Dispatch</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Estimated Delivery: <strong className="text-slate-900">{deliveryWindow}</strong>
              </p>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between font-extrabold text-base text-[#0c2340]">
              <span>Subtotal Payable</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button
              onClick={handleProceedToAddress}
              className="btn-primary w-full py-3 rounded font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>Continue to Delivery Address</span>
              <ArrowRight size={14} />
            </button>

            <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-green-600" />
              100% Genuine Factory Direct Textiles
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: ADDRESS MANAGEMENT */}
      {currentStep === 2 && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-[#0c2340] flex items-center gap-2">
                  <MapPin className="text-[#d32f2f]" size={18} />
                  Select Delivery Address
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose a destination from your saved addresses or add a new shipping location
                </p>
              </div>

              {!showNewAddressForm && savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="btn-primary text-xs px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} /> Add New Address
                </button>
              )}
            </div>

            {/* SAVED ADDRESS CARDS */}
            {!showNewAddressForm && savedAddresses.length > 0 && (
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#0c2340] bg-blue-50/30 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={isSelected}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="accent-[#0c2340] cursor-pointer"
                            />
                            <span className="font-extrabold text-[#0c2340] text-xs">
                              {addr.label}
                            </span>
                          </div>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold bg-[#0c2340] text-white px-2 py-0.2 rounded">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-slate-800 text-xs ml-5">{addr.name}</p>
                        <p className="text-slate-600 text-xs ml-5 leading-relaxed mt-0.5">
                          {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-slate-500 text-xs ml-5 mt-1">📞 {addr.phone}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ADD NEW ADDRESS FORM */}
            {showNewAddressForm && (
              <form onSubmit={handleProceedToReview} className="space-y-4 pt-1">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-800">
                    Add New Shipping Address
                  </h3>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Use an existing saved address
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.name}
                      onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      10-Digit Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Address Label
                    </label>
                    <select
                      value={newAddr.label}
                      onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Shop / Boutique">Shop / Boutique</option>
                      <option value="Warehouse">Warehouse</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Street Address / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.address}
                      onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                      placeholder="House / Flat / Shop No., Street, Landmark"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email for Invoice
                    </label>
                    <input
                      type="email"
                      value={newAddr.email}
                      onChange={(e) => setNewAddr({ ...newAddr, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      placeholder="e.g. Erode / Coimbatore"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      placeholder="Tamil Nadu"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Postal Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      placeholder="638001"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={newAddr.saveForFuture}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, saveForFuture: e.target.checked })
                    }
                    className="accent-[#0c2340] cursor-pointer"
                  />
                  <label
                    htmlFor="saveAddress"
                    className="text-xs text-slate-700 font-medium cursor-pointer"
                  >
                    Save this address to my profile for faster future checkout
                  </label>
                </div>
              </form>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={13} /> Back to Items
              </button>

              <button
                type="button"
                onClick={handleProceedToReview}
                className="btn-primary px-6 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <span>Continue to Order Review</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: ORDER REVIEW & CONFIRMATION */}
      {currentStep === 3 && (
        <div className="max-w-4xl mx-auto grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-5">
            {/* 1. Delivery Details Review Card */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-extrabold text-sm text-[#0c2340] flex items-center gap-2">
                  <MapPin size={16} className="text-[#d32f2f]" />
                  Delivery Destination
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-[#0c2340] font-bold hover:underline cursor-pointer"
                >
                  Change Address
                </button>
              </div>

              {(() => {
                const addr = getActiveAddress();
                return (
                  <div className="text-xs space-y-1 text-slate-700">
                    <p className="font-bold text-slate-900 text-sm">{addr.name}</p>
                    <p className="text-slate-600 leading-relaxed">
                      {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-slate-500 font-medium">📞 Contact: {addr.phone}</p>
                    {addr.email && (
                      <p className="text-slate-500">✉️ Invoice Email: {addr.email}</p>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* 2. Expected Delivery Timeline Card */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-extrabold text-sm text-[#0c2340] flex items-center gap-2">
                <Calendar size={16} className="text-[#0c2340]" />
                Expected Delivery Date
              </h3>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="font-extrabold text-emerald-900 text-sm">
                    Arriving by {deliveryWindow}
                  </p>
                  <p className="text-emerald-700 text-[11px] mt-0.5">
                    Dispatches within 24 hours directly from our Tamil Nadu textile mill.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Items Recap */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-extrabold text-sm text-[#0c2340] flex items-center gap-2">
                  <Package size={16} className="text-[#0c2340]" />
                  Order Items ({items.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#0c2340] font-bold hover:underline cursor-pointer"
                >
                  Edit Items
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {items.map((item) => (
                  <div key={item.key} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Qty: <strong>{item.qty}</strong> · Size: <strong>{item.size}</strong> · Unit: ₹{item.price}
                      </p>
                    </div>
                    <span className="font-extrabold text-[#0c2340]">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Payment Method Selection */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-[#0c2340] flex items-center gap-2">
                <CreditCard size={16} className="text-[#0c2340]" />
                Select Payment Method
              </h3>

              <div className="space-y-2.5 text-xs">
                <label
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "ONLINE_GPAY"
                      ? "border-[#0c2340] bg-blue-50/40 ring-1 ring-[#0c2340]"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE_GPAY"
                    checked={paymentMethod === "ONLINE_GPAY"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[#0c2340] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Google Pay / UPI / Instant Pay
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Instant payment verification & priority dispatch
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-[#0c2340] bg-blue-50/40 ring-1 ring-[#0c2340]"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    checked={paymentMethod === "CASH_ON_DELIVERY"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[#0c2340] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Pay cash or UPI upon delivery at your doorstep
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === "NET_BANKING"
                      ? "border-[#0c2340] bg-blue-50/40 ring-1 ring-[#0c2340]"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="NET_BANKING"
                    checked={paymentMethod === "NET_BANKING"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="accent-[#0c2340] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Direct Mill Bank Transfer (NEFT / RTGS)
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      For bulk and boutique orders via official bank account
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary & Confirm Order Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm sticky top-24 space-y-4">
            <h3 className="font-extrabold text-sm text-[#0c2340] pb-3 border-b border-slate-200">
              Order Total & Taxes
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-slate-800">₹{subtotal.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Total Discount</span>
                  <span>- ₹{savings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Mill Shipping</span>
                <span className="font-medium text-slate-800">
                  {shipping === 0 ? (
                    <span className="text-green-700 font-bold">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Applicable GST</span>
                <span>₹{Math.round(subtotal * 0.05).toLocaleString()} (5%)</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between font-extrabold text-base text-[#0c2340]">
              <span>Grand Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="btn-red w-full py-3.5 rounded font-bold text-xs flex items-center justify-center gap-2 shadow disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <span>Placing Order in Database...</span>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Confirm & Place Order (₹{total.toLocaleString()})</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full py-2 text-center text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              ← Back to Address Selection
            </button>

            <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 space-y-1 text-center">
              <p className="flex items-center justify-center gap-1 text-green-700 font-semibold">
                <ShieldCheck size={12} /> 100% Safe & Secure Checkout
              </p>
              <p>Direct Mill Logistics · Official GST Tax Invoice Generated</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
