"use client";

import {
  LogOut,
  User,
  Shield,
  Settings,
  Menu,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onMenuClick?: () => void;
}

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  cb: () => void,
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  // User Profile State
  const [userData, setUserData] = useState<{ name: string, email: string, role: string } | null>(null);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  const closeUser = useCallback(() => setUserOpen(false), []);
  useOutsideClick(userRef, closeUser);

  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        if (res.data?.status === 'success') {
          // Fix: Access nested user object
          setUserData(res.data.data.user);
        }
      })
      .catch(err => console.error("Failed to load user profile", err));
  }, []);

  const handleLogout = async () => {
    // Immediate local logout
    localStorage.removeItem('auth');
    router.push('/');

    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout cleanup failed", error);
    }
  };

  const userInitial = userData?.name ? userData.name.charAt(0).toUpperCase() : 'C';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* ── LEFT: Mobile Menu ──────────────────── */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
          </div>

          {/* ── RIGHT: Actions ──────────────────────────────── */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Store Status (hidden on mobile) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 mr-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                Online
              </span>
            </div>



            {/* ── User Profile ────────────────────────────── */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  setUserOpen((v) => !v);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow shrink-0">
                  {userInitial}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {userData?.name || "Loading..."}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    {userData?.role === "customer" ? "Loyal Customer" : "Customer"}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`hidden md:block text-gray-400 transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`}
                />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50">
                  {/* Profile preview */}
                  <div className="px-4 py-4 bg-gradient-to-br from-blue-50 to-white border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow">
                        {userInitial}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{userData?.name || "Customer"}</p>
                        <p className="text-xs text-gray-500">
                          {userData?.email || "Memuat..."}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-semibold rounded-full capitalize">
                          {userData?.role || "customer"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="p-2">
                    <Link
                      href="/"
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl hover:bg-blue-50 text-sm font-medium text-blue-600 transition-colors text-left"
                    >
                      <Shield size={15} />
                      Lihat Website
                    </Link>

                    <div className="h-px bg-gray-100 my-1.5" />

                    {[
                      {
                        icon: User,
                        label: "Profil Saya",
                        color: "text-blue-500",
                        href: "/customer/profile",
                      },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors text-left"
                      >
                        <item.icon size={15} className={item.color} />
                        {item.label}
                      </Link>
                    ))}

                    <div className="h-px bg-gray-100 my-1.5" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-semibold text-red-500 transition-colors text-left"
                    >
                      <LogOut size={15} />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Store Status */}
      <div className="xl:hidden px-4 pb-2.5">
        <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-700">
            Store Online
          </span>
        </div>
      </div>
    </header>
  );
}
