"use client";

import { useEffect, useState } from "react";
import { Truck, Phone, ShieldCheck, MapPin, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function TopBar() {
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.cms
      .getAnnouncement()
      .then((res) => {
        if (isMounted && res?.data) {
          setAnnouncement(res.data);
        }
      })
      .catch(() => {
        // Fallback or quiet fail
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {/* Dynamic CMS Announcement Bar */}
      {announcement && announcement.isActive && announcement.text && (
        <div
          className="py-1.5 px-4 text-center text-[11px] font-semibold flex items-center justify-center gap-2 transition-colors border-b border-black/10"
          style={{
            backgroundColor: announcement.bgColor || "#d32f2f",
            color: announcement.textColor || "#ffffff",
          }}
        >
          {announcement.badgeText && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] uppercase tracking-wider font-extrabold">
              <Sparkles size={10} />
              {announcement.badgeText}
            </span>
          )}
          <span>{announcement.text}</span>
          {announcement.linkUrl && (
            <Link
              href={announcement.linkUrl}
              className="underline hover:opacity-80 inline-flex items-center gap-0.5 ml-1 font-bold"
            >
              Shop Now <ArrowRight size={10} />
            </Link>
          )}
        </div>
      )}

      {/* Sub-bar with service info and contacts */}
      <div className="bg-[#08182b] text-slate-300 text-[11px] border-b border-white/10">
        <div className="container-x flex items-center justify-between py-1.5 overflow-x-auto scrollbar-hide whitespace-nowrap gap-4">
          {/* Left Service Features */}
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Truck size={12} className="text-[#c59b27]" /> Free Pan-India Shipping on Orders Above ₹999
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <ShieldCheck size={12} className="text-[#16a34a]" /> Direct Mill & Factory Assurance
            </span>
          </div>

          {/* Right Quick Contacts */}
          <div className="flex items-center gap-4 shrink-0 text-slate-300 font-medium">
            <a
              href="tel:+914212498899"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone size={11} className="text-[#d32f2f]" /> +91 421 249 8899
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
    </div>
  );
}

