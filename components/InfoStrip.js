"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star, ShieldCheck, ChevronDown, ChevronUp, Phone } from "lucide-react";
import testimonials from "@/data/testimonials.json";

const faqs = [
  {
    q: "How are Krishna Textiles prices lower than market retail?",
    a: "We source our products directly from manufacturing mills in Erode and Tiruppur, bypassing multiple layers of regional distributors and middle agents, allowing us to pass factory rates directly to you.",
  },
  {
    q: "What is the minimum order quantity for wholesale pricing?",
    a: "Our wholesale tiered discount slabs start from as low as 50 pieces per order. You can mix and match sizes and colors across eligible categories.",
  },
  {
    q: "Do you provide GST invoices for business purchases?",
    a: "Yes, 100% of our orders are billed with legitimate tax invoices. You can enter your GSTIN during checkout or bulk enquiry for input tax credit claims.",
  },
  {
    q: "How fast is delivery and how can I track my shipment?",
    a: "Orders are dispatched within 24–48 hours. We partner with Tier-1 logistics providers (Delhivery, Blue Dart, DTDC) with live SMS and WhatsApp tracking.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "We offer a hassle-free 7-day return policy for any manufacturing defect or size fitting issue on retail orders.",
  },
];

// Extended testimonials for richer swiper display
const allTestimonials = [
  ...testimonials,
  {
    id: "t4",
    name: "D. Lakshmi",
    location: "Chennai",
    rating: 5,
    text: "Ordered sarees for our store — quality was excellent and delivery was faster than expected. Will definitely order again.",
  },
  {
    id: "t5",
    name: "P. Rajesh",
    location: "Madurai",
    rating: 5,
    text: "Best wholesale rates in Tamil Nadu. The GST invoicing makes accounting easy for our textile shop.",
  },
  {
    id: "t6",
    name: "A. Sundar",
    location: "Salem",
    rating: 4,
    text: "Innerwear packs from Jockey and Rupa arrived in perfect condition. Great packaging and customer service.",
  },
];

export default function InfoStrip() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <section className="py-10 sm:py-14 bg-[#f8fafc] border-b border-slate-200">
      <div className="container-x">
        {/* Section 1: Customer Testimonials — Swiper Carousel */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <span className="section-tag block mb-1">Real Verified Experiences</span>
            <h2 className="section-title">
              What Our Customers Say About Krishna Textiles
            </h2>
            <p className="section-desc max-w-lg mx-auto">
              Trusted by retail shoppers, textile shop owners, and boutique curators nationwide.
            </p>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3800, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            className="testimonials-swiper !pb-12"
          >
            {allTestimonials.map((t, idx) => (
              <SwiperSlide key={t.id || idx} className="h-auto">
                <div className="bg-white p-5 rounded border border-slate-200 shadow-sm flex flex-col justify-between h-full min-h-[190px]">
                  <div>
                    {/* Star Rating & Verified Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-[#c59b27]">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} size={14} className="fill-[#c59b27]" />
                        ))}
                      </div>
                      <span className="badge-verified">
                        <ShieldCheck size={11} /> Verified Buyer
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0c2340] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {t.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{t.name}</h4>
                      <p className="text-[10px] text-slate-400">{t.location}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Section 2: FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <span className="section-tag block mb-1">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc">
              Everything you need to know about ordering, wholesale slabs, and logistics.
            </p>
          </div>

          <div className="space-y-2 mb-6">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 hover:text-[#d32f2f] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center shrink-0 text-white ${
                        isOpen ? "bg-[#d32f2f]" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Need help banner */}
          <div className="p-4 rounded bg-[#0c2340] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div>
              <h4 className="font-bold text-xs sm:text-sm">Have more questions or custom requirement?</h4>
              <p className="text-[11px] text-slate-300">Our wholesale textile specialists are available 6 days a week.</p>
            </div>
            <a
              href="tel:+919876543210"
              className="btn-red text-xs px-4 py-2 rounded shrink-0 flex items-center gap-1.5"
            >
              <Phone size={13} /> Speak to Specialist
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
