"use client";

import {
  Package,
  MapPin,
  ShoppingBag,
  History,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Building2,
} from "lucide-react";

const stats = [
  {
    value: "10,000+",
    label: "Textile SKUs Listed",
    desc: "From innerwear to luxury silk sarees",
    icon: Package,
    highlight: false,
  },
  {
    value: "28,000+",
    label: "Pincodes Covered",
    desc: "Seamless pan-India transport network",
    icon: MapPin,
    highlight: false,
  },
  {
    value: "50,000+",
    label: "Orders Fulfilled",
    desc: "Trusted by families and boutiques",
    icon: ShoppingBag,
    highlight: true, // Highlighted card with red border like in reference image
  },
  {
    value: "18+ Years",
    label: "Manufacturing Heritage",
    desc: "Rooted in Tamil Nadu textile capitals",
    icon: History,
    highlight: false,
  },
];

export default function WhyShop() {
  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="container-x text-center">
        {/* Section Header */}
        <span className="section-tag block mb-1">
          The Krishna Textiles Advantage
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0c2340] mb-2">
          Why Over 50,000+ Customers & 500+ Dealers Choose Us
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-8">
          Built on direct mill relationships, strict quality assurance, transparent wholesale rates, and fast dispatch.
        </p>

        {/* 4 Metrics Counter Cards (Matching Reference Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className={`p-5 rounded transition-all ${
                  s.highlight
                    ? "bg-[#fff5f5] border-2 border-[#d32f2f] shadow-md"
                    : "bg-[#f8fafc] border border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded flex items-center justify-center ${
                      s.highlight
                        ? "bg-[#d32f2f] text-white shadow-sm"
                        : "bg-white border border-slate-200 text-[#0c2340]"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  {s.highlight && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#d32f2f] bg-white px-2 py-0.5 rounded border border-[#d32f2f]/30">
                      Verified Milestone
                    </span>
                  )}
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] mb-1">
                  {s.value}
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-800 mb-0.5">
                  {s.label}
                </div>
                <p className="text-[11px] text-slate-500">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* 3 Value Pillars strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-100">
          <span className="flex items-center gap-1.5 text-green-700">
            <CheckCircle2 size={15} /> Direct Mill Pricing Without Middlemen
          </span>
          <span className="flex items-center gap-1.5 text-[#0c2340]">
            <ShieldCheck size={15} /> 100% Genuine Brand Sourcing
          </span>
          <span className="flex items-center gap-1.5 text-[#d32f2f]">
            <Truck size={15} /> 24-Hour Dispatch & Transport Booking
          </span>
        </div>
      </div>
    </section>
  );
}
