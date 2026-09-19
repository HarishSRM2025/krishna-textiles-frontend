"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import { categoryIconMap } from "./Header";
import { ChevronRight, Tag, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

const defaultCategories = [
  {
    id: "pure-silk-sarees",
    slug: "pure-silk-sarees",
    name: "Pure Silk Sarees",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop",
    color: "#880e4f",
  },
  {
    id: "cotton-sarees-dhotis",
    slug: "cotton-sarees-dhotis",
    name: "Cotton Sarees & Dhotis",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop",
    color: "#d97706",
  },
  {
    id: "designer-kurtis",
    slug: "designer-kurtis",
    name: "Designer Kurtis & Tunics",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop",
    color: "#9333ea",
  },
  {
    id: "mens-ethnic-shirting",
    slug: "mens-ethnic-shirting",
    name: "Mens Ethnic & Shirting",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop",
    color: "#2563eb",
  },
  {
    id: "home-furnishings",
    slug: "home-furnishings",
    name: "Home Furnishings & Bedding",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop",
    color: "#059669",
  },
  {
    id: "dress-materials",
    slug: "dress-materials",
    name: "Dress Materials & Suits",
    image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&auto=format&fit=crop",
    color: "#dc2626",
  },
];

export default function CategoryGrid() {
  const [categories, setCategories] = useState(defaultCategories);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.categories.getAll().catch(() => []),
      api.products.getAll({ limit: 200 }).catch(() => ({ data: [] })),
    ]).then(([catRes, prodRes]) => {
      if (!isMounted) return;
      const cats = Array.isArray(catRes) ? catRes : (catRes?.data || []);
      const prods = Array.isArray(prodRes) ? prodRes : (prodRes?.data || []);
      if (cats.length > 0) {
        setCategories(cats);
      }
      if (prods.length > 0) {
        setProducts(prods);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const getProductCount = (slugOrId, cat) => {
    if (cat?._count?.products !== undefined) {
      return cat._count.products;
    }
    return products.filter(
      (p) =>
        p.category === slugOrId ||
        p.categoryId === slugOrId ||
        p.category?.toLowerCase() === cat?.name?.toLowerCase() ||
        p.categoryRef?.slug === slugOrId
    ).length;
  };

  return (
    <section className="bg-white py-8 sm:py-10 border-b border-slate-200">
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <span className="section-tag">Direct Factory Sourced</span>
            <h2 className="section-title">Explore Textile Categories</h2>
            <p className="section-desc">
              Discover authentic pure silks, organic cottons, designer kurtis, shirting &amp; home textiles directly from South Indian looms.
            </p>
          </div>
          <Link
            href="/category/all"
            className="text-xs font-bold text-[#0c2340] hover:text-[#d32f2f] flex items-center gap-1 transition-colors self-start sm:self-auto shrink-0"
          >
            View All Categories <ChevronRight size={14} />
          </Link>
        </div>

        {/* Mobile View ONLY (< lg): Auto-Scrolling Swiper Slider */}
        <div className="block lg:hidden">
          <Swiper
            modules={[Autoplay, FreeMode]}
            slidesPerView="auto"
            spaceBetween={10}
            loop={categories.length > 2}
            freeMode={true}
            autoplay={{ delay: 2400, disableOnInteraction: false, pauseOnMouseEnter: true }}
            className="category-mobile-swiper py-1"
          >
            {categories.map((c) => {
              const Icon = categoryIconMap[c.slug || c.id] || Tag;
              const count = getProductCount(c.slug || c.id, c);
              return (
                <SwiperSlide key={c.id || c.slug} style={{ width: "180px" }}>
                  <Link
                    href={`/category/${c.slug || c.id}`}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-400 shadow-sm transition-all"
                  >
                    {/* Landscape image on left */}
                    <div className="shrink-0 w-16 h-10 rounded-md overflow-hidden border border-slate-200 bg-slate-100 relative">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`absolute inset-0 items-center justify-center text-white ${c.image ? "hidden" : "flex"}`}
                        style={{ backgroundColor: c.color || "#0c2340" }}
                      >
                        <Icon size={16} />
                      </div>
                    </div>
                    {/* Text on right */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[11px] font-bold text-slate-800 leading-tight truncate">
                        {c.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {count > 0 ? `${count} items` : "Explore"}
                      </span>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Desktop View ONLY (lg and up): Compact left-image / right-text grid */}
        <div className="hidden lg:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {categories.map((c) => {
            const Icon = categoryIconMap[c.slug || c.id] || Tag;
            const count = getProductCount(c.slug || c.id, c);
            return (
              <Link
                key={c.id || c.slug}
                href={`/category/${c.slug || c.id}`}
                className="group flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#0c2340] hover:shadow-md transition-all"
              >
                {/* Landscape image on left */}
                <div className="shrink-0 w-14 h-9 rounded overflow-hidden border border-slate-200 bg-slate-100 relative group-hover:scale-105 transition-transform">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 items-center justify-center text-white ${c.image ? "hidden" : "flex"}`}
                    style={{ backgroundColor: c.color || "#0c2340" }}
                  >
                    <Icon size={20} />
                  </div>
                </div>
                {/* Text on right */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-[11px] font-bold text-slate-800 leading-tight truncate group-hover:text-[#d32f2f] transition-colors">
                    {c.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {count > 0 ? `${count} products` : "Catalog"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
