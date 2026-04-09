"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, Eye, EyeOff, Check, X, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const validateField = (name: string, value: string) => {
    if (!value) return "Wajib diisi";
    if (name === "email" && !value.includes("@")) return "Format email tidak valid";
    if (name === "phone" && value.length < 10) return "Nomor telepon minimal 10 digit";
    if (name === "password" && value.length < 8) return "Password minimal 8 karakter";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({
      ...p,
      [name]: validateField(name, formData[name as keyof typeof formData]),
    }));
    setFocused("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSubmit = async () => {
    const newTouched: Record<string, boolean> = {};
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (!agreeTerms) {
      toast.error("Silakan setujui Syarat & Ketentuan");
      return;
    }

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone
      });

      if (response.data.status === 'success') {
        const { user, access_token } = response.data.data;
        const userRole = user.role || 'customer';

        // Auto login logic after registration
        localStorage.setItem(
          "auth",
          JSON.stringify({
            email: user.email,
            role: userRole,
            token: access_token,
            loggedIn: true,
          })
        );

        toast.success("Register berhasil! Selamat bergabung 🚀");
        router.push("/customer/dashboard");
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Mapping backend validation errors to frontend
        const backendErrors = error.response.data.errors;
        const formattedErrors: Record<string, string> = {};
        if (backendErrors.email) formattedErrors.email = backendErrors.email[0];
        if (backendErrors.name) formattedErrors.fullName = backendErrors.name[0];
        if (backendErrors.password) formattedErrors.password = backendErrors.password[0];

        setErrors(formattedErrors);
      } else {
        toast.error(error.response?.data?.message || "Terjadi kesalahan saat pendaftaran");
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-[#1a1a1a] text-2xl font-black mb-1 tracking-tight">
          Create Account
        </h1>
        <p className="text-gray-500 text-sm">
          Sign up to start your premium journey with Ravelle.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Full Name */}
        <Field
          label="Full Name"
          name="fullName"
          placeholder="John Doe"
          icon={User}
          value={formData.fullName}
          error={errors.fullName}
          touched={touched.fullName}
          isFocused={focused === "fullName"}
          onFocus={() => setFocused("fullName")}
          onBlur={() => handleBlur("fullName")}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        {/* Email */}
        <Field
          label="Email Address"
          name="email"
          type="email"
          placeholder="john@mail.com"
          icon={Mail}
          value={formData.email}
          error={errors.email}
          touched={touched.email}
          isFocused={focused === "email"}
          onFocus={() => setFocused("email")}
          onBlur={() => handleBlur("email")}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {/* Phone */}
        <Field
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="+62 812 3456 7890"
          icon={Phone}
          value={formData.phone}
          error={errors.phone}
          touched={touched.phone}
          isFocused={focused === "phone"}
          onFocus={() => setFocused("phone")}
          onBlur={() => handleBlur("phone")}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => handleBlur("password")}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              className={`w-full h-11 rounded-xl pl-10 pr-11
                border bg-white text-sm text-[#1a1a1a]
                placeholder:text-gray-300
                transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30
                ${touched.password && errors.password
                  ? "border-red-400"
                  : focused === "password"
                    ? "border-[#8B5E3C] shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B5E3C] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer group">
          <div
            onClick={() => setAgreeTerms(!agreeTerms)}
            className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer
              ${agreeTerms ? "bg-[#8B5E3C] border-[#8B5E3C]" : "border-gray-300 bg-white"}`}
          >
            {agreeTerms && (
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
          <span className="text-xs text-gray-600 select-none group-hover:text-gray-800 transition-colors leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-[#8B5E3C] font-semibold hover:underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#8B5E3C] font-semibold hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !agreeTerms}
          className={`w-full h-12 rounded-xl font-bold text-white text-sm tracking-wide
            transition-all duration-200 flex items-center justify-center gap-2
            ${isSubmitting || !agreeTerms
              ? "bg-[#8B5E3C]/40 cursor-not-allowed"
              : "bg-[#8B5E3C] hover:bg-[#7a5234] active:scale-[0.98] shadow-md shadow-[#8B5E3C]/30 hover:shadow-lg hover:shadow-[#8B5E3C]/40"
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Back & Login */}
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
            Sudah punya akun?{" "}
            <Link
              href="/auth/login"
              className="text-[#8B5E3C] font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* =============================
   REUSABLE FIELD COMPONENT
============================= */
interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  error?: string;
  touched?: boolean;
  isFocused?: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  error,
  touched,
  isFocused,
  onFocus,
  onBlur,
  onChange,
  onKeyDown,
  autoFocus,
}: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          className={`w-full h-11 rounded-xl pl-10 pr-10
            border bg-white text-sm text-[#1a1a1a]
            placeholder:text-gray-300
            transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30
            ${touched && error
              ? "border-red-400"
              : isFocused
                ? "border-[#8B5E3C] shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
        />
        {touched && !error && value && (
          <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
        )}
        {touched && error && (
          <X className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
        )}
      </div>
      {touched && error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}