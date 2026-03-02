"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, Building, FileText, MapPin, Eye, EyeOff, Check, X, AlertCircle, Loader2 } from "lucide-react";
import api from "@/lib/axios";

export default function RegisterB2BPage() {
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
        companyName: "",
        npwp: "",
        address: ""
    });

    const validateField = (name: string, value: string) => {
        if (!value && name !== "npwp") return "Wajib diisi";
        if (name === "email" && !value.includes("@")) return "Format email tidak valid";
        if (name === "phone" && value.length < 10) return "Nomor telepon minimal 10 digit";
        if (name === "password" && value.length < 8) return "Password minimal 8 karakter";
        return "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        try {
            const response = await api.post('/auth/register-b2b', {
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone_number: formData.phone,
                company_name: formData.companyName,
                npwp: formData.npwp,
                address: formData.address
            });

            if (response.data.status === 'success') {
                alert("Pendaftaran Mitra B2B berhasil! Akun Anda sedang dalam proses reviu oleh Admin. Informasi lanjutan akan dikirim melalui email.");
                router.push("/auth/login");
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.errors) {
                const backendErrors = error.response.data.errors;
                const formattedErrors: Record<string, string> = {};
                if (backendErrors.email) formattedErrors.email = backendErrors.email[0];
                if (backendErrors.name) formattedErrors.fullName = backendErrors.name[0];
                if (backendErrors.password) formattedErrors.password = backendErrors.password[0];
                if (backendErrors.company_name) formattedErrors.companyName = backendErrors.company_name[0];

                setErrors(formattedErrors);
            } else {
                alert(error.response?.data?.message || "Terjadi kesalahan saat pendaftaran");
            }
        }

        setIsSubmitting(false);
    };

    return (
        <div className="w-full">
            {/* Heading */}
            <div className="mb-7">
                <h1 className="text-[#1a1a1a] text-2xl font-black mb-1 tracking-tight">
                    B2B Partner Registration
                </h1>
                <p className="text-gray-500 text-sm">
                    Join our B2B network to unlock exclusive wholesale pricing.
                </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
                {/* Personal Details */}
                <h2 className="text-sm font-bold border-b pb-2 mb-2 text-[#8B5E3C]">Detail Personal</h2>

                <Field
                    label="Nama Lengkap PJ / PIC"
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
                />

                <div className="grid grid-cols-2 gap-4">
                    <Field
                        label="Email Pribadi / Bisnis"
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
                    />

                    <Field
                        label="Nomor Telepon / WA"
                        name="phone"
                        type="tel"
                        placeholder="08123..."
                        icon={Phone}
                        value={formData.phone}
                        error={errors.phone}
                        touched={touched.phone}
                        isFocused={focused === "phone"}
                        onFocus={() => setFocused("phone")}
                        onBlur={() => handleBlur("phone")}
                        onChange={handleChange}
                    />
                </div>

                {/* Company Details */}
                <h2 className="text-sm font-bold border-b pb-2 mb-2 mt-6 text-[#8B5E3C]">Detail Perusahaan</h2>

                <div className="grid grid-cols-2 gap-4">
                    <Field
                        label="Nama Perusahaan / Toko"
                        name="companyName"
                        placeholder="PT. Example Indo"
                        icon={Building}
                        value={formData.companyName}
                        error={errors.companyName}
                        touched={touched.companyName}
                        isFocused={focused === "companyName"}
                        onFocus={() => setFocused("companyName")}
                        onBlur={() => handleBlur("companyName")}
                        onChange={handleChange}
                    />

                    <Field
                        label="NPWP (Opsional)"
                        name="npwp"
                        placeholder="12.345.xxx"
                        icon={FileText}
                        value={formData.npwp}
                        error={errors.npwp}
                        touched={touched.npwp}
                        isFocused={focused === "npwp"}
                        onFocus={() => setFocused("npwp")}
                        onBlur={() => handleBlur("npwp")}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 uppercase tracking-wide">
                        Alamat Lengkap Perusahaan
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                            name="address"
                            value={formData.address}
                            placeholder="Jl. Sudirman No 4..."
                            onChange={handleChange}
                            onFocus={() => setFocused("address")}
                            onBlur={() => handleBlur("address")}
                            rows={3}
                            className={`w-full rounded-xl pl-10 pr-4 py-3
                 border bg-white text-sm text-[#1a1a1a]
                 placeholder:text-gray-300
                 transition-all focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/30
                 ${touched.address && errors.address
                                    ? "border-red-400"
                                    : focused === "address"
                                        ? "border-[#8B5E3C] shadow-sm"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                        />
                    </div>
                    {touched.address && errors.address && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.address}
                        </p>
                    )}
                </div>


                {/* Security / Password */}
                <h2 className="text-sm font-bold border-b pb-2 mb-2 mt-6 text-[#8B5E3C]">Keamanan Akun</h2>
                <div>
                    <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5 uppercase tracking-wide">
                        Password Akses Dasbor
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
                <label className="flex items-start gap-2.5 cursor-pointer group mt-4">
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
                            B2B Partner Terms & Conditions
                        </Link>{" "}
                        and verify that all provided information is accurate.
                    </span>
                </label>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !agreeTerms}
                    className={`w-full h-12 rounded-xl font-bold text-white text-sm tracking-wide mt-2
            transition-all duration-200 flex items-center justify-center gap-2
            ${isSubmitting || !agreeTerms
                            ? "bg-[#8B5E3C]/40 cursor-not-allowed"
                            : "bg-[#8B5E3C] hover:bg-[#7a5234] active:scale-[0.98] shadow-md shadow-[#8B5E3C]/30 hover:shadow-lg hover:shadow-[#8B5E3C]/40"
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting Application...
                        </>
                    ) : (
                        "Submit B2B Application"
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
                        Sudah terdaftar B2B?{" "}
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
