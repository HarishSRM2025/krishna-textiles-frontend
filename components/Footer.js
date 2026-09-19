"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { api } from "@/lib/api";

// Clean, dependable inline SVGs for social icons (zero external chunk dependency)
function FacebookIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function WhatsAppIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

function YouTubeIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

const footerLinks = {
  "Shop Categories": [
    { label: "Men's Wear & Innerwear", href: "/category/mens-wear" },
    { label: "Women's Sarees & Kurtis", href: "/category/sarees" },
    { label: "Kids Apparel & Sets", href: "/category/kids-wear" },
    { label: "Formal & Casual Shirts", href: "/category/shirts" },
    { label: "Bed Sheets & Home Linen", href: "/category/home-textiles" },
    { label: "Browse All Categories", href: "/category/all" },
  ],
  "Customer Care": [
    { label: "Track Your Order", href: "/profile" },
    { label: "Shipping Policy & Delivery", href: "/page/shipping-policy" },
    { label: "Returns & Exchanges", href: "/page/returns-policy" },
    { label: "Terms & Conditions", href: "/page/terms-and-conditions" },
    { label: "Privacy Policy", href: "/page/terms-and-conditions" },
    { label: "Contact & Support Desk", href: "/page/contact-us" },
  ],
  "Commercial & Wholesale": [
    { label: "Wholesale Order Enquiry", href: "/wholesale" },
    { label: "Volume Slabs & Rates", href: "/wholesale" },
    { label: "Become a Regional Dealer", href: "/wholesale" },
    { label: "B2B GST Invoicing", href: "/wholesale" },
    { label: "Institutional Uniforms", href: "/wholesale" },
  ],
  "Company Information": [
    { label: "About Krishna Textiles", href: "/about" },
    { label: "Erode & Tiruppur Sourcing", href: "/about" },
    { label: "Partner Brands Directory", href: "/brands" },
    { label: "Store Locations & Hubs", href: "/contact" },
    { label: "Contact Us", href: "/contact" },
  ],
};

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.categories
      .getAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (isMounted && list.length > 0) {
          setCategories(list);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const dynamicCategoryLinks =
    categories.length > 0
      ? [
          ...categories.slice(0, 6).map((c) => ({
            label: c.name,
            href: `/category/${c.slug || c.id}`,
          })),
          { label: "Browse All Categories", href: "/category/all" },
        ]
      : footerLinks["Shop Categories"];

  const resolvedFooterLinks = {
    ...footerLinks,
    "Shop Categories": dynamicCategoryLinks,
  };
  return (
    <footer className="bg-[#08182b] text-slate-300 text-xs border-t border-slate-800">
      {/* 4-Item Quality Assurance Strip */}
      <div className="bg-[#0c2340] border-b border-white/10 py-5">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#d32f2f] text-white flex items-center justify-center shrink-0">
              <Truck size={16} />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">Express Pan-India Shipping</h5>
              <p className="text-[10px] text-slate-400">Direct from factory hubs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#c59b27] text-[#0c2340] flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">100% Genuine Brands</h5>
              <p className="text-[10px] text-slate-400">Jockey, Rupa, Siyaram's, VIP</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-green-700 text-white flex items-center justify-center shrink-0">
              <RotateCcw size={16} />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">7-Day Easy Returns</h5>
              <p className="text-[10px] text-slate-400">Hassle-free replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-700 text-white flex items-center justify-center shrink-0">
              <Headphones size={16} />
            </div>
            <div>
              <h5 className="font-bold text-white text-xs">Dedicated B2B & Retail Desk</h5>
              <p className="text-[10px] text-slate-400">Phone & WhatsApp support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="container-x py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Krishna Textiles"
                width={180}
                height={48}
                className="h-10 w-auto object-contain"
                unoptimized
              />
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Your premier direct mill sourcing partner. Sourced directly from India's textile capitals of Erode & Tiruppur with verified brand assurance.
            </p>

            <div className="space-y-1.5 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone size={13} className="text-[#d32f2f]" /> +91 98765 43210 (6 Days, 9am - 8pm)
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail size={13} className="text-[#c59b27]" /> support@krishnatextiles.in
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin size={13} className="text-green-500" /> Erode Textile Market, Tamil Nadu, 638001
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-2 pt-2">
              {[
                { icon: FacebookIcon, href: "#", label: "Facebook" },
                { icon: InstagramIcon, href: "#", label: "Instagram" },
                { icon: WhatsAppIcon, href: "#", label: "WhatsApp" },
                { icon: YouTubeIcon, href: "#", label: "YouTube" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.href}
                    aria-label={s.label}
                    className="w-7 h-7 rounded bg-slate-800 hover:bg-[#d32f2f] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Icon size={12} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 3 Link Columns */}
          {Object.entries(resolvedFooterLinks).map(([title, links]) => (
            <div key={title} className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-white/10 pb-1.5">
                {title}
              </h4>
              <ul className="space-y-1.5">
                {links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white hover:underline transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/10 bg-[#05101d] py-3 text-slate-400 text-[11px]">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Krishna Textiles E-Commerce Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/page/terms-and-conditions" className="hover:text-white">Privacy Policy</Link>
            <Link href="/page/terms-and-conditions" className="hover:text-white">Terms of Sale</Link>
            <Link href="/page/shipping-policy" className="hover:text-white">Shipping & GST</Link>
            <Link href="/wholesale" className="hover:text-white text-[#c59b27] font-semibold">Wholesale Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
