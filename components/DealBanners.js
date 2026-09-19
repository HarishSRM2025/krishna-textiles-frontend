"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Tag, Package, Percent, Store, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

const defaultDeals = [
  {
    tag: "SPECIAL WHOLESALE TIER",
    title: "Volume Buying Slabs\nFor Boutiques & Retailers",
    desc: "Buy 50+ pcs: 12% off · Buy 200+ pcs: 18% off · Buy 500+ pcs: 25% off",
    cta: "Calculate Bulk Slabs",
    href: "/wholesale",
    bg: "#0c2340",
    textColor: "text-white",
    borderColor: "border-slate-700",
    accent: "text-[#c59b27]",
    icon: Package,
  },
  {
    tag: "FESTIVE COMBO OFFERS",
    title: "Family Textile Bundles\n& Pack Discounts",
    desc: "Save up to 40% when purchasing combo sets across innerwear and formal shirting.",
    cta: "Explore Combo Deals",
    href: "/offers",
    bg: "#ffffff",
    textColor: "text-slate-800",
    borderColor: "border-slate-200",
    accent: "text-[#d32f2f]",
    icon: Percent,
  },
  {
    tag: "DEALER PROGRAM",
    title: "Become a Verified\nRegional Distributor",
    desc: "Get exclusive regional dealer rates, credit terms, and direct factory transport dispatch.",
    cta: "Apply for Dealership",
    href: "/wholesale",
    bg: "#ffffff",
    textColor: "text-slate-800",
    borderColor: "border-slate-200",
    accent: "text-green-700",
    icon: Store,
  },
];

export default function DealBanners() {
  const [deals, setDeals] = useState(defaultDeals);

  useEffect(() => {
    let isMounted = true;
    api.offers
      .getAll({ isActive: "true" })
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        if (isMounted && list.length > 0) {
          const dynamicDeals = list.slice(0, 3).map((offer, index) => {
            const isDark = index === 0;
            const targetUrl =
              offer.targetType === "CATEGORY" && offer.targetName
                ? `/category/${offer.targetName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
                : offer.targetType === "BRAND" && offer.targetName
                ? `/brands/${offer.targetName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
                : "/offers";

            return {
              tag: offer.badgeText || (offer.discountValue ? `UP TO ${offer.discountValue}% OFF` : "PROMOTIONAL OFFER"),
              title: offer.title,
              desc: offer.description || "Exclusive direct-mill promotion available for a limited time.",
              cta: offer.targetName ? `Shop ${offer.targetName}` : "Explore Offer",
              href: targetUrl,
              bg: isDark ? "#0c2340" : "#ffffff",
              textColor: isDark ? "text-white" : "text-slate-800",
              borderColor: isDark ? "border-slate-700" : "border-slate-200",
              accent: isDark ? "text-[#c59b27]" : "text-[#d32f2f]",
              icon: isDark ? Sparkles : Percent,
            };
          });

          // Combine dynamic offers with wholesale/dealer programs if less than 3
          const combined = [...dynamicDeals];
          defaultDeals.forEach((d) => {
            if (combined.length < 3) combined.push(d);
          });
          setDeals(combined);
        }
      })
      .catch(() => {
        // Fallback to default deals
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-8 sm:py-10 bg-white border-b border-slate-200">
      <div className="container-x">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <span className="section-tag">Value Commercial Programs</span>
            <h2 className="section-title">
              Commercial &amp; Promotional Deals
            </h2>
            <p className="section-desc">
              Tailored discount structures for both individual households and high-volume business buyers.
            </p>
          </div>
          <Link
            href="/offers"
            className="text-xs font-bold text-[#0c2340] hover:text-[#d32f2f] flex items-center gap-1 transition-colors self-start sm:self-auto shrink-0"
          >
            View All Active Offers →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((d, i) => {
            const Icon = d.icon;
            return (
              <div
                key={i}
                className={`p-5 rounded border ${d.borderColor} flex flex-col justify-between shadow-sm hover:shadow-md transition-all`}
                style={{ backgroundColor: d.bg }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${d.accent}`}>
                      {d.tag}
                    </span>
                    <Icon size={18} className={d.accent} />
                  </div>
                  <h3 className={`text-base font-bold leading-snug ${d.textColor} whitespace-pre-line mb-2`}>
                    {d.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {d.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/40">
                  <Link
                    href={d.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d32f2f] hover:text-[#0c2340] transition-colors"
                  >
                    {d.cta} <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
