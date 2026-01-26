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

  const handleBlur = (name: string) => {
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({
      ...p,
      [name]: validateField(name, formData[name as keyof typeof formData]),
    }));
    setFocused("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Validate all fields first
    const newTouched: Record<string, boolean> = {};
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    setTouched(newTouched);
    setErrors(newErrors);

    // Check if terms are agreed
    if (!agreeTerms) {
      alert("Please agree to Terms & Conditions");
      return;
    }

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }

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
            onFocus={setFocused}
            onBlur={handleBlur}
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
            onFocus={setFocused}
            onBlur={handleBlur}
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
            onFocus={setFocused}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />

          {/* PASSWORD */}
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
                onBlur={() => handleBlur("password")}
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
                aria-label={showPassword ? "Hide password" : "Show password"}
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

          {/* LOYALTY REWARD */}
          <div className="bg-linear-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 flex gap-3 items-start">
            <div className="bg-blue-600 rounded-lg p-2 shrink-0">
              <Star className="text-white w-5 h-5" fill="currentColor" />
            </div>
            <div>
              <p className="text-[#0d121b] text-sm font-semibold mb-1">
                Ravelle Rewards
              </p>
              <p className="text-gray-600 text-xs">
                Earn points on every purchase and unlock exclusive benefits!
              </p>
            </div>
          </div>

          {/* TERMS & CONDITIONS */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-xs text-gray-600 cursor-pointer select-none"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-blue-600 font-semibold hover:underline"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* REGISTER BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !agreeTerms}
            className={`w-full h-12 rounded-lg font-bold text-white
              transition-all duration-200
              ${
                isSubmitting || !agreeTerms
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          {/* DIVIDER */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          {/* SOCIAL REGISTER */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => alert("Google register")}
              className="flex items-center justify-center gap-2 h-11 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-400 hover:shadow-md transition-all font-medium text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            <button
              onClick={() => alert("Facebook register")}
              className="flex items-center justify-center gap-2 h-11 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-400 hover:shadow-md transition-all font-medium text-gray-700"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
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
   REUSABLE INPUT COMPONENT
============================= */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  touched?: boolean;
  focused?: string;
  onFocus: (name: string) => void;
  onBlur: (name: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function Input(props: InputProps) {
  const {
    label,
    name,
    icon: Icon,
    error,
    touched,
    focused,
    onFocus,
    onBlur,
    onKeyPress,
    ...rest
  } = props;

  return (
    <div>
      <label className="text-[#0d121b] text-sm font-semibold">{label}</label>
      <div className="relative mt-2">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-gray-400" />
        <input
          {...rest}
          name={name}
          onFocus={() => onFocus(name)}
          onBlur={() => onBlur(name)}
          onKeyPress={onKeyPress}
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
