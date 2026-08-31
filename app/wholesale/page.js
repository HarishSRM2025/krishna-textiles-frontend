"use client";

import { useState } from "react";
import { Building2, Package, TrendingUp, Handshake, CheckCircle2, Phone, Mail, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

const perks = [
  { icon: Package, title: "Tiered Mill Slabs", desc: "Special factory-direct pricing for volume orders starting from 50+ units." },
  { icon: Building2, title: "Regional Dealer Network", desc: "Join 500+ authorized retail stores and distributors across 28 states." },
  { icon: TrendingUp, title: "Direct Mill Priority", desc: "First access to freshly woven batches and high-demand seasonal patterns." },
  { icon: Handshake, title: "Dedicated B2B Desk", desc: "Single point of contact for transport booking, credit and GST compliance." },
];

export default function WholesalePage() {
  const [form, setForm] = useState({
    name: "",
    business: "",
    phone: "",
    email: "",
    quantity: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6">
      <div className="container-x">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#0c2340]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#0c2340] font-bold">Wholesale & Trade Portal</span>
        </div>

        {/* Hero */}
        <div className="bg-[#0c2340] rounded border border-slate-800 text-white p-6 sm:p-8 mb-8 shadow-md">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#c59b27] uppercase tracking-wider block mb-1">
              Direct Mill Procurement Desk
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
              Wholesale &amp; Bulk Textile Supply
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Krishna Textiles supplies retailers, boutiques, garment exporters, and institutional buyers across
              India with genuine branded textiles at transparent wholesale mill rates.
            </p>
          </div>
        </div>

        {/* 4 Perks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {perks.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="bg-white p-4 rounded border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded bg-[#0c2340] text-[#c59b27] flex items-center justify-center mb-3">
                  <Icon size={20} />
                </div>
                <h4 className="font-bold text-xs text-[#0c2340] mb-1">{p.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Form + Pricing Grid */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Business Enquiry Form */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
            <h2 className="text-base font-extrabold text-[#0c2340] pb-3 border-b border-slate-200 mb-4">
              Submit Official Business Enquiry
            </h2>
            {submitted ? (
              <div className="p-8 text-center bg-green-50 rounded border border-green-200">
                <div className="w-12 h-12 rounded bg-green-700 text-white flex items-center justify-center mx-auto mb-3 font-bold">
                  ✓
                </div>
                <h3 className="font-bold text-sm text-green-900 mb-1">Enquiry Registered Successfully!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Our wholesale trade officer will contact you within 24 hours with catalog price lists and quotation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Person Name *</label>
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Shop / Firm / Boutique Name *</label>
                    <input
                      required
                      name="business"
                      value={form.business}
                      onChange={handleChange}
                      placeholder="e.g. Patel Textile Agency"
                      className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                    <input
                      required
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Email Address *</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="orders@pateltextiles.com"
                      className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Monthly Volume Requirement</label>
                  <input
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 500 pcs/month (Sarees + Shirting)"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specific Product Requirements / Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about brands, categories, size requirements, or dispatch destination..."
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 outline-none focus:border-[#0c2340]"
                  />
                </div>

                <button type="submit" className="btn-red w-full py-2.5 rounded font-bold text-xs shadow">
                  Submit Wholesale Proforma Request
                </button>
              </form>
            )}
          </div>

          {/* Slabs Side Box */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded border border-slate-200 shadow-sm">
              <h3 className="font-extrabold text-sm text-[#0c2340] pb-2 border-b border-slate-200 mb-3">
                Standard Volume Discount Slabs
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { qty: "50 – 99 pieces", off: "12% Off Mill Rate" },
                  { qty: "100 – 249 pieces", off: "18% Off Mill Rate" },
                  { qty: "250 – 499 pieces", off: "22% Off Mill Rate" },
                  { qty: "500+ pieces", off: "25%+ Custom Factory Quote" },
                ].map((row) => (
                  <div key={row.qty} className="flex items-center justify-between py-2.5">
                    <span className="text-slate-600">{row.qty}</span>
                    <span className="font-extrabold text-[#d32f2f]">{row.off}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0c2340] text-white p-5 rounded border border-slate-800 shadow-sm text-xs space-y-2">
              <h4 className="font-bold text-white text-sm">Direct Wholesale Desk</h4>
              <p className="text-slate-300 text-[11px]">Speak directly with our senior trade specialist:</p>
              <div className="pt-2 border-t border-white/10 space-y-1.5 font-semibold text-slate-200">
                <p className="flex items-center gap-2">
                  <Phone size={13} className="text-[#c59b27]" /> +91 98765 43210
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={13} className="text-[#c59b27]" /> wholesale@krishnatextiles.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
