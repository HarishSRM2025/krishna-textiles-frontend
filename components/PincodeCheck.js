"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState(null);

  function handleCheck() {
    if (/^\d{6}$/.test(pin)) {
      setResult({ ok: true, days: Math.floor(Math.random() * 3) + 3 });
    } else {
      setResult({ ok: false });
    }
  }

  return (
    <div className="card p-5 h-fit bg-[#EDF2FA] border-none">
      <h3 className="font-bold text-navy text-sm mb-1">
        CHECK DELIVERY BEFORE YOU SHOP
      </h3>
      <p className="text-xs text-gray-500 mb-3">Enter your 6-digit pincode</p>
      <div className="flex gap-2 mb-3">
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter Pincode"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-navy"
        />
        <button onClick={handleCheck} className="btn-primary px-4 py-2 text-sm">
          Check
        </button>
      </div>

      {result && (
        <p
          className={`text-xs mb-3 font-medium ${
            result.ok ? "text-green-600" : "text-brand-red"
          }`}
        >
          {result.ok
            ? `Delivery available! Estimated ${result.days} days.`
            : "Please enter a valid 6-digit pincode."}
        </p>
      )}

      <ul className="space-y-2 text-xs text-gray-600">
        <li className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green-600" /> We deliver to your location
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green-600" /> Multiple delivery options available
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green-600" /> Estimated delivery: 3 – 5 days
        </li>
      </ul>
    </div>
  );
}
