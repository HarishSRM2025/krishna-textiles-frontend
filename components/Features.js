import { Truck, ShieldCheck, ShoppingBag, Headphones, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Pan-India Direct Logistics",
    desc: "Direct shipping from Erode & Tiruppur to 28,000+ pincodes.",
    accent: "#d32f2f",
  },
  {
    icon: ShieldCheck,
    title: "100% Genuine Brand Assurance",
    desc: "Original factory sealed products with certified quality standard.",
    accent: "#0c2340",
  },
  {
    icon: ShoppingBag,
    title: "Wholesale & Retail Flexibility",
    desc: "Shop individual pieces or order in bulk with tiered discount slabs.",
    accent: "#c59b27",
  },
  {
    icon: Headphones,
    title: "Dedicated Support & GST Invoicing",
    desc: "Business invoice support, easy returns, and tracking assistance.",
    accent: "#16a34a",
  },
];

export default function Features() {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="container-x py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3.5 p-3 sm:p-3.5 rounded border border-slate-200 hover:border-slate-300 bg-[#f8fafc] hover:bg-white transition-all shadow-sm"
              >
                <div
                  className="w-10 h-10 rounded shrink-0 flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: f.accent }}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800 leading-snug truncate">
                    {f.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
