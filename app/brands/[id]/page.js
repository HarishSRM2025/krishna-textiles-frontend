"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function BrandDetailPage({ params }) {
  const [brand, setBrand] = useState(null);
  const [brandProducts, setBrandProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrandData() {
      setLoading(true);
      try {
        const [brandData, prodData] = await Promise.all([
          api.brands.getOne(params.id).catch(() => null),
          api.products.getAll({ brandId: params.id }),
        ]);

        if (brandData && (brandData.id || brandData.name)) {
          setBrand(brandData);
        } else {
          // Fallback: check all brands
          const allBrands = await api.brands.getAll();
          const list = Array.isArray(allBrands) ? allBrands : (allBrands.data || []);
          const found = list.find((b) => b.id === params.id || b.name.toLowerCase() === params.id.toLowerCase());
          setBrand(found || null);
        }

        const prods = Array.isArray(prodData) ? prodData : (prodData.data || []);
        setBrandProducts(prods);
      } catch (err) {
        console.error("Error loading brand details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBrandData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-[#0c2340]" size={36} />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="container-x py-16 text-center">
        <p className="text-xl font-bold text-[#0c2340] mb-4">Brand Not Found</p>
        <Link href="/brands" className="btn-primary w-fit mx-auto text-xs">
          Browse Brand Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6">
      <div className="container-x">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#0c2340]">Home</Link>
          <ChevronRight size={12} />
          <Link href="/brands" className="hover:text-[#0c2340]">Brands</Link>
          <ChevronRight size={12} />
          <span className="text-[#0c2340] font-bold">{brand.name}</span>
        </div>

        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center shadow shrink-0">
              {brand.image ? (
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div className={`w-full h-full bg-[#0c2340] text-white font-black text-base items-center justify-center ${brand.image ? "hidden" : "flex"}`}>
                {brand.name.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#0c2340]">{brand.name}</h1>
                <span className="badge-verified">
                  <CheckCircle2 size={11} /> Authorized
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{brand.tagline || `${brand.name} authorized collection`}</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded">
            {brandProducts.length} Products Available
          </span>
        </div>

        {brandProducts.length === 0 ? (
          <div className="bg-white p-12 text-center text-xs text-slate-500 rounded border border-slate-200">
            No products available for this brand currently.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {brandProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
