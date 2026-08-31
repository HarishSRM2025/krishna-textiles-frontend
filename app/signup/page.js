"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  User,
  MapPin,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pincode, setPincode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-check.");
      return;
    }
    if (!agreeTerms) {
      setError("Please agree to the Terms of Service & Privacy Policy");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    }, 900);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#d32f2f]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#c59b27]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-slate-50/60 pointer-events-none" />

      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden grid lg:grid-cols-12 relative z-10">
        {/* Left Side: Brand Value Proposition & Trust */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0c2340] via-[#0e2c52] to-[#163b6b] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20px 20px, white 2%, transparent 0%)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10">
            {/* Logo */}
            <Link href="/" className="inline-block mb-8">
              <Image
                src="/logo.png"
                alt="Krishna Textiles"
                width={170}
                height={45}
                className="h-10 w-auto object-contain"
                unoptimized
                priority
              />
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#c59b27] text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
              <Sparkles size={12} />
              Join 50,000+ Verified Buyers
            </div>

            <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3 tracking-tight text-white">
              Direct Textile Mill Sourcing Partner
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
              Create your account today to access manufacturer prices, factory dispatch tracking, and volume discounts.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-[#d32f2f] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-white block">Direct Factory Rates</strong>
                  <span className="text-slate-300 text-[11px]">Bypass middlemen margins with direct mill sourcing.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-[#d32f2f] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-white block">Quantity-Based Pricing Slabs</strong>
                  <span className="text-slate-300 text-[11px]">Automatic tiered discounts up to 70% off.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-[#d32f2f] text-white flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-white block">100% Tax Invoiced &amp; Genuine</strong>
                  <span className="text-slate-300 text-[11px]">GST compliance for retail &amp; commercial orders.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={16} className="text-green-400" /> 100% Data Privacy Guaranteed
            </span>
            <span className="text-[#c59b27] font-bold">Est. 2006</span>
          </div>
        </div>

        {/* Right Side: Clean Sign Up Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white overflow-y-auto">
          <div>
            {/* Header */}
            <div className="mb-5 pb-3 border-b border-slate-100">
              <h1 className="text-2xl font-black text-[#0c2340]">Create Account</h1>
              <p className="text-xs text-slate-500 mt-1">
                Already have an account?{" "}
                <Link href="/signin" className="text-[#d32f2f] font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Success Banner */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} /> Account created successfully! Redirecting...
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#0c2340] focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400">
                      <Mail size={15} />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#0c2340] focus:bg-white font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400">
                      <Phone size={15} />
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit number"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#0c2340] focus:bg-white font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Create Password *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400">
                      <Lock size={15} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#0c2340] focus:bg-white font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400">
                      <Lock size={15} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#0c2340] focus:bg-white font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery PIN Code (Optional)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <MapPin size={15} />
                  </span>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="e.g. 641001"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#0c2340] focus:bg-white font-medium"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#d32f2f] focus:ring-0 cursor-pointer"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/contact" className="text-[#0c2340] font-bold hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/contact" className="text-[#0c2340] font-bold hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-[#d32f2f] hover:bg-[#b71c1c] disabled:opacity-70 text-white font-extrabold text-xs sm:text-sm py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span> <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Note */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <Link href="/" className="text-slate-600 hover:text-[#0c2340] font-bold">
              ← Back to Store
            </Link>
            <span>Protected by 256-bit SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
