"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Star,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Tag,
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  BadgePercent,
  Info,
  Calendar,
} from "lucide-react";
import products from "@/data/products.json";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartContext";
import { categoryIconMap } from "@/components/Header";

// Quantity-based pricing slabs
const QTY_SLABS = [
  { label: "1 – 50 pcs", min: 1, max: 50, discount: 0, badge: "Retail Price" },
  { label: "51 – 100 pcs", min: 51, max: 100, discount: 10, badge: "10% OFF" },
  { label: "101 – 200 pcs", min: 101, max: 200, discount: 20, badge: "20% OFF" },
  { label: "201 – 300 pcs", min: 201, max: 300, discount: 30, badge: "30% OFF" },
  { label: "301 – 500 pcs", min: 301, max: 500, discount: 40, badge: "40% OFF" },
  { label: "501 – 750 pcs", min: 501, max: 750, discount: 50, badge: "50% OFF" },
  { label: "751 – 999 pcs", min: 751, max: 999, discount: 60, badge: "60% OFF" },
  { label: "1000+ pcs", min: 1000, max: Infinity, discount: 70, badge: "70% OFF" },
];

function getActiveSlab(qty) {
  return QTY_SLABS.find((s) => qty >= s.min && qty <= s.max) || QTY_SLABS[0];
}

function getEstimatedDelivery(daysMin, daysMax) {
  const now = new Date();
  const format = (d) =>
    d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const minDate = new Date(now);
  minDate.setDate(now.getDate() + daysMin);
  const maxDate = new Date(now);
  maxDate.setDate(now.getDate() + daysMax);
  return `${format(minDate)} – ${format(maxDate)}`;
}

export default function ProductPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);

  const [size, setSize] = useState(product?.sizes?.[0] || "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState(null);
  const [showAllSlabs, setShowAllSlabs] = useState(false);

  const activeSlab = getActiveSlab(qty);
  const discountedPrice = Math.round(product?.price * (1 - activeSlab.discount / 100));
  const totalPrice = discountedPrice * qty;

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 6);
  }, [product]);

  if (!product) {
    return (
      <div className="container-x py-16 text-center">
        <div className="w-16 h-16 rounded bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <Package size={32} />
        </div>
        <p className="text-xl font-bold text-[#0c2340] mb-2">Product Not Found</p>
        <p className="text-xs text-slate-500 mb-6">The requested SKU does not exist or has been discontinued.</p>
        <Link href="/category/all" className="btn-primary w-fit mx-auto">
          Browse Active Catalog
        </Link>
      </div>
    );
  }

  function handleAdd() {
    addToCart(product, size, qty, true);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addToCart(product, size, qty, false);
    router.push("/cart");
  }

  function handlePincodeCheck() {
    if (/^\d{6}$/.test(pincode)) {
      const days = Math.floor(Math.random() * 3) + 3;
      setPincodeResult({ ok: true, days, delivery: getEstimatedDelivery(days, days + 2) });
    } else {
      setPincodeResult({ ok: false });
    }
  }

  const IconComponent = categoryIconMap[product.category] || Tag;
  const savings = product.mrp - product.price;

  // Estimated delivery range (default, no pincode checked)
  const defaultDelivery = getEstimatedDelivery(3, 6);

  const slabsToShow = showAllSlabs ? QTY_SLABS : QTY_SLABS.slice(0, 4);

  return (
    <div className="container-x py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 flex-wrap">
        <Link href="/" className="hover:text-[#0c2340]">Home</Link>
        <ChevronRight size={12} />
        <Link href="/category/all" className="hover:text-[#0c2340]">Catalog</Link>
        <ChevronRight size={12} />
        <Link href={`/category/${product.category}`} className="hover:text-[#0c2340] capitalize">
          {product.category.replace(/-/g, " ")}
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#0c2340] font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </div>

      {/* Main Product Card */}
      <div className="grid lg:grid-cols-2 gap-8 bg-white p-4 sm:p-6 rounded border border-slate-200 shadow-sm mb-6">
        {/* Product Visual Box */}
        <div className="relative rounded border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center min-h-[320px] sm:min-h-[420px]">
          {product.discount > 0 && (
            <span className="badge-discount z-10">{product.discount}% OFF</span>
          )}
          <div
            className="w-full h-full p-8 flex flex-col items-center justify-center"
            style={{
              background: `linear-gradient(145deg, ${product.color || "#0c2340"}15, ${product.color || "#0c2340"}35)`,
            }}
          >
            <div
              className="w-28 h-28 rounded-md flex items-center justify-center text-white shadow-md mb-4"
              style={{ backgroundColor: product.color || "#0c2340" }}
            >
              <IconComponent size={56} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-[#0c2340] bg-white px-3 py-1 rounded border border-slate-300 shadow-sm">
              {product.brand} ORIGINAL
            </span>
          </div>
        </div>

        {/* Product Details Column */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#c59b27] uppercase tracking-wider">{product.brand}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-medium text-slate-500 capitalize">{product.category?.replace(/-/g, " ")}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0c2340] mb-2 leading-tight">{product.name}</h1>

            {/* Rating badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-1 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                {product.rating} <Star size={11} className="fill-white" />
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {product.reviews?.toLocaleString()} Customer Ratings &amp; Reviews
              </span>
            </div>

            {/* Price Line */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded mb-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-[#0c2340]">
                  ₹{activeSlab.discount > 0 ? discountedPrice.toLocaleString() : product.price?.toLocaleString()}
                </span>
                {activeSlab.discount > 0 ? (
                  <>
                    <span className="text-sm text-slate-400 line-through">₹{product.price?.toLocaleString()}</span>
                    <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                      {activeSlab.discount}% Bulk Discount Applied
                    </span>
                  </>
                ) : (
                  product.mrp > product.price && (
                    <>
                      <span className="text-sm text-slate-400 line-through">₹{product.mrp?.toLocaleString()}</span>
                      <span className="text-xs font-bold text-green-700">Save ₹{savings?.toLocaleString()} ({product.discount}% OFF)</span>
                    </>
                  )
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Inclusive of all taxes · Direct factory invoiced rate</p>
              {qty > 1 && (
                <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-medium">Total for {qty} pcs:</span>
                  <span className="text-base font-black text-[#d32f2f]">₹{totalPrice.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{product.description}</p>

            {/* Size Options */}
            {product.sizes?.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Select Size: <strong className="text-[#0c2340]">{size}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-3.5 py-1.5 rounded text-xs font-bold border transition-all ${
                        size === s
                          ? "bg-[#0c2340] text-white border-[#0c2340] shadow-sm"
                          : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 border border-slate-300 rounded bg-white w-fit px-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-1.5 text-slate-600 hover:text-[#d32f2f]"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="p-1.5 text-slate-600 hover:text-[#d32f2f]"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {activeSlab.discount > 0 && (
                  <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded flex items-center gap-1">
                    <BadgePercent size={13} /> {activeSlab.badge} for {activeSlab.label}
                  </span>
                )}
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-5">
              <button
                onClick={handleAdd}
                className="btn-red flex-1 sm:flex-none min-w-[160px] py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow"
              >
                <ShoppingBag size={16} />
                {added ? "Added to Cart ✓" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className="btn-primary flex-1 sm:flex-none min-w-[160px] py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow"
              >
                <Zap size={16} className="text-[#c59b27]" /> Buy Now
              </button>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
            <div className="font-bold text-xs text-[#0c2340] uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Truck size={14} className="text-[#d32f2f]" /> Delivery &amp; Shipping Details
            </div>

            {/* Default ETA */}
            <div className="flex items-start gap-2 text-xs text-slate-700">
              <Calendar size={14} className="text-[#0c2340] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Estimated Delivery: </span>
                <span className="text-green-700 font-bold">{defaultDelivery}</span>
                <span className="text-slate-500 ml-1">(for standard orders)</span>
              </div>
            </div>

            {/* Pincode Check */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                <MapPin size={11} className="text-[#d32f2f]" /> Check Delivery for Your Pincode
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); setPincodeResult(null); }}
                  placeholder="Enter 6-digit pincode"
                  className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#0c2340] bg-white"
                />
                <button
                  onClick={handlePincodeCheck}
                  className="bg-[#0c2340] hover:bg-[#123661] text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                >
                  Check
                </button>
              </div>
              {pincodeResult && (
                <div className={`mt-1.5 text-xs font-semibold flex items-center gap-1.5 ${pincodeResult.ok ? "text-green-700" : "text-red-600"}`}>
                  {pincodeResult.ok ? (
                    <>
                      <CheckCircle2 size={13} />
                      Delivery available! Estimated: <strong>{pincodeResult.delivery}</strong>
                    </>
                  ) : (
                    <>
                      <Info size={13} />
                      Please enter a valid 6-digit pincode.
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Delivery icons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
              <div className="flex flex-col items-center gap-1 text-center">
                <Truck size={18} className="text-[#d32f2f]" />
                <span className="text-[10px] text-slate-600 font-semibold leading-tight">Pan-India Fast Dispatch</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <RotateCcw size={18} className="text-[#0c2340]" />
                <span className="text-[10px] text-slate-600 font-semibold leading-tight">7-Day Easy Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <ShieldCheck size={18} className="text-green-700" />
                <span className="text-[10px] text-slate-600 font-semibold leading-tight">100% Genuine Brand</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white border border-slate-200 rounded px-2.5 py-1.5">
              <Clock size={12} className="text-[#c59b27] shrink-0" />
              Orders placed before <strong>3 PM</strong> are dispatched the same day from our Erode warehouse.
            </div>
          </div>
        </div>
      </div>

      {/* Quantity-Based Pricing Table */}
      <div className="bg-white rounded border border-slate-200 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-base text-[#0c2340] flex items-center gap-2">
              <BadgePercent size={18} className="text-[#d32f2f]" /> Quantity-Based Pricing
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Order more, save more — up to 70% off for bulk orders</p>
          </div>
          <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 font-bold px-2.5 py-1 rounded">
            Currently: {activeSlab.label}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#0c2340] text-white">
                <th className="text-left px-3 py-2 font-bold rounded-tl">Quantity</th>
                <th className="text-left px-3 py-2 font-bold">Discount</th>
                <th className="text-left px-3 py-2 font-bold">Unit Price</th>
                <th className="text-left px-3 py-2 font-bold rounded-tr">Savings/pc</th>
              </tr>
            </thead>
            <tbody>
              {slabsToShow.map((slab, i) => {
                const slabPrice = Math.round(product.price * (1 - slab.discount / 100));
                const savingsPerPc = product.price - slabPrice;
                const isActive = activeSlab === slab;
                return (
                  <tr
                    key={i}
                    className={`border-b border-slate-100 transition-colors ${
                      isActive
                        ? "bg-amber-50 border-l-4 border-l-[#c59b27] font-bold"
                        : i % 2 === 0
                        ? "bg-white hover:bg-slate-50"
                        : "bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <td className="px-3 py-2 font-semibold text-[#0c2340]">
                      {slab.label}
                      {isActive && <span className="ml-2 text-[9px] bg-[#c59b27] text-[#0c2340] font-extrabold px-1.5 py-0.5 rounded-full uppercase">Your Qty</span>}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        slab.discount === 0
                          ? "bg-slate-100 text-slate-600"
                          : slab.discount >= 50
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {slab.discount === 0 ? "No Discount" : `${slab.discount}% OFF`}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-bold text-[#0c2340]">₹{slabPrice}</td>
                    <td className="px-3 py-2 text-green-700 font-semibold">
                      {savingsPerPc > 0 ? `₹${savingsPerPc}/pc` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!showAllSlabs && (
          <button
            onClick={() => setShowAllSlabs(true)}
            className="mt-3 w-full text-xs font-bold text-[#0c2340] hover:text-[#d32f2f] border border-dashed border-slate-300 rounded py-2 transition-colors flex items-center justify-center gap-1"
          >
            + Show all bulk pricing slabs (up to 70% off)
          </button>
        )}

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info size={12} className="text-[#c59b27] shrink-0" />
          Pricing applies per piece. GST included. Contact us for custom quotes above 1000 pcs.
        </div>
      </div>

      {/* Related Products Grid */}
      {related.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">
              Similar Products in {product.category.replace(/-/g, " ")}
            </h2>
            <Link
              href={`/category/${product.category}`}
              className="text-xs font-bold text-[#0c2340] hover:text-[#d32f2f] flex items-center gap-1"
            >
              View Category <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
