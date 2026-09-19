// Quantity-Based Pricing Configuration for Krishna Textiles
// Upto 30% discount for 3 eligible core fabric categories:
// 1. Pure Silk Sarees
// 2. Cotton Sarees & Dhotis
// 3. Dress Materials & Unstitched Suits

export const BULK_DISCOUNT_CATEGORIES = [
  "pure-silk-sarees",
  "cotton-sarees-dhotis",
  "dress-materials",
];

// Exact tiers defined by user:
// 1 - 10 pcs: 0%
// 11 - 50 pcs: 10%
// 51 - 500 pcs: 20%
// 501 - 1000 pcs: 25%
// 1000+ pcs: 30%
export const QTY_SLABS = [
  { label: "1 – 10 pcs", min: 1, max: 10, discount: 0, badge: "Retail / Standard Price" },
  { label: "11 – 50 pcs", min: 11, max: 50, discount: 10, badge: "10% OFF" },
  { label: "51 – 500 pcs", min: 51, max: 500, discount: 20, badge: "20% OFF" },
  { label: "501 – 1000 pcs", min: 501, max: 1000, discount: 25, badge: "25% OFF" },
  { label: "1000+ pcs", min: 1001, max: Infinity, discount: 30, badge: "30% OFF (Max)" },
];

export function isCategoryEligibleForBulkDiscount(categoryIdentifier) {
  if (!categoryIdentifier) return false;
  const str = String(categoryIdentifier).toLowerCase().trim();

  return (
    BULK_DISCOUNT_CATEGORIES.some((c) => str === c || str.includes(c)) ||
    str.includes("silk") ||
    str.includes("cotton") ||
    str.includes("dress")
  );
}

export function getTierSlab(qty, categoryIdentifier) {
  if (categoryIdentifier && !isCategoryEligibleForBulkDiscount(categoryIdentifier)) {
    return QTY_SLABS[0]; // 0% discount for non-eligible categories
  }
  const quantity = Math.max(1, Number(qty) || 1);
  return QTY_SLABS.find((s) => quantity >= s.min && quantity <= s.max) || QTY_SLABS[0];
}

export function calculateUnitPrice(basePrice, qty, categoryIdentifier) {
  const slab = getTierSlab(qty, categoryIdentifier);
  const price = Number(basePrice) || 0;
  return Math.round(price * (1 - slab.discount / 100));
}
