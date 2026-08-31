"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Shirt,
  Scissors,
  Tag,
  Package,
  Layers,
  Phone,
  HelpCircle,
  Clock,
  CheckCircle2,
  MapPin,
  Building2,
} from "lucide-react";
import categories from "@/data/categories.json";
import products from "@/data/products.json";
import brands from "@/data/brands.json";
import { useCart } from "./CartContext";

const navCategories = categories.filter((c) => c.nav);

const TRENDING_SEARCHES = [
  "Cotton Shirts",
  "Handwoven Silk Sarees",
  "Jockey Cotton Vests",
  "Kids Nightwear",
  "Formal Trousers",
  "Wholesale Fabric",
];

// Mapping category IDs to crisp Lucide icons
export const categoryIconMap = {
  "mens-wear": Shirt,
  "mens-innerwear": Layers,
  "womens-innerwear": Sparkles,
  "womens-wear": Tag,
  "sarees": Scissors,
  "kurtis": Tag,
  "nightwear": Package,
  "kids-wear": Shirt,
  "shirts": Shirt,
  "tshirts": Shirt,
  "bottomwear": Tag,
  "dupattas-stoles": Sparkles,
  "dress-materials": Layers,
  "socks": Package,
  "home-textiles": Package,
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { count, openCart } = useCart();

  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(e.target)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Live filter suggestions based on query
  const trimmedQuery = query.trim().toLowerCase();

  const matchingProducts = trimmedQuery
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(trimmedQuery) ||
            p.brand.toLowerCase().includes(trimmedQuery) ||
            p.category.toLowerCase().includes(trimmedQuery)
        )
        .slice(0, 5)
    : [];

  const matchingCategories = trimmedQuery
    ? categories
        .filter((c) => c.name.toLowerCase().includes(trimmedQuery))
        .slice(0, 3)
    : [];

  const matchingBrands = trimmedQuery
    ? brands
        .filter((b) => b.name.toLowerCase().includes(trimmedQuery))
        .slice(0, 3)
    : [];

  function handleSearchSubmit(e) {
    if (e) e.preventDefault();
    if (query.trim()) {
      setIsSearchFocused(false);
      const catParam = selectedCat !== "all" ? `&category=${selectedCat}` : "";
      router.push(`/search?q=${encodeURIComponent(query.trim())}${catParam}`);
    }
  }

  function handleSuggestionClick(targetUrl) {
    setIsSearchFocused(false);
    setQuery("");
    router.push(targetUrl);
  }

  // Suggestion Dropdown Renderer
  const renderSuggestions = () => {
    if (!isSearchFocused) return null;

    return (
      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded shadow-2xl z-50 overflow-hidden max-h-[420px] overflow-y-auto text-slate-800 text-left">
        {/* If user hasn't typed anything, show Trending Searches */}
        {!trimmedQuery && (
          <div className="p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <TrendingUp size={13} className="text-[#d32f2f]" /> Trending Searches
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING_SEARCHES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    setIsSearchFocused(false);
                    router.push(`/search?q=${encodeURIComponent(item)}`);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* If user has typed, show matching results */}
        {trimmedQuery && (
          <div className="divide-y divide-slate-100">
            {/* Matching Categories */}
            {matchingCategories.length > 0 && (
              <div className="p-2 bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Categories
                </span>
                {matchingCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSuggestionClick(`/category/${c.id}`)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 hover:bg-white hover:text-[#0c2340] rounded transition-colors font-medium text-left"
                  >
                    <span>
                      in <strong className="text-[#0c2340]">{c.name}</strong>
                    </span>
                    <ChevronRight size={12} className="text-slate-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Matching Brands */}
            {matchingBrands.length > 0 && (
              <div className="p-2 bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Brands
                </span>
                {matchingBrands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSuggestionClick(`/brands/${b.id}`)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 hover:bg-white hover:text-[#0c2340] rounded transition-colors font-medium text-left"
                  >
                    <span>
                      brand <strong className="text-[#0c2340]">{b.name}</strong> ({b.tagline})
                    </span>
                    <ChevronRight size={12} className="text-slate-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Matching Products */}
            {matchingProducts.length > 0 ? (
              <div className="p-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                  Products
                </span>
                {matchingProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSuggestionClick(`/product/${p.id}`)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded transition-colors text-left"
                  >
                    <div
                      className="w-9 h-9 rounded border border-slate-200 flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: p.color || "#0c2340" }}
                    >
                      {p.brand?.slice(0, 3).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {p.brand} · <span className="text-slate-600 font-medium capitalize">{p.category.replace(/-/g, " ")}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#0c2340]">₹{p.price}</span>
                      {p.discount > 0 && (
                        <span className="block text-[10px] font-bold text-green-600">
                          {p.discount}% off
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              matchingCategories.length === 0 &&
              matchingBrands.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-500">
                  No exact matches for &quot;<strong>{query}</strong>&quot;. Press enter to search catalog.
                </div>
              )
            )}

            {/* Search All Link */}
            <div className="p-2 bg-slate-50 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full py-1.5 px-3 bg-[#0c2340] hover:bg-[#123661] text-white rounded text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                Search all results for &quot;{query}&quot; <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header className="bg-[#0c2340] sticky top-0 z-40 shadow-md border-b border-[#08182b]">
        {/* Main Header Bar */}
        <div className="container-x py-2.5">
          <div className="flex items-center gap-3 md:gap-5">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1 text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu size={22} />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center shrink-0 select-none">
              <Image
                src="/logo.png"
                alt="Krishna Textiles"
                width={170}
                height={45}
                className="h-9 sm:h-10 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>

            {/* Desktop Flipkart-Style Search Bar */}
            <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl relative">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full flex items-center bg-white rounded border border-slate-300 focus-within:border-[#c59b27] focus-within:ring-1 focus-within:ring-[#c59b27] shadow-sm overflow-hidden"
              >
                {/* Category dropdown */}
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border-r border-slate-300 px-3 py-2.5 outline-none cursor-pointer hidden lg:block"
                >
                  <option value="all">All Categories</option>
                  {navCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for textiles, shirts, sarees, fabrics, brands..."
                  className="flex-1 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                  >
                    <X size={14} />
                  </button>
                )}

                <button
                  type="submit"
                  className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-4 py-2.5 transition-colors flex items-center justify-center shrink-0"
                  aria-label="Search"
                >
                  <Search size={16} strokeWidth={2.5} />
                </button>
              </form>

              {/* Suggestions dropdown */}
              {renderSuggestions()}
            </div>

            {/* Delivering To Location Selector (Right after Search Bar) */}
            <Link
              href="/profile"
              className="hidden lg:flex items-center gap-2 px-2 py-1 text-white hover:bg-white/10 rounded transition-colors shrink-0 leading-tight select-none"
              title="Set Delivery Location"
            >
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#c59b27] shrink-0">
                <MapPin size={15} />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-300 block leading-none">
                  Delivering to
                </span>
                <span className="text-xs font-bold text-white flex items-center gap-0.5 mt-0.5 leading-tight">
                  Set Address <ChevronDown size={11} className="text-slate-300 ml-0.5" />
                </span>
              </div>
            </Link>

            {/* Right Action Icons */}
            <div className="ml-auto flex items-center gap-1.5 sm:gap-3">


              {/* User Account / Profile Dropdown */}
              <div className="relative group">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-2.5 py-1.5 text-white hover:bg-white/10 rounded transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-200">
                    <User size={15} />
                  </div>
                  <div className="hidden xl:block text-left leading-tight">
                    <span className="text-[10px] text-slate-300 block">Welcome</span>
                    <span className="text-xs font-bold text-white flex items-center">
                      My Account <ChevronDown size={11} className="ml-0.5 group-hover:rotate-180 transition-transform" />
                    </span>
                  </div>
                </Link>

                {/* Dropdown Menu on Desktop Hover */}
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-2xl border border-slate-200 py-3 px-3.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 text-slate-800">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2.5">
                    <div>
                      <span className="text-xs font-black text-[#0c2340] block">Welcome to KT</span>
                      <span className="text-[10px] text-slate-500">Access orders &amp; bulk rates</span>
                    </div>
                    <Link
                      href="/signin"
                      className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-[11px] font-bold px-3 py-1.5 rounded shadow-sm transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>

                  <div className="text-[11px] text-slate-500 mb-3 text-center">
                    New customer?{" "}
                    <Link href="/signup" className="text-[#0c2340] font-extrabold hover:underline">
                      Sign Up Here
                    </Link>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-100 text-xs font-semibold">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-slate-50 text-slate-700 hover:text-[#0c2340]"
                    >
                      <Package size={14} className="text-[#c59b27]" /> My Orders &amp; Tracking
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-slate-50 text-slate-700 hover:text-[#0c2340]"
                    >
                      <Heart size={14} className="text-[#d32f2f]" /> Saved Wishlist
                    </Link>
                    <Link
                      href="/wholesale"
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-slate-50 text-slate-700 hover:text-[#0c2340]"
                    >
                      <Building2 size={14} className="text-[#0c2340]" /> Wholesale &amp; Bulk Portal
                    </Link>
                  </div>
                </div>
              </div>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="p-2 text-white hover:bg-white/10 rounded transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart size={18} />
              </Link>

              {/* Cart Button (Opens Offcanvas) */}
              <button
                onClick={openCart}
                className="flex items-center gap-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-3 py-1.5 rounded font-bold text-xs shadow-sm transition-colors cursor-pointer"
                aria-label="Shopping cart"
              >
                <div className="relative">
                  <ShoppingCart size={17} />
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#c59b27] text-[#0c2340] text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center border border-[#0c2340]">
                      {count}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar — Prominently in header, NOT hidden in toggler */}
          <div ref={mobileSearchContainerRef} className="md:hidden mt-2 relative">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white rounded border border-slate-300 shadow-sm overflow-hidden"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search products, brands, categories..."
                className="flex-1 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-slate-400 mr-1"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className="bg-[#d32f2f] text-white px-3 py-2 shrink-0"
                aria-label="Search"
              >
                <Search size={15} />
              </button>
            </form>
            {renderSuggestions()}
          </div>
        </div>

        {/* Desktop Category Navigation Sub-bar */}
        <div className="hidden md:block bg-[#08182b] border-t border-white/10 text-xs font-semibold">
          <div className="container-x flex items-center py-1.5 gap-0">
            {/* Scrollable category links */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              <Link
                href="/category/all"
                className={`px-3 py-1 rounded text-slate-200 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 ${
                  pathname === "/category/all" ? "bg-white/15 text-white font-bold" : ""
                }`}
              >
                All Products
              </Link>

              {navCategories.map((c) => {
                const IconComponent = categoryIconMap[c.id] || Tag;
                return (
                  <Link
                    key={c.id}
                    href={`/category/${c.id}`}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 ${
                      pathname === `/category/${c.id}` ? "bg-white/15 text-white font-bold" : ""
                    }`}
                  >
                    <IconComponent size={13} className="text-[#c59b27]" />
                    <span>{c.navLabel || c.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Pinned right — always visible */}
            <div className="flex items-center gap-0 shrink-0 border-l border-white/10 ml-1 pl-1">
              <Link
                href="/brands"
                className="px-3 py-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                Brands
              </Link>
              <Link
                href="/offers"
                className="flex items-center gap-1 px-3 py-1 rounded text-[#ff5252] hover:text-white hover:bg-[#d32f2f] transition-colors whitespace-nowrap font-bold"
              >
                <Sparkles size={12} /> Deals &amp; Offers
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navbar Offcanvas (Slide in from Left) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/60 transition-opacity backdrop-blur-[2px]"
          />

          {/* Offcanvas Drawer */}
          <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs bg-white flex flex-col shadow-2xl animate-slide-in-left">
              {/* User Header */}
              <div className="p-4 bg-[#0c2340] text-white flex items-center justify-between border-b border-white/10">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    src="/logo.png"
                    alt="Krishna Textiles"
                    width={150}
                    height={40}
                    className="h-8 w-auto object-contain"
                    unoptimized
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-slate-300 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Actions banner */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 bg-[#d32f2f] text-white text-center py-2 rounded text-xs font-bold shadow-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 bg-[#0c2340] text-white text-center py-2 rounded text-xs font-bold shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
                <div className="flex items-center justify-between pt-1 text-xs font-semibold text-slate-700">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 hover:text-[#d32f2f]"
                  >
                    <User size={14} className="text-[#0c2340]" /> My Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-1 hover:text-[#d32f2f]"
                  >
                    <Heart size={14} className="text-[#d32f2f]" /> Wishlist
                  </Link>
                </div>
              </div>

              {/* Navigation Links list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                  Browse Catalog
                </div>

                <Link
                  href="/category/all"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-bold text-[#0c2340] hover:bg-slate-100 rounded"
                >
                  <span>All Products & Categories</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>

                {categories.map((c) => {
                  const IconComponent = categoryIconMap[c.id] || Tag;
                  return (
                    <Link
                      key={c.id}
                      href={`/category/${c.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded"
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent size={14} className="text-[#c59b27]" />
                        <span className="font-medium">{c.name}</span>
                      </div>
                      <ChevronRight size={13} className="text-slate-400" />
                    </Link>
                  );
                })}

                <div className="pt-2 border-t border-slate-200 mt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                    Special Sections
                  </div>
                  <Link
                    href="/offers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#d32f2f] hover:bg-slate-100 rounded"
                  >
                    <Sparkles size={14} /> Deals & Offers
                  </Link>
                  <Link
                    href="/wholesale"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#0c2340] hover:bg-slate-100 rounded"
                  >
                    <Package size={14} /> Wholesale & Bulk Orders
                  </Link>
                  <Link
                    href="/brands"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
                  >
                    <CheckCircle2 size={14} className="text-green-600" /> Partner Brands
                  </Link>
                </div>
              </div>

              {/* Bottom Support Box */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                  <Phone size={13} className="text-[#d32f2f]" /> Helpline: +91 98765 43210
                </div>
                <p className="text-[11px] text-slate-500">
                  Erode & Tiruppur Sourced · 100% Genuine
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
