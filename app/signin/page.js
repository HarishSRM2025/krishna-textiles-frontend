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
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!emailOrPhone.trim()) {
      setError("Please enter your registered email address");
      return;
    }

    if (!password) {
      setError("Please enter your account password");
      return;
    }

    setLoading(true);
    try {
      await login(emailOrPhone.trim().toLowerCase(), password);
      setSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 700);
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#d32f2f]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#c59b27]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-slate-50/60 pointer-events-none" />

      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden grid lg:grid-cols-12 relative z-10">
        {/* Left Side: Brand Showcase */}
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
              Verified Textile Portal
            </div>

            <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3 tracking-tight text-white">
              Welcome back to Krishna Textiles
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
              Access your order history, delivery tracking, and wholesale tiered discounts directly from Tamil Nadu mills.
            </p>

            {/* Benefit Checkpoints */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={13} />
                </div>
                <span>Direct Mill Sourcing Rates (Up to 70% Off)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={13} />
                </div>
                <span>100% Legitimate Tax Invoiced Orders</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={13} />
                </div>
                <span>Pan-India Dispatch across 28,000+ Pincodes</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={16} className="text-green-400" /> 100% Genuine Brands
            </span>
            <span className="text-[#c59b27] font-bold">Est. 2006</span>
          </div>
        </div>

        {/* Right Side: Clean Sign In Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h1 className="text-2xl font-black text-[#0c2340]">Sign In</h1>
              <p className="text-xs text-slate-500 mt-1">
                New to Krishna Textiles?{" "}
                <Link href="/signup" className="text-[#d32f2f] font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} /> Sign in successful! Redirecting to dashboard...
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Mobile Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address or Mobile Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="name@example.com or 9876543210"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#0c2340] focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <Link
                    href="/contact"
                    className="text-[11px] font-bold text-[#0c2340] hover:text-[#d32f2f] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#0c2340] focus:bg-white transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#d32f2f] focus:ring-0 cursor-pointer"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-[#d32f2f] hover:bg-[#b71c1c] disabled:opacity-70 text-white font-extrabold text-xs sm:text-sm py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Krishna Textiles</span> <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Security Note */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
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
