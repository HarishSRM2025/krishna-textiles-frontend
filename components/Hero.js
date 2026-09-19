"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

const fallbackSlides = [
  {
    id: "fb-1",
    tag: "10,000+ PRODUCTS · PAN-INDIA DELIVERY",
    title: "Never Run Out of\nQuality Textiles",
    subtitle:
      "Direct manufacturer pricing for retail & bulk orders. Over 10,000+ products delivered across 28,000+ pincodes in India.",
    benefits: ["100% Genuine Verified Brands", "Express Pan-India Logistics", "Wholesale & Dealer Slabs"],
    buttonText: "Explore Catalog",
    linkUrl: "/category/all",
    secondaryButtonText: "View Offers",
    secondaryLinkUrl: "/offers",
    image: "/hero-textiles-v2.jpg",
    accentColor: "#c59b27",
  },
  {
    id: "fb-2",
    tag: "FESTIVE & BULK SEASON OFFERS",
    title: "Premium Sarees,\nKurtis & Apparel",
    subtitle:
      "Handcrafted cotton & silk collections sourced straight from Tamil Nadu weavers. Up to 40% off retail prices.",
    benefits: ["Up to 40% Off Retail Prices", "GST Invoiced Orders", "Easy 7-Day Replacement"],
    buttonText: "View Special Offers",
    linkUrl: "/offers",
    secondaryButtonText: "Shop Sarees",
    secondaryLinkUrl: "/category/pure-silk-sarees",
    image: "/hero-sarees-v2.jpg",
    accentColor: "#f8bbd0",
  },
];

export default function Hero() {
  const [slides, setSlides] = useState(fallbackSlides);

  useEffect(() => {
    let isMounted = true;
    api.cms
      .getBanners()
      .then((res) => {
        if (isMounted && res?.data && res.data.length > 0) {
          const activeBanners = res.data
            .filter((b) => b.isActive !== false)
            .sort((a, b) => (a.priority || 0) - (b.priority || 0));

          if (activeBanners.length > 0) {
            setSlides(activeBanners);
          }
        }
      })
      .catch((err) => {
        console.warn("Hero: Using fallback slides, CMS banner fetch failed", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="border-b border-slate-300 w-full overflow-hidden">
      <div className="relative w-full overflow-hidden" style={{ minHeight: "440px" }}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          loop={slides.length > 1}
          className="w-full hero-swiper"
        >
          {slides.map((slide, idx) => {
            const accent = slide.accentColor || "#c59b27";
            const benefits = slide.benefits || [
              "Certified Mill Craftsmanship",
              "Direct Factory Invoicing",
              "Fast Express Dispatch",
            ];

            return (
              <SwiperSlide key={slide.id || idx}>
                <div className="relative w-full flex items-center min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full bg-slate-900">
                    <Image
                      src={slide.image || "/hero-textiles-v2.jpg"}
                      alt={slide.title || "Krishna Textiles"}
                      fill
                      sizes="100vw"
                      className="object-cover object-center w-full h-full"
                      priority={idx === 0}
                      unoptimized={true}
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(8,24,43,0.92) 0%, rgba(8,24,43,0.72) 48%, rgba(8,24,43,0.25) 100%)",
                    }}
                  />

                  {/* Left-Aligned Text Content */}
                  <div className="container-x w-full relative z-10 py-12 sm:py-16 lg:py-20 flex items-center justify-start">
                    <div className="max-w-xl lg:max-w-2xl text-left">
                      {/* Tag badge */}
                      {slide.tag && (
                        <div
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest w-fit mb-3 sm:mb-4 shadow"
                          style={{
                            backgroundColor: slide.accentColor || "#c59b27",
                            color: "#08182b",
                          }}
                        >
                          <Sparkles size={11} />
                          {slide.tag}
                        </div>
                      )}

                      {/* Headline */}
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.15] mb-3 sm:mb-4 whitespace-pre-line tracking-tight text-white drop-shadow-lg">
                        {slide.title}
                      </h1>

                      {/* Subtitle */}
                      {slide.subtitle && (
                        <p className="text-xs sm:text-sm lg:text-base max-w-lg leading-relaxed mb-5 sm:mb-7 font-medium text-white/90 drop-shadow">
                          {slide.subtitle}
                        </p>
                      )}

                      {/* Benefits */}
                      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-7 sm:mb-9">
                        {benefits.map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white drop-shadow">
                            <CheckCircle2 size={14} className="shrink-0" style={{ color: accent }} />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTAs */}
                      <div className="flex flex-wrap gap-3">
                        {slide.buttonText && (
                          <Link
                            href={slide.linkUrl || "/category/all"}
                            className="text-xs sm:text-sm px-6 sm:px-8 py-2.5 sm:py-3 rounded flex items-center gap-2 transition-all duration-200 hover:scale-105 bg-[#c59b27] hover:bg-[#b8891f] text-[#08182b] font-extrabold shadow-lg"
                          >
                            {slide.buttonText} <ArrowRight size={15} />
                          </Link>
                        )}
                        {slide.secondaryButtonText && (
                          <Link
                            href={slide.secondaryLinkUrl || "/offers"}
                            className="text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded flex items-center gap-2 transition-all duration-200 hover:scale-105 bg-white/10 hover:bg-white/25 text-white border border-white/40 font-bold backdrop-blur-sm"
                          >
                            {slide.secondaryButtonText}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
