import { Truck, Phone, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-[#08182b] text-slate-300 text-[11px] border-b border-white/10">
      <div className="container-x flex items-center justify-between py-1.5 overflow-x-auto scrollbar-hide whitespace-nowrap gap-4">
        {/* Left Service Features */}
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Truck size={12} className="text-[#c59b27]" /> Free Shipping on Orders Above ₹999
          </span>
          <span className="hidden lg:flex items-center gap-1.5 text-slate-300">
            <ShieldCheck size={12} className="text-[#16a34a]" /> 100% Genuine Brand Assurance
          </span>
        </div>

        {/* Right Quick Contacts */}
        <div className="flex items-center gap-4 shrink-0 text-slate-300 font-medium">
          <a
            href="tel:+919876543210"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone size={11} className="text-[#d32f2f]" /> +91 98765 43210
          </a>
          <Link
            href="/profile"
            className="hidden sm:flex items-center gap-1 hover:text-white transition-colors"
          >
            <MapPin size={11} className="text-[#c59b27]" /> Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}
