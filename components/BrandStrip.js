"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import brands from "@/data/brands.json";
import { ChevronRight } from "lucide-react";

// Crisp Authentic Visual Brand Logos (Image-Only, No Text Labels)
function BrandLogoGraphic({ id, name }) {
  switch (id) {
    case "jockey":
      return (
        <svg viewBox="0 0 160 50" className="h-8 w-auto fill-current text-[#0c2340]">
          <path d="M15 10c-3.3 0-6 2.7-6 6v14c0 3.3 2.7 6 6 6s6-2.7 6-6V16c0-3.3-2.7-6-6-6zm0 20c-1.1 0-2-.9-2-2V16c0-1.1.9-2 2-2s2 .9 2 2v12c0 1.1-.9 2-2 2z" fill="#d32f2f"/>
          <text x="32" y="32" fontFamily="Arial Black, Impact, sans-serif" fontSize="22" fontWeight="900" letterSpacing="1.5" fill="#0c2340">
            JOCKEY
          </text>
        </svg>
      );
    case "rupa":
      return (
        <svg viewBox="0 0 140 50" className="h-8 w-auto">
          <circle cx="20" cy="25" r="14" fill="#d32f2f" />
          <path d="M14 20 L26 20 L20 31 Z" fill="#ffffff" />
          <text x="42" y="33" fontFamily="Arial, Helvetica, sans-serif" fontSize="24" fontWeight="900" fontStyle="italic" fill="#d32f2f">
            RUPA
          </text>
        </svg>
      );
    case "vip":
      return (
        <svg viewBox="0 0 120 50" className="h-8 w-auto">
          <rect x="6" y="8" width="108" height="34" rx="6" fill="#1e3a8a" />
          <text x="60" y="33" textAnchor="middle" fontFamily="Arial Black, Impact, sans-serif" fontSize="22" fontWeight="900" letterSpacing="3" fill="#ffffff">
            V.I.P
          </text>
        </svg>
      );
    case "dollar":
      return (
        <svg viewBox="0 0 150 50" className="h-8 w-auto">
          <circle cx="20" cy="25" r="15" fill="#eab308" />
          <text x="20" y="32" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="20" fontWeight="900" fill="#0c2340">
            $
          </text>
          <text x="45" y="33" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900" letterSpacing="1" fill="#0c2340">
            DOLLAR
          </text>
        </svg>
      );
    case "luxcozi":
      return (
        <svg viewBox="0 0 160 50" className="h-8 w-auto">
          <path d="M12 14 L18 8 L24 14 L30 8 L36 14 L36 34 L12 34 Z" fill="#b91c1c" />
          <text x="44" y="27" fontFamily="Georgia, serif" fontSize="19" fontWeight="900" fill="#b91c1c">
            LUX
          </text>
          <text x="90" y="27" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="800" fontStyle="italic" fill="#c59b27">
            COZI
          </text>
        </svg>
      );
    case "vimal":
      return (
        <svg viewBox="0 0 140 50" className="h-8 w-auto">
          <polygon points="20,10 32,25 20,40 8,25" fill="#dc2626" />
          <text x="42" y="32" fontFamily="Arial Black, sans-serif" fontSize="20" fontWeight="900" letterSpacing="2" fill="#1e293b">
            VIMAL
          </text>
        </svg>
      );
    case "enamor":
      return (
        <svg viewBox="0 0 150 50" className="h-8 w-auto">
          <text x="75" y="32" textAnchor="middle" fontFamily="Didot, Bodoni MT, Georgia, serif" fontSize="24" fontWeight="600" letterSpacing="4" fill="#be185d">
            enamor
          </text>
        </svg>
      );
    case "macroman":
      return (
        <svg viewBox="0 0 170 50" className="h-8 w-auto">
          <path d="M10 34 L10 12 L18 24 L26 12 L26 34" stroke="#0f172a" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <text x="36" y="32" fontFamily="Impact, Arial Black, sans-serif" fontSize="21" letterSpacing="1.5" fill="#0f172a">
            MACROMAN
          </text>
        </svg>
      );
    case "trylo":
      return (
        <svg viewBox="0 0 130 50" className="h-8 w-auto">
          <text x="65" y="33" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900" fontStyle="italic" letterSpacing="1" fill="#7c3aed">
            TRYLO
          </text>
        </svg>
      );
    case "siyarams":
      return (
        <svg viewBox="0 0 160 50" className="h-8 w-auto">
          <path d="M80 6 L86 16 L74 16 Z" fill="#c59b27" />
          <text x="80" y="34" textAnchor="middle" fontFamily="Times New Roman, serif" fontSize="22" fontWeight="bold" letterSpacing="1" fill="#0c2340">
            Siyaram&apos;s
          </text>
        </svg>
      );
    default:
      return (
        <div className="h-8 px-4 bg-slate-100 rounded flex items-center justify-center font-extrabold text-xs tracking-wider text-[#0c2340]">
          {name.toUpperCase()}
        </div>
      );
  }
}

export default function BrandStrip() {
  return (
    <section className="bg-white py-6 sm:py-8 border-b border-slate-200">
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
          <div>
            <span className="section-tag">Direct Mill Partnerships</span>
            <h2 className="section-title">Trusted Indian Textile Brands</h2>
          </div>
          <Link
            href="/brands"
            className="text-xs font-bold text-[#0c2340] hover:text-[#d32f2f] flex items-center gap-1 transition-colors self-start sm:self-auto shrink-0"
          >
            View All Brands <ChevronRight size={14} />
          </Link>
        </div>

        {/* Continuous Auto-Sliding Swiper Ribbon — Image / Logo Only (No Text) */}
        <div className="-mx-3 sm:mx-0">
          <Swiper
            modules={[Autoplay, FreeMode]}
            slidesPerView="auto"
            spaceBetween={16}
            loop={true}
            freeMode={true}
            autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
            speed={4000}
            className="brand-ribbon-swiper py-2"
          >
            {[...brands, ...brands].map((b, i) => (
              <SwiperSlide key={`${b.id}-${i}`} style={{ width: "auto" }}>
                <Link
                  href={`/brands/${b.id}`}
                  className="flex items-center justify-center px-6 py-3.5 rounded bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#0c2340] hover:shadow-md transition-all group min-w-[140px] sm:min-w-[160px] h-14"
                  title={b.name}
                  aria-label={b.name}
                >
                  <BrandLogoGraphic id={b.id} name={b.name} />
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
