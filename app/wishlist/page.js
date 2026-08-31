import Link from "next/link";
import { Heart, ChevronRight } from "lucide-react";

export const metadata = { title: "Wishlist | Krishna Textiles" };

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-8">
      <div className="container-x">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#0c2340]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#0c2340] font-bold">Saved Wishlist</span>
        </div>

        <div className="bg-white rounded border border-slate-200 p-16 text-center shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 rounded bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Heart size={32} />
          </div>
          <h1 className="text-xl font-extrabold text-[#0c2340] mb-2">Your Wishlist is Empty</h1>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Explore our product catalog and click the heart icon on items you love to save them here for later.
          </p>
          <Link href="/category/all" className="btn-primary py-2.5 px-6 rounded text-xs font-bold">
            Explore Product Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
