"use client";

import { useEffect, useState } from "react";
import { MapPin, Users, Award, Truck } from "lucide-react";
import { api } from "@/lib/api";

const stats = [
  { icon: Users, value: "5,000+", label: "Happy Customers" },
  { icon: Award, value: "10+", label: "Trusted Brands" },
  { icon: MapPin, value: "6+", label: "Textile Hubs Sourced" },
  { icon: Truck, value: "All India", label: "Delivery Coverage" },
];

export default function AboutPage() {
  const [cmsPage, setCmsPage] = useState(null);

  useEffect(() => {
    api.cms.getPage("about-us")
      .then((p) => {
        if (p && p.content) setCmsPage(p);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="bg-[#0c2340] text-white">
        <div className="container-x py-14 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            {cmsPage?.title || "Our Story"}
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed">
            Krishna Textiles began in the textile heartland of Erode &amp; Tiruppur, growing into a premier direct-mill sourcing and wholesale distribution hub across India.
          </p>
        </div>
      </div>

      <div className="container-x py-10 grid sm:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 text-center rounded border border-slate-200 shadow-sm">
            <s.icon className="mx-auto text-[#0c2340] mb-3" size={26} />
            <p className="text-xl font-extrabold text-[#0c2340]">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="container-x py-6">
        {cmsPage?.content ? (
          <div className="bg-white p-8 rounded border border-slate-200 shadow-sm whitespace-pre-line text-sm text-slate-700 leading-relaxed mb-8">
            {cmsPage.content}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
              <h2 className="font-bold text-[#0c2340] text-lg mb-3">Our Mission</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                To make high-quality, genuine branded textiles accessible to
                every household and business in India — by connecting the
                manufacturing strength of Erode and Tiruppur with a seamless,
                reliable online shopping experience.
              </p>
            </div>
            <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
              <h2 className="font-bold text-[#0c2340] text-lg mb-3">Why Choose Us</h2>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>Direct sourcing from Erode &amp; Tiruppur manufacturers</li>
                <li>100% genuine products from established brands</li>
                <li>Flexible wholesale &amp; retail purchasing options</li>
                <li>Reliable, tracked delivery across India</li>
                <li>Dedicated customer &amp; business support</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
