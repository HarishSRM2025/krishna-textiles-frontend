"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const heroSlides = [
  {
    tag: "10,000+ PRODUCTS · PAN-INDIA DELIVERY",
    title: "Never Run Out of\nQuality Textiles",
    subtitle:
      "Direct manufacturer pricing for retail & bulk orders. Over 10,000+ products delivered across 28,000+ pincodes in India.",
    benefits: ["100% Genuine Verified Brands", "Express Pan-India Logistics", "Wholesale & Dealer Slabs"],
    primaryCta: { label: "Explore Catalog", href: "/category/all" },
    secondaryCta: { label: "View Offers", href: "/offers" },
    image: "/hero-textiles-v2.jpg",
    overlay: "linear-gradient(90deg, rgba(8,24,43,0.88) 0%, rgba(8,24,43,0.60) 45%, rgba(8,24,43,0.15) 100%)",
    accent: "#c59b27",
    badgeBg: "#d32f2f",
    badgeText: "#fff",
    primaryBtn: "bg-[#c59b27] hover:bg-[#b8891f] text-[#08182b] font-extrabold shadow-lg",
    secondaryBtn: "bg-white/10 hover:bg-white/25 text-white border border-white/40 font-bold backdrop-blur-sm",
  },
  {
    tag: "FESTIVE & BULK SEASON OFFERS",
    title: "Premium Sarees,\nKurtis & Apparel",
    subtitle:
      "Handcrafted cotton & silk collections sourced straight from Tamil Nadu weavers. Up to 40% off retail prices.",
    benefits: ["Up to 40% Off Retail Prices", "GST Invoiced Orders", "Easy 7-Day Replacement"],
    primaryCta: { label: "View Special Offers", href: "/offers" },
    secondaryCta: { label: "Shop Sarees", href: "/category/sarees" },
    image: "/hero-sarees-v2.jpg",
    overlay: "linear-gradient(90deg, rgba(50,10,30,0.88) 0%, rgba(50,10,30,0.55) 45%, rgba(50,10,30,0.15) 100%)",
    accent: "#f8bbd0",
    badgeBg: "#c59b27",
    badgeText: "#1a0000",
    primaryBtn: "bg-white hover:bg-slate-100 text-[#880e4f] font-extrabold shadow-lg",
    secondaryBtn: "bg-white/10 hover:bg-white/25 text-white border border-white/40 font-bold backdrop-blur-sm",
  },
  {
    tag: "MEN'S WEAR · INNERWEAR · CASUAL",
    title: "Top Brands at\nFactory Prices",
    subtitle:
      "Jockey, Rupa, Lux, Dollar & more — genuine brands sourced directly from Tiruppur knitwear mills.",
    benefits: ["Jockey, Rupa, Lux & 50+ Brands", "Factory Direct Invoicing", "Bulk Order Discounts"],
    primaryCta: { label: "Shop Men's Wear", href: "/category/mens-wear" },
    secondaryCta: { label: "Men's Innerwear", href: "/category/mens-innerwear" },
    image: "/hero-menswear-v2.jpg",
    overlay: "linear-gradient(90deg, rgba(10,20,45,0.88) 0%, rgba(10,20,45,0.55) 45%, rgba(10,20,45,0.15) 100%)",
    accent: "#80deea",
    badgeBg: "#0d47a1",
    badgeText: "#ffffff",
    primaryBtn: "bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-extrabold shadow-lg",
    secondaryBtn: "bg-white/10 hover:bg-white/25 text-white border border-white/40 font-bold backdrop-blur-sm",
  },
  {
    tag: "COMMERCIAL & RETAILER PARTNERSHIP",
    title: "Empowering 500+\nDealers Since 2006",
    subtitle:
      "Partner with Krishna Textiles for your boutique, retail shop, or institutional requirements at lowest mill rates.",
    benefits: ["Dedicated Account Manager", "Priority 24h Dispatch", "Credit & Transport Tie-ups"],
    primaryCta: { label: "Become a Dealer", href: "/wholesale" },
    secondaryCta: { label: "Browse Catalog", href: "/category/all" },
    image: "/hero-wholesale-v2.jpg",
    overlay: "linear-gradient(90deg, rgba(8,25,12,0.88) 0%, rgba(8,25,12,0.55) 45%, rgba(8,25,12,0.15) 100%)",
    accent: "#a5d6a7",
    badgeBg: "#2e7d32",
    badgeText: "#ffffff",
    primaryBtn: "bg-[#f9a825] hover:bg-[#f57f17] text-[#1b2800] font-extrabold shadow-lg",
    secondaryBtn: "bg-white/10 hover:bg-white/25 text-white border border-white/40 font-bold backdrop-blur-sm",
  },
];

export default function Hero() {
  return (
    <section className="border-b border-slate-300 w-full overflow-hidden">
      <div className="relative w-full overflow-hidden" style={{ minHeight: "440px" }}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          loop={true}
          className="w-full hero-swiper"
        >
          {heroSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full flex items-center min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] overflow-hidden">
                {/* Full-width High-Definition Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    className="object-cover object-center w-full h-full"
                    priority={idx === 0}
                    unoptimized={true}
                  />
                </div>

                {/* Left Gradient Overlay to make left-aligned text sharp and readable */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    background: slide.overlay,
                  }}
                />

                {/* Left-Aligned Text Content */}
                <div className="container-x w-full relative z-10 py-12 sm:py-16 lg:py-20 flex items-center justify-start">
                  <div className="max-w-xl lg:max-w-2xl text-left">
                    {/* Tag badge */}
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest w-fit mb-3 sm:mb-4 shadow"
                      style={{ backgroundColor: slide.badgeBg, color: slide.badgeText }}
                    >
                      <Sparkles size={11} />
                      {slide.tag}
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.15] mb-3 sm:mb-4 whitespace-pre-line tracking-tight text-white drop-shadow-lg">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-sm lg:text-base max-w-lg leading-relaxed mb-5 sm:mb-7 font-medium text-white/90 drop-shadow">
                      {slide.subtitle}
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mb-7 sm:mb-9">
                      {slide.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white drop-shadow">
                          <CheckCircle2 size={14} className="shrink-0" style={{ color: slide.accent }} />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={slide.primaryCta.href}
                        className={`text-xs sm:text-sm px-6 sm:px-8 py-2.5 sm:py-3 rounded flex items-center gap-2 transition-all duration-200 hover:scale-105 ${slide.primaryBtn}`}
                      >
                        {slide.primaryCta.label} <ArrowRight size={15} />
                      </Link>
                      <Link
                        href={slide.secondaryCta.href}
                        className={`text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded flex items-center gap-2 transition-all duration-200 hover:scale-105 ${slide.secondaryBtn}`}
                      >
                        {slide.secondaryCta.label}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
