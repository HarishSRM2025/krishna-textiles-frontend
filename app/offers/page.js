"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Tag, Sparkles, Percent, Package, Truck, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function OffersPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      setLoading(true);
      try {
        const prodData = await api.products.getAll();
        const products = Array.isArray(prodData) ? prodData : (prodData.data || []);
        const discounted = products
          .filter((p) => (Number(p.discount) || 0) > 0 || (Number(p.mrp) > Number(p.price)))
          .sort((a, b) => (Number(b.discount) || 0) - (Number(a.discount) || 0));
        setDeals(discounted.length > 0 ? discounted : products);
      } catch (err) {
        console.error("Error loading offers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6">
      <div className="container-x">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#0c2340]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#0c2340] font-bold">Special Deals & Offers</span>
        </div>

        {/* Hero Banner */}
        <div className="bg-[#0c2340] rounded border border-slate-800 text-white p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded bg-[#d32f2f] text-white flex items-center justify-center font-bold shrink-0 shadow">
              <Sparkles size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#c59b27] uppercase tracking-wider block mb-0.5">
                Seasonal Clearance & Mill Slabs
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Textile Deal Zone — Factory Direct Rates
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Direct manufacturer promotional pricing across innerwear, shirting, sarees, and home textiles.
              </p>
            </div>
          </div>
          <Link
            href="/wholesale"
            className="btn-red text-xs px-4 py-2 rounded shrink-0 font-bold"
          >
            Bulk Wholesale Slabs
          </Link>
        </div>

        {/* 3 Offer Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-white p-4 rounded border border-amber-200 shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Percent size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-amber-900">Buy More, Save More Slabs</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Buy 2: 5% Extra · Buy 5: 10% Extra · Buy 10: 15% Extra
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-red-200 shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-red-100 text-[#d32f2f] flex items-center justify-center shrink-0">
              <Package size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-red-900">Wholesale Tier Pricing</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                50+ piece volume slabs available for shop owners & boutiques.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-green-200 shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-green-100 text-green-800 flex items-center justify-center shrink-0">
              <Truck size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-green-900">Free Pan-India Delivery</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Automatic zero shipping fee on all orders above ₹999.
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">
            All Discounted Textile Deals ({deals.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Sorted by Highest Discount</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#0c2340]" size={36} />
          </div>
        ) : deals.length === 0 ? (
          <div className="bg-white p-12 text-center text-xs text-slate-500 rounded border border-slate-200">
            No active promotional deals right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {deals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
