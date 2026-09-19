"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ChevronRight, ArrowUpRight, Loader2 } from "lucide-react";

const defaultBrands = [
  { id: "krishna-heritage-silk", slug: "krishna-heritage-silk", name: "Krishna Heritage Silk", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop", tagline: "Pure Kanchipuram & Banarasi silk sarees" },
  { id: "varnam-handlooms", slug: "varnam-handlooms", name: "Varnam Handlooms", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop", tagline: "Organic natural dyed cottons & handwoven dhotis" },
  { id: "aura-linen", slug: "aura-linen", name: "Aura Linen & Cottons", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&auto=format&fit=crop", tagline: "Executive linen shirts & 300TC bedsheets" },
  { id: "ananya-festive", slug: "ananya-festive", name: "Ananya Festive Weaves", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop", tagline: "Bridal lehenga fabrics & unstitched suits" },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState(defaultBrands);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadBrandsData() {
      setLoading(true);
      try {
        const [brandData, prodData] = await Promise.all([
          api.brands.getAll(),
          api.products.getAll(),
        ]);
        setBrands(Array.isArray(brandData) ? brandData : (brandData.data || []));
        setProducts(Array.isArray(prodData) ? prodData : (prodData.data || []));
      } catch (err) {
        console.error("Error loading brands:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBrandsData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6">
      <div className="container-x">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#0c2340]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#0c2340] font-bold">Partner Brands</span>
        </div>

        <div className="bg-white p-6 rounded border border-slate-200 shadow-sm mb-8">
          <span className="section-tag block mb-1">Direct Brand Alliances</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0c2340] mb-2">
            Explore 100% Genuine Partner Brands
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            All brand merchandise listed on Krishna Textiles is sourced directly from authorized regional distribution channels with certified authenticity guarantees.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#0c2340]" size={36} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((b) => {
              const count = b._count?.products !== undefined
                ? b._count.products
                : products.filter((p) =>
                    p.brandId === b.id ||
                    p.brandId === b.slug ||
                    p.brandRefId === b.id ||
                    p.brandRef?.id === b.id ||
                    p.brandRef?.slug === b.slug ||
                    p.brand?.toLowerCase() === b.name?.toLowerCase()
                  ).length;
              return (
                <Link
                  key={b.id}
                  href={`/brands/${b.slug || b.id}`}
                  className="bg-white p-5 rounded border border-slate-200 hover:border-[#0c2340] shadow-sm hover:shadow-md transition-all flex items-start justify-between group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {b.image ? (
                        <img
                          src={b.image}
                          alt={b.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-[#0c2340] text-white font-black text-sm items-center justify-center ${b.image ? "hidden" : "flex"}`}>
                        {b.name.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 group-hover:text-[#d32f2f] transition-colors">
                        {b.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{b.tagline || `${b.name} textiles & apparel`}</p>
                      <span className="inline-block mt-2 text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        {count} items listed
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-400 group-hover:text-[#0c2340] transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
