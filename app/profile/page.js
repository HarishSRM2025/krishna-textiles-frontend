"use client";

import Link from "next/link";
import { useState } from "react";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  Truck,
  Edit3,
  Plus,
  Bell,
  Shield,
  CreditCard,
  Phone,
  Mail,
  Shirt,
  Scissors,
  Tag,
  ShoppingBag,
} from "lucide-react";

const mockOrders = [
  {
    id: "KT2024001",
    date: "12 Aug 2024",
    status: "Delivered",
    items: [
      { name: "Men's Cotton Vest (Pack of 3)", brand: "Jockey", qty: 1, price: 299, category: "mens-innerwear" }
    ],
    total: 299,
  },
  {
    id: "KT2024002",
    date: "05 Aug 2024",
    status: "In Transit",
    items: [
      { name: "Cotton Formal Shirt", brand: "Siyaram's", qty: 2, price: 799, category: "shirts" },
      { name: "Slim Fit Denim Jeans", brand: "VIP", qty: 1, price: 1199, category: "bottomwear" },
    ],
    total: 2797,
  },
  {
    id: "KT2024003",
    date: "28 Jul 2024",
    status: "Processing",
    items: [
      { name: "Handwoven Silk Saree", brand: "Siyaram's", qty: 1, price: 2499, category: "sarees" }
    ],
    total: 2499,
  },
];

const savedAddresses = [
  {
    id: 1,
    label: "Home",
    name: "Rajesh Kumar",
    address: "12, Gandhi Nagar, 3rd Street",
    city: "Erode",
    state: "Tamil Nadu",
    pin: "638001",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    id: 2,
    label: "Office / Boutique",
    name: "Rajesh Kumar",
    address: "45, Industrial Area, Phase 2",
    city: "Tiruppur",
    state: "Tamil Nadu",
    pin: "641604",
    phone: "+91 98765 43210",
    isDefault: false,
  },
];

const statusConfig = {
  Delivered: { color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle },
  "In Transit": { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Truck },
  Processing: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
};

const menuItems = [
  { label: "My Orders & History", icon: Package, section: "orders", badge: "3" },
  { label: "Saved Wishlist", icon: Heart, section: "wishlist" },
  { label: "Delivery Addresses", icon: MapPin, section: "addresses" },
  { label: "Account Settings", icon: Settings, section: "settings" },
];

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("orders");

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
                  RK
                </div>
                <h3 className="font-extrabold text-sm text-[#0c2340]">Rajesh Kumar</h3>
                <p className="text-[11px] text-slate-400">Verified Retail Buyer</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                  GST Verified Account
                </span>

                <div className="grid grid-cols-3 gap-1 mt-3 pt-3 border-t border-slate-100 text-center">
                  <div>
                    <span className="text-xs font-black text-[#0c2340] block">3</span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Orders</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#0c2340] block">0</span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Wishlist</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#0c2340] block">2</span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Addresses</span>
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
                    className={`w-full flex items-center justify-between p-3 text-left transition-colors ${
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
              <button className="w-full flex items-center gap-2.5 p-3 text-left text-[#d32f2f] hover:bg-red-50 transition-colors">
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
                    <p className="text-xs text-slate-400">Track and manage past wholesale & retail orders</p>
                  </div>
                  <Link href="/category/all" className="btn-red text-xs px-3 py-1.5 rounded">
                    + Shop More
                  </Link>
                </div>

                <div className="space-y-4">
                  {mockOrders.map((order) => {
                    const cfg = statusConfig[order.status] || statusConfig.Processing;
                    const StatusIcon = cfg.icon;
                    return (
                      <div key={order.id} className="border border-slate-200 rounded overflow-hidden shadow-sm">
                        {/* Order Meta Bar */}
                        <div className="bg-slate-50 p-3 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-200">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#0c2340]">#{order.id}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500 font-medium">Placed on {order.date}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>
                              <StatusIcon size={12} /> {order.status}
                            </span>
                            <span className="font-extrabold text-[#0c2340] text-sm">
                              ₹{order.total.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-3.5 divide-y divide-slate-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-[#0c2340] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                  <Shirt size={18} />
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    {item.brand}
                                  </span>
                                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                                  <span className="text-[11px] text-slate-500">Quantity: {item.qty}</span>
                                </div>
                              </div>
                              <span className="font-bold text-slate-800">
                                ₹{(item.price * item.qty).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action footer */}
                        <div className="bg-slate-50/70 px-3.5 py-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-400">Tax Invoice available for download</span>
                          <div className="flex gap-2">
                            <button className="px-2.5 py-1 bg-white border border-slate-300 hover:border-slate-500 rounded text-slate-700 font-bold text-[11px]">
                              Download GST Invoice
                            </button>
                            <button className="px-2.5 py-1 bg-[#0c2340] hover:bg-[#123661] text-white rounded font-bold text-[11px]">
                              Track Dispatch
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WISHLIST SECTION */}
            {activeSection === "wishlist" && (
              <div>
                <div className="pb-3 mb-4 border-b border-slate-200">
                  <h2 className="text-base font-extrabold text-[#0c2340]">Saved Wishlist</h2>
                  <p className="text-xs text-slate-400">Products you've saved for future procurement</p>
                </div>
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
                  <button className="btn-primary text-xs px-3 py-1.5 rounded flex items-center gap-1">
                    <Plus size={13} /> Add Address
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded border ${
                        addr.isDefault ? "border-[#0c2340] bg-slate-50/50" : "border-slate-200 bg-white"
                      } shadow-sm text-xs space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0c2340] text-sm">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold bg-[#0c2340] text-white px-2 py-0.2 rounded">
                            PRIMARY DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-slate-800">{addr.name}</p>
                      <p className="text-slate-600 leading-relaxed">
                        {addr.address}, {addr.city}, {addr.state} - {addr.pin}
                      </p>
                      <p className="text-slate-500 font-medium">📞 {addr.phone}</p>
                      <div className="pt-2 border-t border-slate-200 flex gap-2">
                        <button className="text-[11px] font-bold text-[#0c2340] hover:underline flex items-center gap-1">
                          <Edit3 size={11} /> Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS SECTION */}
            {activeSection === "settings" && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-200">
                  <h2 className="text-base font-extrabold text-[#0c2340]">Account & Business Settings</h2>
                  <p className="text-xs text-slate-400">Update contact profile, GST details & trade preferences</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name / Contact Person</label>
                    <input
                      type="text"
                      defaultValue="Rajesh Kumar"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      defaultValue="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue="rajesh@krishnatextiles-partner.in"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">GSTIN Number (Optional)</label>
                    <input
                      type="text"
                      defaultValue="33AAAAA0000A1Z5"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button className="btn-primary text-xs px-5 py-2 rounded">
                    Save Profile Changes
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
