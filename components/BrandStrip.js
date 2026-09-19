"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import { ChevronRight, Award, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

const defaultBrands = [
  { id: "krishna-heritage-silk", slug: "krishna-heritage-silk", name: "Krishna Heritage Silk", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop" },
  { id: "varnam-handlooms", slug: "varnam-handlooms", name: "Varnam Handlooms", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop" },
  { id: "aura-linen", slug: "aura-linen", name: "Aura Linen & Cottons", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&auto=format&fit=crop" },
  { id: "ananya-festive", slug: "ananya-festive", name: "Ananya Festive Weaves", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop" },
];

export default function BrandStrip() {
  const [brands, setBrands] = useState(defaultBrands);

  useEffect(() => {
    let isMounted = true;
    api.brands
      .getAll()
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        if (isMounted && list.length > 0) {
          setBrands(list);
        }
      })
      .catch((err) => {
        console.warn("BrandStrip: Using fallback brands", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const slideBrands = brands.length > 0 ? [...brands, ...brands, ...brands] : defaultBrands;

  return (
    <section className="bg-white py-4 border-b border-slate-200">
      <div className="container-x">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Direct Mill Partner Brands
            </span>
          </div>
          <Link
            href="/brands"
            className="text-xs font-bold text-[#0c2340] hover:text-[#d32f2f] flex items-center gap-1 transition-colors"
          >
            View All Brands <ChevronRight size={14} />
          </Link>
        </div>

        {/* Continuous Auto-Sliding Swiper Ribbon */}
        <div className="-mx-3 sm:mx-0">
          <Swiper
            modules={[Autoplay, FreeMode]}
            slidesPerView="auto"
            spaceBetween={14}
            loop={slideBrands.length > 2}
            freeMode={true}
            autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
            speed={4500}
            className="brand-ribbon-swiper py-1"
          >
            {slideBrands.map((b, i) => (
              <SwiperSlide key={`${b.id || b.slug}-${i}`} style={{ width: "auto" }}>
                <Link
                  href={`/brands/${b.slug || b.id}`}
                  className="flex items-center justify-center px-3 py-2 rounded-lg bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#0c2340] hover:shadow-md transition-all group h-14 w-32 sm:w-36"
                  title={b.name}
                  aria-label={b.name}
                >
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={b.name}
                      className="max-h-10 max-w-full object-contain rounded group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.target.style.display = "none";
                        if (e.target.nextSibling) e.target.nextSibling.style.display = "inline";
                      }}
                    />
                  ) : null}
                  <span className={`text-xs font-bold text-slate-700 ${b.image ? "hidden" : "inline"}`}>
                    {b.name}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .brand-ribbon-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
}
