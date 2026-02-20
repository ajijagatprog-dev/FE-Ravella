"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keepLogged, setKeepLogged] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email wajib diisi";
    else if (!formData.email.includes("@")) newErrors.email = "Format email tidak valid";
    if (!formData.password) newErrors.password = "Password wajib diisi";
    else if (formData.password.length < 8) newErrors.password = "Minimal 8 karakter";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Dummy Seeder Admin
      const dummyAdmin = {
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
      };

      if (
        formData.email === dummyAdmin.email &&
        formData.password === dummyAdmin.password
      ) {
        // Simpan session dummy
        localStorage.setItem(
          "auth",
          JSON.stringify({
            email: dummyAdmin.email,
            role: dummyAdmin.role,
            loggedIn: true,
          })
        );

        router.push("/admin/dashboard");
      } else {
        setErrors({
          general: "Email atau password salah",
        });
      }

      setIsSubmitting(false);
    }, 1000);
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[#1a1a1a] text-2xl font-black mb-1 tracking-tight">
          Admin Portal
        </h1>
        <p className="text-gray-500 text-sm">
          Please enter your credentials to access the secure dashboard.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((p) => ({ ...p, email: e.target.value }))
              }
              onKeyDown={handleKeyDown}
              placeholder="admin@ravellehome.com"
              className={`w-full h-11 rounded-xl pl-10 pr-4
                border bg-white text-sm text-[#1a1a1a]
                placeholder:text-gray-300
                transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30
                ${errors.email ? "border-red-400" : "border-gray-200 hover:border-gray-300 focus:border-[#8B5E3C]"}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[#1a1a1a] uppercase tracking-wide">
              Password
            </label>
            <button
              type="button"
              onClick={() => alert("Redirect to forgot password page")}
              className="text-xs text-[#8B5E3C] font-semibold hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData((p) => ({ ...p, password: e.target.value }))
              }
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              className={`w-full h-11 rounded-xl pl-10 pr-11
                border bg-white text-sm text-[#1a1a1a]
                placeholder:text-gray-300
                transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30
                ${errors.password ? "border-red-400" : "border-gray-200 hover:border-gray-300 focus:border-[#8B5E3C]"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B5E3C] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Keep me logged in */}
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div
            onClick={() => setKeepLogged(!keepLogged)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer
              ${keepLogged ? "bg-[#8B5E3C] border-[#8B5E3C]" : "border-gray-300 bg-white"}`}
          >
            {keepLogged && (
              <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-600 select-none group-hover:text-gray-800 transition-colors">
            Keep me logged in for 30 days
          </span>
        </label>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full h-12 rounded-xl font-bold text-white text-sm tracking-wide
            transition-all duration-200 flex items-center justify-center gap-2
            ${isSubmitting
              ? "bg-[#8B5E3C]/50 cursor-not-allowed"
              : "bg-[#8B5E3C] hover:bg-[#7a5234] active:scale-[0.98] shadow-md shadow-[#8B5E3C]/30 hover:shadow-lg hover:shadow-[#8B5E3C]/40"
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              SECURE LOGIN
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Back & Register */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#8B5E3C] transition-colors font-medium"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Kembali
          </Link>

          <p className="text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link
              href="/auth/register"
              className="text-[#8B5E3C] font-bold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Security Badges */}
        <div className="border-t border-gray-100 pt-5 mt-2 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                <path
                  d="M2 5L4 7L8 3"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
              SSL Encrypted Session
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
              <svg viewBox="0 0 10 10" fill="#3b82f6" className="w-2.5 h-2.5">
                <path d="M5 1L9 3V6C9 8 5 9 5 9C5 9 1 8 1 6V3L5 1Z" />
              </svg>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
              Internal Network
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}