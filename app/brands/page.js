import Link from "next/link";
import brands from "@/data/brands.json";
import products from "@/data/products.json";
import { ChevronRight, ArrowUpRight, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Verified Partner Brands | Krishna Textiles" };

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-6">
      <div className="container-x">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#0c2340]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#0c2340] font-bold">Partner Brands</span>
        </div>

        <div className="bg-white p-6 rounded border border-slate-200 shadow-sm mb-8">
          <span className="section-tag block mb-1">Direct Brand Alliances</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0c2340] mb-2">
            Explore 100% Genuine Partner Brands
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            All brand merchandise listed on Krishna Textiles is sourced directly from authorized regional distribution channels with certified authenticity guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => {
            const count = products.filter((p) => p.brandId === b.id).length;
            return (
              <Link
                key={b.id}
                href={`/brands/${b.id}`}
                className="bg-white p-5 rounded border border-slate-200 hover:border-[#0c2340] shadow-sm hover:shadow-md transition-all flex items-start justify-between group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded bg-[#0c2340] text-white font-black text-sm flex items-center justify-center shrink-0">
                    {b.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 group-hover:text-[#d32f2f] transition-colors">
                      {b.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{b.tagline}</p>
                    <span className="inline-block mt-2 text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                      {count} items listed
                    </span>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-[#0c2340] transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
