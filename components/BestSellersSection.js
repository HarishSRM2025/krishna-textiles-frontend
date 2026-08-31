import Link from "next/link";
import products from "@/data/products.json";
import ProductCard from "./ProductCard";
import { ChevronRight, Flame, Sparkles } from "lucide-react";

export default function BestSellersSection() {
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 5);
  const newArrivals = products.filter((p) => !p.bestSeller).slice(0, 5);

  return (
    <section className="py-8 sm:py-10 bg-[#f8fafc] border-b border-slate-200">
      <div className="container-x">
        {/* Section 1: Best Sellers */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <span className="section-tag flex items-center gap-1">
                <Flame size={12} className="text-[#d32f2f]" /> Most Popular Picks
              </span>
              <h2 className="section-title">
                Best Selling Textile Products
              </h2>
              <p className="section-desc">
                High-demand consumer favorites with proven durability and maximum customer satisfaction.
              </p>
            </div>
            <Link
              href="/category/all"
              className="text-xs font-bold text-[#0c2340] hover:text-[#d32f2f] flex items-center gap-1 transition-colors self-start sm:self-auto shrink-0"
            >
              View All Best Sellers <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Section 2: New Arrivals / Trending */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <span className="section-tag flex items-center gap-1">
                <Sparkles size={12} className="text-[#c59b27]" /> Fresh Off The Looms
              </span>
              <h2 className="section-title">
                New Season Arrivals
              </h2>
              <p className="section-desc">
                Latest weave patterns, color palettes, and fabric blends freshly added from Tiruppur & Erode mills.
              </p>
            </div>
            <Link
              href="/category/all"
              className="text-xs font-bold text-[#0c2340] hover:text-[#d32f2f] flex items-center gap-1 transition-colors self-start sm:self-auto shrink-0"
            >
              Explore All New <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
