"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import categories from "@/data/categories.json";
import products from "@/data/products.json";
import { categoryIconMap } from "./Header";
import { ChevronRight, Tag } from "lucide-react";

export default function CategoryGrid() {
  const shown = categories.slice(0, 12);

  // Compute product count per category
  const getProductCount = (catId) => {
    return products.filter((p) => p.category === catId).length;
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
              Discover verified quality innerwear, sarees, shirting, knitwear &amp; home textiles from Indian mills.
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
            loop={true}
            freeMode={true}
            autoplay={{ delay: 2400, disableOnInteraction: false, pauseOnMouseEnter: true }}
            className="category-mobile-swiper py-1"
          >
            {categories.map((c) => {
              const Icon = categoryIconMap[c.id] || Tag;
              const count = getProductCount(c.id);
              return (
                <SwiperSlide key={c.id} style={{ width: "160px" }}>
                  <Link
                    href={`/category/${c.id}`}
                    className="flex items-center gap-2.5 p-2.5 rounded bg-white border border-slate-200 hover:border-slate-400 shadow-sm transition-all text-slate-800"
                  >
                    <div
                      className="w-9 h-9 rounded flex items-center justify-center shrink-0 text-white"
                      style={{ backgroundColor: c.color || "#0c2340" }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-800 leading-tight truncate">
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

        {/* Desktop View ONLY (lg and up): Previous 6-Column Grid Layout */}
        <div className="hidden lg:grid grid-cols-6 gap-3">
          {shown.map((c) => {
            const Icon = categoryIconMap[c.id] || Tag;
            const count = getProductCount(c.id);
            return (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="group flex items-center gap-3 p-3 rounded bg-white border border-slate-200 hover:border-[#0c2340] hover:shadow-md transition-all text-slate-800"
              >
                <div
                  className="w-10 h-10 rounded flex items-center justify-center shrink-0 text-white shadow-sm group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: c.color || "#0c2340" }}
                >
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-800 leading-tight truncate group-hover:text-[#d32f2f] transition-colors">
                    {c.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
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
