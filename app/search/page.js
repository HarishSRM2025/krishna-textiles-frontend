"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import products from "@/data/products.json";
import ProductCard from "@/components/ProductCard";
import { SearchX, ChevronRight, Search } from "lucide-react";

function SearchResults() {
  const params = useSearchParams();
  const q = (params.get("q") || "").toLowerCase().trim();
  const categoryFilter = params.get("category");

  let results = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q.replace(/\s/g, "-"))
      )
    : [];

  if (categoryFilter && categoryFilter !== "all") {
    results = results.filter((p) => p.category === categoryFilter);
  }

  return (
    <div className="container-x py-6">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Link href="/" className="hover:text-[#0c2340]">Home</Link>
        <ChevronRight size={12} />
        <Link href="/category/all" className="hover:text-[#0c2340]">Catalog</Link>
        <ChevronRight size={12} />
        <span className="text-[#0c2340] font-bold">Search: &quot;{q}&quot;</span>
      </div>

      <div className="bg-white p-4 rounded border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-extrabold text-[#0c2340]">
            Search results for &ldquo;{q}&rdquo;
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Found <strong className="text-slate-800">{results.length}</strong> matching textile items
          </p>
        </div>
        <Link href="/category/all" className="text-xs font-bold text-[#0c2340] hover:text-[#d32f2f]">
          Browse Complete Catalog →
        </Link>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded border border-slate-200 p-16 text-center shadow-sm max-w-lg mx-auto">
          <div className="w-14 h-14 rounded bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <SearchX size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No products found for &quot;{q}&quot;</h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Check for typos or try searching with generic terms like <em>cotton</em>, <em>saree</em>, <em>shirt</em>, or <em>jockey</em>.
          </p>
          <Link href="/category/all" className="btn-primary text-xs">
            View All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-x py-12 text-center text-xs text-slate-500">Loading catalog search...</div>}>
      <SearchResults />
    </Suspense>
  );
}
