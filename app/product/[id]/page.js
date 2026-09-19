"use client";

import { useEffect, useState } from "react";
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
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { categoryIconMap } from "@/components/Header";
import { QTY_SLABS, getTierSlab, isCategoryEligibleForBulkDiscount, calculateUnitPrice } from "@/lib/pricing";

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
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState(null);
  const [showAllSlabs, setShowAllSlabs] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const prodData = await api.products.getOne(id);
        const prod = prodData?.data || prodData;
        if (!prod || !prod.id) { setNotFound(true); return; }
        setProduct(prod);
        setSize(prod.sizes?.[0] || "");
        // Fetch related products from same category
        if (prod.categoryId || prod.category?.id) {
          const categoryId = prod.categoryId || prod.category?.id;
          const relData = await api.products.getAll({ categoryId, limit: 7 });
          const relList = Array.isArray(relData) ? relData : (relData.data || []);
          setRelated(relList.filter((p) => p.id !== prod.id).slice(0, 6));
        }
      } catch (e) {
        console.error("Product page load error:", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const price = Number(product?.price) || 0;
  const mrp = Number(product?.mrp) || 0;
  const stock = Number(product?.stock) || 0;

  // Derive the category identifier for bulk-discount eligibility
  const catIdentifier =
    typeof product?.category === "string"
      ? product.category
      : product?.categoryRef?.slug || product?.categoryId || "";
  const isEligibleForBulk = product ? isCategoryEligibleForBulkDiscount(catIdentifier) : false;

  const activeSlab = product ? getTierSlab(qty, catIdentifier) : QTY_SLABS[0];
  const discountedPrice = product ? calculateUnitPrice(price, qty, catIdentifier) : price;
  const totalPrice = discountedPrice * qty;
  const savings = mrp - price;
  const defaultDelivery = getEstimatedDelivery(3, 6);
  const slabsToShow = showAllSlabs ? QTY_SLABS : QTY_SLABS.slice(0, 4);

  // Stock-derived helpers
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 10;
  const maxQty = stock > 0 ? stock : 0;

  function handleAdd() {
    if (isOutOfStock) return;
    addToCart(product, size, qty, true);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (isOutOfStock) return;
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

  if (loading) {
    return (
      <div className="container-x py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 size={36} className="animate-spin text-[#0c2340]" />
          <p className="text-sm font-medium">Loading product…</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
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

  const catSlug = typeof product.category === 'string' ? product.category : (product.categoryRef?.slug || product.categoryId || "");
  const catName = typeof product.category === 'string' ? product.category.replace(/-/g, " ") : (product.categoryRef?.name || product.category?.name || catSlug);
  const brandName = typeof product.brand === "string" ? product.brand : (product.brandRef?.name || product.brand?.name || "");
  const mainImage = product.imageUrl || (product.images && product.images[0]) || product.categoryRef?.image;
  const IconComponent = categoryIconMap[catSlug] || Tag;

  return (
    <div className="container-x py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 flex-wrap">
        <Link href="/" className="hover:text-[#0c2340]">Home</Link>
        <ChevronRight size={12} />
        <Link href="/category/all" className="hover:text-[#0c2340]">Catalog</Link>
        <ChevronRight size={12} />
        {catSlug && (
          <>
            <Link href={`/category/${catSlug}`} className="hover:text-[#0c2340] capitalize">
              {catName}
            </Link>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-[#0c2340] font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </div>

      {/* Main Product Card */}
      <div className="grid lg:grid-cols-2 gap-8 bg-white p-4 sm:p-6 rounded border border-slate-200 shadow-sm mb-6">
        {/* Product Visual Box */}
        <div className="relative rounded border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center min-h-[320px] sm:min-h-[420px]">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
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
                  {brandName ? `${brandName} ORIGINAL` : 'GENUINE TEXTILE'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Product Details Column */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {product.brandRef?.image ? (
                <img
                  src={product.brandRef.image}
                  alt={brandName}
                  title={brandName}
                  className="h-6 w-auto max-w-[120px] object-contain rounded border border-slate-200 p-0.5 bg-white shadow-xs"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) e.target.nextSibling.style.display = "inline";
                  }}
                />
              ) : null}
              {brandName ? (
                <>
                  <span className={`text-xs font-bold text-[#c59b27] uppercase tracking-wider ${product.brandRef?.image ? "hidden" : "inline"}`}>
                    {brandName}
                  </span>
                  <span className="text-slate-300">·</span>
                </>
              ) : null}
              <span className="text-xs font-medium text-slate-500 capitalize">
                {catName}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0c2340] mb-2 leading-tight">{product.name}</h1>

            {/* Rating badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-1 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                {product.rating || "4.5"} <Star size={11} className="fill-white" />
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {Number(product.reviews || 0).toLocaleString()} Customer Ratings &amp; Reviews
              </span>
            </div>

            {/* Stock Badge */}
            <div className="mb-3">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  <AlertTriangle size={13} /> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                  <AlertTriangle size={13} /> Only {stock} pcs left in stock — order soon!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  <CheckCircle2 size={13} /> In Stock — {stock} pcs available
                </span>
              )}
            </div>

            {/* Price Line */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded mb-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-[#0c2340]">
                  ₹{discountedPrice.toLocaleString()}
                </span>
                {activeSlab.discount > 0 ? (
                  <>
                    <span className="text-sm text-slate-400 line-through">₹{price.toLocaleString()}</span>
                    <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                      {activeSlab.discount}% Bulk Discount Applied
                    </span>
                  </>
                ) : (
                  mrp > price && (
                    <>
                      <span className="text-sm text-slate-400 line-through">₹{mrp.toLocaleString()}</span>
                      <span className="text-xs font-bold text-green-700">Save ₹{savings.toLocaleString()} ({product.discount}% OFF)</span>
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
                    disabled={isOutOfStock || qty <= 1}
                    className="p-1.5 text-slate-600 hover:text-[#d32f2f] disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={maxQty || 9999}
                    value={qty}
                    disabled={isOutOfStock}
                    onChange={(e) => {
                      const v = Math.max(1, Math.min(maxQty || 9999, Number(e.target.value) || 1));
                      setQty(v);
                    }}
                    className="w-12 text-center text-xs font-bold text-slate-800 outline-none border-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label="Quantity"
                  />
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty || 9999, q + 1))}
                    disabled={isOutOfStock || (maxQty > 0 && qty >= maxQty)}
                    className="p-1.5 text-slate-600 hover:text-[#d32f2f] disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {activeSlab.discount > 0 && isEligibleForBulk && (
                  <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded flex items-center gap-1">
                    <BadgePercent size={13} /> {activeSlab.badge} applied!
                  </span>
                )}
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-5">
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className="btn-red flex-1 sm:flex-none min-w-[160px] py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} />
                {isOutOfStock ? "Out of Stock" : added ? "Added to Cart ✓" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn-primary flex-1 sm:flex-none min-w-[160px] py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow disabled:opacity-50 disabled:cursor-not-allowed"
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
            {isEligibleForBulk ? (
              <p className="text-xs text-slate-500 mt-0.5">Order more, save more — up to 30% off for bulk orders on this product</p>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">Bulk discount pricing is not applicable for this category</p>
            )}
          </div>
          <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 font-bold px-2.5 py-1 rounded">
            Currently: {activeSlab.label}
          </span>
        </div>

        {isEligibleForBulk ? (
          <>
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
                  {QTY_SLABS.map((slab, i) => {
                    const slabPrice = Math.round(price * (1 - slab.discount / 100));
                    const savingsPerPc = price - slabPrice;
                    const isActive = activeSlab.min === slab.min;
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
                              : slab.discount >= 25
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                            {slab.discount === 0 ? "Standard Price" : `${slab.discount}% OFF`}
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
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
              <Info size={12} className="text-[#c59b27] shrink-0" />
              Pricing applies per piece. Max 30% discount. GST included. Contact us for custom bulk quotes.
            </div>
          </>
        ) : (
          <div className="py-4 flex flex-col items-center gap-2 text-slate-500">
            <BadgePercent size={28} className="text-slate-300" />
            <p className="text-xs font-medium text-center">
              Quantity bulk discounts (10–30%) are available exclusively for<br />
              <span className="font-bold text-[#0c2340]">Pure Silk Sarees, Cotton Sarees &amp; Dhotis</span> and <span className="font-bold text-[#0c2340]">Dress Materials &amp; Unstitched Suits</span>.
            </p>
          </div>
        )}
      </div>

      {/* Related Products Grid */}
      {related.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">
              Similar Products in {product.category?.name || catSlug.replace(/-/g, " ")}
            </h2>
            <Link
              href={`/category/${catSlug}`}
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
