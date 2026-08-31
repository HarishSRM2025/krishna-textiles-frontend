"use client";

import Link from "next/link";
import { Heart, Star, ShoppingBag, Check, Tag } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartContext";
import { categoryIconMap } from "./Header";

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, true); // Opens offcanvas cart drawer
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const discountPct = product.discount || 0;
  const savings = product.mrp - product.price;
  const IconComponent = categoryIconMap[product.category] || Tag;

  return (
    <div className="card-product group bg-white border border-slate-200 hover:border-slate-400 rounded transition-all duration-200 flex flex-col h-full shadow-sm hover:shadow-md">
      {/* Product Image / Fabric Visual Box */}
      <div className="relative overflow-hidden bg-slate-100 border-b border-slate-100">
        {/* Discount Badge */}
        {discountPct > 0 && (
          <span className="badge-discount">{discountPct}% OFF</span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWishlisted((v) => !v);
          }}
          className="absolute top-2 right-2 z-10 w-7 h-7 rounded bg-white/90 hover:bg-white text-slate-400 hover:text-[#d32f2f] flex items-center justify-center shadow-sm border border-slate-200 transition-colors"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            className={wishlisted ? "fill-[#d32f2f] text-[#d32f2f]" : "text-slate-400"}
          />
        </button>

        {/* Visual Box with Category Fabric Pattern & Icon */}
        <Link href={`/product/${product.id}`} className="block">
          <div
            className="h-36 sm:h-44 w-full flex flex-col items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105"
            style={{
              background: `linear-gradient(145deg, ${product.color || "#0c2340"}15, ${product.color || "#0c2340"}35)`,
            }}
          >
            <div
              className="w-14 h-14 rounded flex items-center justify-center text-white shadow-sm mb-2"
              style={{ backgroundColor: product.color || "#0c2340" }}
            >
              <IconComponent size={26} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
              {product.brand}
            </span>
          </div>
        </Link>
      </div>

      {/* Card Content Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category header */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>{product.brand}</span>
            <span className="capitalize text-slate-500 font-medium">
              {product.category?.replace(/-/g, " ")}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.id}`} className="block group-hover:text-[#d32f2f] transition-colors">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-snug min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating badge */}
          <div className="flex items-center gap-1.5 mt-2 mb-2.5">
            <span className="inline-flex items-center gap-1 bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {product.rating} <Star size={9} className="fill-white" />
            </span>
            <span className="text-[11px] text-slate-400">
              ({product.reviews?.toLocaleString()} ratings)
            </span>
          </div>

          {/* Price details */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-[#0c2340]">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.mrp?.toLocaleString()}
              </span>
            )}
            {savings > 0 && (
              <span className="text-[10px] font-bold text-green-700">
                Save ₹{savings.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Quick Add To Cart Button */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              added
                ? "bg-green-700 text-white border border-green-800"
                : "bg-[#d32f2f] hover:bg-[#b71c1c] text-white border border-[#b71c1c]"
            }`}
          >
            {added ? (
              <>
                <Check size={14} /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
