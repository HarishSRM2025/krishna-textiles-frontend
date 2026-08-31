"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  SlidersHorizontal,
  X,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Search,
  ArrowUpDown,
  Tag,
  ShoppingBag,
} from "lucide-react";
import allProducts from "@/data/products.json";
import categories from "@/data/categories.json";
import brands from "@/data/brands.json";
import ProductCard from "@/components/ProductCard";
import { categoryIconMap } from "@/components/Header";
import { useCart } from "@/components/CartContext";

const SORT_OPTIONS = [
  { value: "popular", label: "Popularity" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "discount", label: "Best Discount" },
  { value: "newest", label: "Newest First" },
];

const RATING_OPTIONS = [4.5, 4, 3.5, 3];
const DISCOUNT_OPTIONS = [
  { label: "10% and above", min: 10 },
  { label: "20% and above", min: 20 },
  { label: "30% and above", min: 30 },
  { label: "40% and above", min: 40 },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200 py-3 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-slate-800 hover:text-[#0c2340] py-1"
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp size={14} className="text-slate-400" />
        ) : (
          <ChevronDown size={14} className="text-slate-400" />
        )}
      </button>
      {open && <div className="pt-2">{children}</div>}
    </div>
  );
}

export default function CategoryPage({ params }) {
  const { slug } = params;
  const category = categories.find((c) => c.id === slug);
  const title = slug === "all" ? "All Products & Catalog" : category?.name || "Products";
  const { addItem } = useCart();

  // Filter state
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  const base = useMemo(() => {
    if (slug === "all") return allProducts;
    return allProducts.filter((p) => p.category === slug);
  }, [slug]);

  const availableBrands = useMemo(() => {
    const ids = new Set(base.map((p) => p.brandId));
    return brands.filter((b) => ids.has(b.id));
  }, [base]);

  const availableCategories = useMemo(() => {
    if (slug !== "all") return [];
    const ids = new Set(allProducts.map((p) => p.category));
    return categories.filter((c) => ids.has(c.id));
  }, [slug]);

  const maxProductPrice = useMemo(() => Math.max(...base.map((p) => p.price), 500), [base]);

  const filteredBrands = useMemo(() =>
    availableBrands.filter((b) =>
      b.name.toLowerCase().includes(brandSearch.toLowerCase())
    ), [availableBrands, brandSearch]);

  const filtered = useMemo(() => {
    let list = base.filter((p) => {
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brandId)) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (minRating && p.rating < minRating) return false;
      if (minDiscount && (p.discount || 0) < minDiscount) return false;
      if (inStockOnly && p.stock <= 0) return false;
      return true;
    });

    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "discount") list = [...list].sort((a, b) => (b.discount || 0) - (a.discount || 0));
    else if (sort === "newest") list = [...list].reverse();
    return list;
  }, [base, selectedBrands, selectedCategories, priceRange, minRating, minDiscount, inStockOnly, sort]);

  function toggleBrand(id) {
    setSelectedBrands((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
  }

  function toggleCategory(id) {
    setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }

  function clearAllFilters() {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, maxProductPrice]);
    setMinRating(0);
    setMinDiscount(0);
    setInStockOnly(false);
  }

  const activeFilterCount =
    selectedBrands.length +
    selectedCategories.length +
    (priceRange[1] < maxProductPrice ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const FilterPanel = (
    <div className="p-4 divide-y divide-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-1.5 font-bold text-xs text-[#0c2340] uppercase tracking-wider">
          <SlidersHorizontal size={14} className="text-[#d32f2f]" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-[#d32f2f] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={clearAllFilters}
          className={`text-[11px] font-bold hover:underline transition-colors ${
            activeFilterCount > 0
              ? "text-[#d32f2f]"
              : "text-slate-400 cursor-default pointer-events-none"
          }`}
          disabled={activeFilterCount === 0}
        >
          Clear All
        </button>
      </div>

      {/* Price Range Slider */}
      <FilterSection title="Price Range (₹)">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxProductPrice}
          step={50}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-[#0c2340] cursor-pointer"
        />
        <div className="flex flex-wrap gap-1.5 mt-3">
          {[
            { label: "Under ₹500", max: 500 },
            { label: "₹500–₹1000", min: 500, max: 1000 },
            { label: "₹1000–₹2000", min: 1000, max: 2000 },
            { label: "₹2000+", min: 2000, max: maxProductPrice },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => setPriceRange([chip.min || 0, chip.max])}
              className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
                priceRange[1] === chip.max
                  ? "bg-[#0c2340] text-white border-[#0c2340]"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand Search & Checkboxes */}
      <FilterSection title="Brand">
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 mb-2 text-xs">
          <Search size={12} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full text-slate-800"
          />
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {filteredBrands.map((b) => (
            <label
              key={b.id}
              className="flex items-center justify-between text-xs text-slate-700 hover:text-[#0c2340] cursor-pointer py-0.5"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b.id)}
                  onChange={() => toggleBrand(b.id)}
                  className="rounded border-slate-300 text-[#0c2340] focus:ring-0 cursor-pointer"
                />
                <span className={selectedBrands.includes(b.id) ? "font-bold text-[#0c2340]" : ""}>
                  {b.name}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                ({base.filter((p) => p.brandId === b.id).length})
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category Checkboxes (When viewing all products) */}
      {slug === "all" && availableCategories.length > 0 && (
        <FilterSection title="Category" defaultOpen={false}>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {availableCategories.map((c) => {
              const Icon = categoryIconMap[c.id] || Tag;
              return (
                <label
                  key={c.id}
                  className="flex items-center justify-between text-xs text-slate-700 hover:text-[#0c2340] cursor-pointer py-0.5"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c.id)}
                      onChange={() => toggleCategory(c.id)}
                      className="rounded border-slate-300 text-[#0c2340] cursor-pointer"
                    />
                    <Icon size={12} className="text-[#c59b27]" />
                    <span className={selectedCategories.includes(c.id) ? "font-bold text-[#0c2340]" : ""}>
                      {c.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    ({allProducts.filter((p) => p.category === c.id).length})
                  </span>
                </label>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Customer Rating */}
      <FilterSection title="Customer Rating" defaultOpen={false}>
        <div className="space-y-1">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`w-full flex items-center justify-between p-1.5 rounded text-xs transition-colors ${
                minRating === r ? "bg-slate-100 font-bold text-[#0c2340]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="bg-green-700 text-white font-bold text-[10px] px-1 py-0.2 rounded flex items-center gap-0.5">
                  {r} <Star size={8} className="fill-white" />
                </span>
                <span>& above</span>
              </div>
              {minRating === r && <Check size={13} className="text-green-700" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Discount Slabs */}
      <FilterSection title="Discount" defaultOpen={false}>
        <div className="space-y-1">
          {DISCOUNT_OPTIONS.map((d) => (
            <button
              key={d.min}
              onClick={() => setMinDiscount(minDiscount === d.min ? 0 : d.min)}
              className={`w-full flex items-center justify-between p-1.5 rounded text-xs transition-colors ${
                minDiscount === d.min ? "bg-slate-100 font-bold text-[#d32f2f]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{d.label}</span>
              {minDiscount === d.min && <Check size={13} className="text-[#d32f2f]" />}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* In Stock Only */}
      <div className="py-3">
        <label className="flex items-center justify-between cursor-pointer text-xs font-bold text-slate-800">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded border-slate-300 text-[#0c2340] cursor-pointer"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-5">
      <div className="container-x">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 flex-wrap">
          <Link href="/" className="hover:text-[#0c2340]">Home</Link>
          <ChevronRight size={12} />
          {slug !== "all" && category && (
            <>
              <Link href="/category/all" className="hover:text-[#0c2340]">
                All Products
              </Link>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-[#0c2340] font-bold">{title}</span>
        </div>

        {/* Page Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-white p-3 sm:p-4 rounded border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-base sm:text-xl font-extrabold text-[#0c2340] leading-none">
              {title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing <strong className="text-slate-800">{filtered.length}</strong> verified products
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden btn-primary text-xs px-3 py-1.5 rounded flex items-center gap-1.5"
            >
              <SlidersHorizontal size={13} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#d32f2f] text-white text-[9px] font-bold px-1.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium hidden sm:inline">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-slate-300 rounded overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${
                  viewMode === "grid" ? "bg-[#0c2340] text-white" : "bg-white text-slate-500"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors ${
                  viewMode === "list" ? "bg-[#0c2340] text-white" : "bg-white text-slate-500"
                }`}
                aria-label="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center flex-wrap gap-1.5 mb-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Filters:
            </span>
            {selectedBrands.map((id) => {
              const b = brands.find((br) => br.id === id);
              return (
                <button
                  key={id}
                  onClick={() => toggleBrand(id)}
                  className="filter-chip"
                >
                  {b?.name} <X size={10} />
                </button>
              );
            })}
            {selectedCategories.map((id) => {
              const c = categories.find((cat) => cat.id === id);
              return (
                <button
                  key={id}
                  onClick={() => toggleCategory(id)}
                  className="filter-chip"
                >
                  {c?.name} <X size={10} />
                </button>
              );
            })}
            {priceRange[1] < maxProductPrice && (
              <button
                onClick={() => setPriceRange([0, maxProductPrice])}
                className="filter-chip"
              >
                Max ₹{priceRange[1].toLocaleString()} <X size={10} />
              </button>
            )}
            {minRating > 0 && (
              <button onClick={() => setMinRating(0)} className="filter-chip">
                {minRating}+ Stars <X size={10} />
              </button>
            )}
            {minDiscount > 0 && (
              <button onClick={() => setMinDiscount(0)} className="filter-chip">
                {minDiscount}%+ Off <X size={10} />
              </button>
            )}
            {inStockOnly && (
              <button onClick={() => setInStockOnly(false)} className="filter-chip">
                In Stock <X size={10} />
              </button>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-bold text-[#d32f2f] hover:underline ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Layout Grid: Sidebar + Products */}
        <div className="grid lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr] gap-5 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white rounded border border-slate-200 shadow-sm sticky top-28">
            {FilterPanel}
          </aside>

          {/* Product Items Area */}
          <div>
            {filtered.length === 0 ? (
              <div className="bg-white p-12 rounded border border-slate-200 text-center shadow-sm">
                <Tag size={36} className="text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  No matching products found
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  Try clearing some filters or exploring another category.
                </p>
                <button onClick={clearAllFilters} className="btn-primary text-xs">
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              /* List View Mode */
              <div className="space-y-3">
                {filtered.map((p) => {
                  const Icon = categoryIconMap[p.category] || Tag;
                  return (
                    <div
                      key={p.id}
                      className="bg-white p-4 rounded border border-slate-200 hover:border-slate-400 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center transition-all"
                    >
                      <div className="flex gap-4 items-center min-w-0">
                        <div
                          className="w-16 h-16 rounded border border-slate-200 flex items-center justify-center text-white shrink-0 font-bold"
                          style={{ backgroundColor: p.color || "#0c2340" }}
                        >
                          <Icon size={24} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {p.brand} · <span className="capitalize">{p.category.replace(/-/g, " ")}</span>
                          </span>
                          <Link href={`/product/${p.id}`} className="block hover:text-[#d32f2f]">
                            <h3 className="text-sm font-bold text-slate-800 truncate">
                              {p.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              {p.rating} <Star size={8} className="fill-white" />
                            </span>
                            <span className="text-[11px] text-slate-400">
                              ({p.reviews} ratings)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-base font-extrabold text-[#0c2340]">
                            ₹{p.price.toLocaleString()}
                          </span>
                          {p.mrp > p.price && (
                            <span className="block text-[11px] text-slate-400 line-through">
                              MRP ₹{p.mrp.toLocaleString()} ({p.discount}% off)
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => addItem(p, 1, true)}
                          className="btn-red text-xs px-3 py-1.5 rounded flex items-center gap-1"
                        >
                          <ShoppingBag size={13} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide-In Filter Drawer */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setFilterDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          />
          <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs bg-white flex flex-col shadow-2xl animate-slide-in-left">
              <div className="p-3.5 bg-[#0c2340] text-white flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider">
                  Product Filters ({activeFilterCount})
                </span>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 rounded text-slate-300 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{FilterPanel}</div>
              <div className="p-3 bg-slate-50 border-t border-slate-200">
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="w-full btn-red py-2 text-xs font-bold rounded"
                >
                  Apply & View {filtered.length} Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
