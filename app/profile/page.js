"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  Edit3,
  Plus,
  Shirt,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Trash2,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/components/CartContext";
import { api } from "@/lib/api";
import { getSavedAddresses, addSavedAddress, deleteSavedAddress, setDefaultSavedAddress } from "@/lib/addresses";

const statusConfig = {
  DELIVERED: { color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle, label: "Delivered" },
  DISPATCHED: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Truck, label: "Dispatched & In Transit" },
  PROCESSING: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: Clock, label: "Processing at Mill" },
  CONFIRMED: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock, label: "Order Confirmed" },
  PENDING: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock, label: "Pending Verification" },
  CANCELLED: { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertCircle, label: "Cancelled" },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const [activeSection, setActiveSection] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  // Guard: if unauthenticated, redirect to signin
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load saved addresses for user
  useEffect(() => {
    if (user?.id) {
      setAddresses(getSavedAddresses(user.id));
    }
  }, [user]);

  // Synchronize addresses across tabs / checkout
  useEffect(() => {
    const handleSync = () => {
      if (user?.id) setAddresses(getSavedAddresses(user.id));
    };
    window.addEventListener("kt_addresses_updated", handleSync);
    return () => window.removeEventListener("kt_addresses_updated", handleSync);
  }, [user]);

  // Load real orders from DB
  useEffect(() => {
    let isMounted = true;
    if (user?.email || user?.phone) {
      setLoadingOrders(true);
      api.orders
        .getMyOrders({
          customerEmail: user?.email,
          customerPhone: user?.phone,
          limit: 50,
        })
        .then((res) => {
          if (isMounted) {
            setOrders(res?.orders || res?.data || []);
          }
        })
        .catch((err) => {
          console.error("Failed to load customer orders from DB", err);
        })
        .finally(() => {
          if (isMounted) setLoadingOrders(false);
        });
    } else if (!authLoading && !user) {
      setLoadingOrders(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  // If still checking auth or not authenticated, don't show profile
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0c2340] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-slate-500">Checking your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.address.trim() || !newAddress.city.trim() || !newAddress.pincode.trim()) return;
    const updated = addSavedAddress(user.id, {
      ...newAddress,
      name: newAddress.name?.trim() || "",
      phone: newAddress.phone?.trim() || "",
      email: user.email || "",
    });
    setAddresses(updated);
    setNewAddress({
      label: "Home",
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    });
    setShowAddAddress(false);
  };

  const handleDeleteAddress = (id) => {
    const updated = deleteSavedAddress(user.id, id);
    setAddresses(updated);
  };

  const handleSetDefaultAddress = (id) => {
    const updated = setDefaultSavedAddress(user.id, id);
    setAddresses(updated);
  };

  const menuItems = [
    { label: "My Orders & History", icon: Package, section: "orders", badge: orders.length > 0 ? String(orders.length) : null },
    { label: "Saved Wishlist", icon: Heart, section: "wishlist", badge: wishlist.length > 0 ? String(wishlist.length) : null },
    { label: "Delivery Addresses", icon: MapPin, section: "addresses" },
    { label: "Account Settings", icon: Settings, section: "settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6">
      <div className="container-x">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#0c2340]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#0c2340] font-bold">My Account Dashboard</span>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-5 items-start">
          {/* Sidebar */}
          <aside className="space-y-4">
            {/* User Profile Card */}
            <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
              <div className="h-16 bg-gradient-to-r from-[#0c2340] to-[#163864]" />
              <div className="px-4 pb-4 text-center -mt-8">
                <div className="w-16 h-16 rounded bg-[#c59b27] text-[#0c2340] font-black text-xl flex items-center justify-center border-2 border-white shadow-md mx-auto mb-2">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <h3 className="font-extrabold text-sm text-[#0c2340]">{user.name}</h3>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                  {user.role === "ADMIN" ? "Staff Admin Portal" : "Verified Customer"}
                </span>

                <div className="grid grid-cols-2 gap-1 mt-3 pt-3 border-t border-slate-100 text-center">
                  <div>
                    <span className="text-xs font-black text-[#0c2340] block">{orders.length}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Orders</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#0c2340] block">{wishlist.length}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Wishlist</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden text-xs font-bold">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.section;
                return (
                  <button
                    key={item.section}
                    onClick={() => setActiveSection(item.section)}
                    className={`w-full flex items-center justify-between p-3 text-left transition-colors cursor-pointer ${
                      isActive
                        ? "bg-slate-100 text-[#0c2340] border-l-4 border-[#0c2340]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? "text-[#d32f2f]" : "text-slate-400"} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-[#0c2340] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 p-3 text-left text-[#d32f2f] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </nav>
          </aside>

          {/* Main Workspace Area */}
          <main className="bg-white rounded border border-slate-200 p-5 shadow-sm min-h-[480px]">
            {/* ORDERS SECTION */}
            {activeSection === "orders" && (
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-base font-extrabold text-[#0c2340]">Order History</h2>
                    <p className="text-xs text-slate-400">All live orders placed by your account from database</p>
                  </div>
                  <Link href="/category/all" className="btn-red text-xs px-3 py-1.5 rounded">
                    + Shop More
                  </Link>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-16">
                    <div className="w-8 h-8 border-3 border-[#0c2340] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs text-slate-500">Loading your orders from database...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 rounded bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag size={26} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">No orders placed yet</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                      You have not placed any orders yet. Explore our factory-direct catalog to place your first order.
                    </p>
                    <Link href="/category/all" className="btn-primary text-xs">
                      Explore Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const cfg = statusConfig[order.status] || statusConfig.PENDING;
                      const StatusIcon = cfg.icon;
                      const formattedDate = order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recent";

                      return (
                        <div key={order.id} className="border border-slate-200 rounded overflow-hidden shadow-sm">
                          {/* Order Meta Bar */}
                          <div className="bg-slate-50 p-3 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-200">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-[#0c2340]">#{order.orderNumber || order.id}</span>
                              <span className="text-slate-400">·</span>
                              <span className="text-slate-500 font-medium">Placed on {formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>
                                <StatusIcon size={12} /> {cfg.label}
                              </span>
                              <span className="font-extrabold text-[#0c2340] text-sm">
                                ₹{(order.totalAmount || order.subtotal || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="p-3.5 divide-y divide-slate-100">
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded bg-[#0c2340] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                    <Shirt size={18} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800">{item.productName || item.product?.name || "Textile Item"}</h4>
                                    <span className="text-[11px] text-slate-500">
                                      Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ""}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-bold text-slate-800">
                                  ₹{((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Action footer */}
                          <div className="bg-slate-50/70 px-3.5 py-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="text-[11px] text-slate-500">
                              {order.shippingAddress && (
                                <span>Shipping to: <strong>{order.shippingAddress}</strong></span>
                              )}
                              {order.trackingNumber && (
                                <span className="ml-3">Tracking: <strong>{order.trackingNumber}</strong> ({order.courierPartner || "Express"})</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <span className="inline-block px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-[10px] font-bold">
                                Payment: {order.paymentStatus || "UNPAID"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST SECTION */}
            {activeSection === "wishlist" && (
              <div>
                <div className="pb-3 mb-4 border-b border-slate-200">
                  <h2 className="text-base font-extrabold text-[#0c2340]">Saved Wishlist ({wishlist.length})</h2>
                  <p className="text-xs text-slate-400">Products saved for later procurement</p>
                </div>
                {wishlist.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 rounded bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <Heart size={26} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Your wishlist is currently empty</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                      Click the heart icon on any product in our catalog to save items here.
                    </p>
                    <Link href="/category/all" className="btn-primary text-xs">
                      Explore Product Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border border-slate-200 rounded-lg p-3.5 bg-white shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="w-full h-36 bg-slate-100 rounded-md mb-2.5 flex items-center justify-center text-slate-400 font-bold overflow-hidden relative">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <Shirt size={32} />
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{item.brand}</span>
                          <h4 className="font-bold text-slate-800 text-xs line-clamp-2 mt-0.5">{item.name}</h4>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="font-extrabold text-sm text-[#0c2340]">₹{item.price}</span>
                            {item.mrp > item.price && (
                              <span className="text-xs text-slate-400 line-through">₹{item.mrp}</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                          <button
                            onClick={() => {
                              addItem(item, 1, true);
                              removeFromWishlist(item.id);
                            }}
                            className="flex-1 bg-[#0c2340] hover:bg-[#153a69] text-white py-1.5 rounded text-xs font-bold transition-colors cursor-pointer"
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="px-2 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-red-500 rounded text-xs transition-colors cursor-pointer"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES SECTION */}
            {activeSection === "addresses" && (
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-base font-extrabold text-[#0c2340]">Saved Addresses</h2>
                    <p className="text-xs text-slate-400">Manage dispatch & delivery destination locations</p>
                  </div>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="btn-primary text-xs px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add Address
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="mb-6 p-4 border border-slate-300 rounded-lg bg-slate-50 text-xs space-y-3">
                    <h3 className="font-bold text-slate-800">Add New Delivery Address</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Recipient Name *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          placeholder="Recipient Name"
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          placeholder="10-digit Mobile Number"
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Address Label</label>
                        <select
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Shop / Boutique">Shop / Boutique</option>
                          <option value="Warehouse">Warehouse</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        placeholder="House / Flat / Shop No., Street Name, Landmark"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">City / District *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="City / District"
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          placeholder="State"
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
                        <input
                          type="text"
                          required
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          placeholder="6-digit Pincode"
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-3 py-1.5 border border-slate-300 rounded text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary px-4 py-1.5 rounded font-bold cursor-pointer"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg">
                    <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-medium">No saved addresses yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;+ Add Address&quot; above to save your delivery destinations</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-lg border ${
                          addr.isDefault ? "border-[#0c2340] bg-slate-50/70 ring-1 ring-[#0c2340]" : "border-slate-200 bg-white"
                        } shadow-sm text-xs space-y-2 relative`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[#0c2340] text-sm flex items-center gap-1.5">
                            <MapPin size={14} className="text-[#d32f2f]" /> {addr.label}
                          </span>
                          {addr.isDefault ? (
                            <span className="text-[10px] font-bold bg-[#0c2340] text-white px-2 py-0.5 rounded">
                              DEFAULT
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[11px] text-slate-500 hover:text-[#0c2340] underline font-medium cursor-pointer"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                        <p className="font-bold text-slate-800 text-sm">{addr.name}</p>
                        <p className="text-slate-600 leading-relaxed">
                          {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-slate-500 font-medium">📞 {addr.phone}</p>
                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS SECTION */}
            {activeSection === "settings" && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-200">
                  <h2 className="text-base font-extrabold text-[#0c2340]">Account & Business Settings</h2>
                  <p className="text-xs text-slate-400">Your profile details registered in the Krishna Textiles database</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name / Contact Person</label>
                    <input
                      type="text"
                      disabled
                      value={user.name || ""}
                      className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-700 outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Contact Number</label>
                    <input
                      type="text"
                      disabled
                      value={user.phone || "Not specified"}
                      className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-700 outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Registered Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user.email || ""}
                      className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-700 outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Role</label>
                    <input
                      type="text"
                      disabled
                      value={user.role || "CUSTOMER"}
                      className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-2 text-slate-700 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                  Profile information is securely synchronized with your verified Krishna Textiles database record.
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
