// Shared Address Management Utility for Krishna Textiles (Profile & Checkout)

const STORAGE_KEY = (userId) => `kt_saved_addresses_${userId || "guest"}`;

export function getSavedAddresses(userId) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read saved addresses from localStorage:", err);
    return [];
  }
}

export function saveAddresses(userId, addresses) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(addresses));
    // Dispatch custom event so profile and checkout stay synchronized
    window.dispatchEvent(new Event("kt_addresses_updated"));
  } catch (err) {
    console.error("Failed to write saved addresses to localStorage:", err);
  }
}

export function addSavedAddress(userId, addr) {
  const current = getSavedAddresses(userId);
  const isFirst = current.length === 0;
  const isDefault = isFirst || !!addr.isDefault;

  const newEntry = {
    id: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: addr.name?.trim() || "",
    phone: addr.phone?.trim() || "",
    email: addr.email?.trim() || "",
    label: addr.label || "Home",
    address: addr.address?.trim() || "",
    city: addr.city?.trim() || "",
    state: addr.state?.trim() || "",
    pincode: addr.pincode?.trim() || "",
    isDefault,
    createdAt: new Date().toISOString(),
  };

  const list = current.map((a) => (isDefault ? { ...a, isDefault: false } : a));
  const updated = [newEntry, ...list];
  saveAddresses(userId, updated);
  return updated;
}

export function deleteSavedAddress(userId, addressId) {
  const current = getSavedAddresses(userId);
  const filtered = current.filter((a) => a.id !== addressId);
  if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
    filtered[0].isDefault = true;
  }
  saveAddresses(userId, filtered);
  return filtered;
}

export function setDefaultSavedAddress(userId, addressId) {
  const current = getSavedAddresses(userId);
  const updated = current.map((a) => ({
    ...a,
    isDefault: a.id === addressId,
  }));
  saveAddresses(userId, updated);
  return updated;
}
