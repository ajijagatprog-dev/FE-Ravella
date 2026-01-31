"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
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
    if (name === "email" && !value.includes("@"))
      return "Format email tidak valid";
    if (name === "phone" && value.length < 10)
      return "Nomor telepon minimal 10 digit";
    if (name === "password" && value.length < 8)
      return "Password minimal 8 karakter";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (touched[name]) {
      setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
    }
  };

  const handleFieldBlur = (name: string) => {
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({
      ...p,
      [name]: validateField(name, formData[name as keyof typeof formData]),
    }));
    setFocused("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      alert("Please agree to Terms & Conditions");
      return;
    }

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Register berhasil 🚀");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* HEADING */}
        <div className="mb-8">
          <h1 className="text-[#0d121b] text-3xl font-black mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Sign up to start your premium journey.
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-5">
          <Input
            label="Full Name"
            name="fullName"
            placeholder="John Doe"
            icon={User}
            value={formData.fullName}
            error={errors.fullName}
            touched={touched.fullName}
            focused={focused}
            onFieldFocus={setFocused}
            onFieldBlur={handleFieldBlur}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            autoFocus
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="john@mail.com"
            icon={Mail}
            value={formData.email}
            error={errors.email}
            touched={touched.email}
            focused={focused}
            onFieldFocus={setFocused}
            onFieldBlur={handleFieldBlur}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />

          <Input
            label="Phone"
            name="phone"
            type="tel"
            placeholder="+62 812 3456 7890"
            icon={Phone}
            value={formData.phone}
            error={errors.phone}
            touched={touched.phone}
            focused={focused}
            onFieldFocus={setFocused}
            onFieldBlur={handleFieldBlur}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />

          {/* PASSWORD — UI TETAP */}
          <div>
            <label className="text-[#0d121b] text-sm font-semibold">
              Password
            </label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-gray-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => handleFieldBlur("password")}
                onKeyPress={handleKeyPress}
                className={`w-full h-12 rounded-lg pl-10 pr-12
                  border bg-[#f9fafb]
                  text-[#0d121b]
                  placeholder:text-gray-400
                  transition-all
                  focus:outline-none focus:ring-2 focus:ring-primary/20
                  ${
                    touched.password && errors.password
                      ? "border-red-400 bg-red-50"
                      : focused === "password"
                        ? "border-primary shadow-sm"
                        : "border-gray-300 hover:border-gray-400"
                  }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {touched.password && errors.password && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span className="text-xs text-gray-600">
              I agree to the{" "}
              <Link href="/terms" className="text-blue-600 font-semibold">
                Terms & Conditions
              </Link>
            </span>
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !agreeTerms}
            className={`w-full h-12 rounded-lg font-bold text-white
              ${
                isSubmitting || !agreeTerms
                  ? "bg-gray-400"
                  : "bg-linear-to-r from-blue-600 to-blue-700"
              }`}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =============================
   REUSABLE INPUT COMPONENT
   (FIXED TYPING, SAME UI)
============================= */
interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onFocus" | "onBlur"
> {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  touched?: boolean;
  focused?: string;
  onFieldFocus: (name: string) => void;
  onFieldBlur: (name: string) => void;
}

function Input({
  label,
  name,
  icon: Icon,
  error,
  touched,
  focused,
  onFieldFocus,
  onFieldBlur,
  ...rest
}: InputProps) {
  return (
    <div>
      <label className="text-[#0d121b] text-sm font-semibold">{label}</label>

      <div className="relative mt-2">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-gray-400" />

        <input
          {...rest}
          name={name}
          onFocus={() => onFieldFocus(name!)}
          onBlur={() => onFieldBlur(name!)}
          className={`w-full h-12 rounded-lg pl-10 pr-10
            border bg-[#f9fafb]
            text-[#0d121b]
            placeholder:text-gray-400
            transition-all
            focus:outline-none focus:ring-2 focus:ring-primary/20
            ${
              touched && error
                ? "border-red-400 bg-red-50"
                : focused === name
                  ? "border-primary shadow-sm"
                  : "border-gray-300 hover:border-gray-400"
            }`}
        />

        {touched && !error && rest.value && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
        )}
        {touched && error && (
          <X className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
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
