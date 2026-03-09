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
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" }>({
        visible: false,
        message: "",
        type: "success",
    });

    const showToast = (message: string, type: "success" | "error" = "error") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3000);
    };

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
            showToast("Harap setujui Syarat & Ketentuan");
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
                setShowSuccessModal(true);
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
                showToast(error.response?.data?.message || "Terjadi kesalahan saat pendaftaran");
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

            {/* ── Toast ── */}
            <div className={`fixed top-6 right-6 z-[100] transition-all duration-500 ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
                <div className={`flex items-center gap-3 bg-white border shadow-xl px-5 py-4 min-w-[320px] max-w-sm rounded-xl ${toast.type === "error" ? "border-red-100" : "border-green-100"}`} style={{ fontFamily: "'Jost', sans-serif" }}>
                    {toast.type === "error" ? (
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    ) : (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${toast.type === "error" ? "text-red-900" : "text-green-900"}`}>{toast.type === "error" ? "Form Error" : "Success"}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{toast.message}</p>
                    </div>
                </div>
            </div>

            {/* ── Success Modal ── */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500"
                        onClick={() => router.push("/")}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 sm:p-10 text-center">
                            {/* Icon Decoration */}
                            <div className="mb-6 relative inline-block">
                                <div className="absolute inset-0 bg-green-100 rounded-full scale-150 blur-xl opacity-50 animate-pulse" />
                                <div className="relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
                                    <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight" style={{ fontFamily: "'Jost', sans-serif" }}>
                                Pendaftaran Berhasil!
                            </h3>

                            <div className="space-y-4 mb-8">
                                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Jost', sans-serif" }}>
                                    Terima kasih telah mendaftar sebagai Mitra B2B Ravelle. Tim kami akan segera meninjau aplikasi Anda.
                                </p>
                                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100/50">
                                    <p className="text-amber-800 text-[11px] font-bold uppercase tracking-[0.1em] mb-1">Status Akun</p>
                                    <p className="text-amber-700 text-sm font-medium">Sedang dalam proses reviu</p>
                                </div>
                                <p className="text-gray-400 text-xs italic">
                                    Informasi lanjutan akan dikirimkan melalui email yang terdaftar.
                                </p>
                            </div>

                            <button
                                onClick={() => router.push("/")}
                                className="w-full h-12 bg-[#1a1a1a] hover:bg-black text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-black/10"
                            >
                                Kembali ke Beranda
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
