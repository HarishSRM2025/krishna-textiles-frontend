"use client";

import Link from "next/link";
import { Heart, ChevronRight, ShoppingCart, Trash2, Shirt, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/components/CartContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8">
      <div className="container-x">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#0c2340]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#0c2340] font-bold">Saved Wishlist</span>
        </div>

        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0c2340]">
              My Saved Wishlist ({wishlist.length})
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Textiles and apparel saved for future orders
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-red-600 hover:underline font-bold cursor-pointer"
            >
              Clear All Wishlist
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Heart size={30} />
            </div>
            <h2 className="text-lg font-extrabold text-[#0c2340] mb-2">Your Wishlist is Empty</h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Explore our product catalog and click the heart icon on items you love to save them here for later.
            </p>
            <Link href="/category/all" className="btn-primary py-2.5 px-6 rounded text-xs font-bold inline-block">
              Explore Product Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-40 bg-slate-100 rounded-lg mb-2.5 flex items-center justify-center text-slate-400 overflow-hidden relative">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Shirt size={32} />
                    )}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-red-600 flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      ✕
                    </button>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {item.brand}
                  </span>
                  <h3 className="font-bold text-slate-800 text-xs line-clamp-2 mt-0.5" title={item.name}>
                    {item.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#0c2340]">₹{item.price}</span>
                    {item.mrp > item.price && (
                      <span className="text-[11px] text-slate-400 line-through">₹{item.mrp}</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      addItem(item, 1, true);
                      removeFromWishlist(item.id);
                    }}
                    className="w-full bg-[#0c2340] hover:bg-[#163864] text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <ShoppingCart size={13} /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
