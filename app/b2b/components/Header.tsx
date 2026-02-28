"use client";

import {
  Bell,
  Settings,
  Search,
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  HelpCircle,
  Shield,
  Moon,
  Sun,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Check,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface HeaderProps {
  onMenuClick?: () => void;
}

// ── Dummy Notifications ───────────────────────────────────────────────────────

const INITIAL_NOTIFS: Notification[] = [
  {
    id: 1,
    title: "New Order #12344",
    desc: "Sarah Jenkins placed a new order",
    time: "2 min ago",
    read: false,
    icon: ShoppingCart,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    title: "New Loyalty Member",
    desc: "User from California, US joined",
    time: "15 min ago",
    read: false,
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 3,
    title: "Low Stock Warning",
    desc: '"Silk Midi Dress" (Blue) is running low',
    time: "5 hrs ago",
    read: false,
    icon: Package,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    id: 4,
    title: "Monthly Report Ready",
    desc: "October report has been generated",
    time: "1 day ago",
    read: true,
    icon: BarChart2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

const SEARCH_SUGGESTIONS = [
  "Velvet Lounge Chair",
  "Ceramic Pour-Over Set",
  "Cotton Duvet Cover",
  "Order #RVL-4921",
  "Sarah Jenkins",
  "Stock Report",
];

// ── useOutsideClick ───────────────────────────────────────────────────────────

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

// ── Main Component ────────────────────────────────────────────────────────────

export default function Header({ onMenuClick }: HeaderProps) {
  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notifications
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Settings
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(false);

  // User
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  // Outside clicks
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const closeUser = useCallback(() => setUserOpen(false), []);

  useOutsideClick(searchRef, closeSearch);
  useOutsideClick(notifRef, closeNotif);
  useOutsideClick(settingsRef, closeSettings);
  useOutsideClick(userRef, closeUser);

  // Derived
  const unread = notifs.filter((n) => !n.read).length;
  const filtered = searchQuery.trim()
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : SEARCH_SUGGESTIONS;

  // Handlers
  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: number) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const deleteNotif = (id: number) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifs([]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* ── LEFT: Mobile Menu + Search ──────────────────── */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
            >
              <Menu size={20} className="text-gray-600" />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-xl" ref={searchRef}>
              <div className="relative group">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Cari produk, pesanan, pelanggan..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full pl-9 pr-9 py-2 sm:py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Search Dropdown */}
              {searchOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      {searchQuery ? "Hasil Pencarian" : "Pencarian Cepat"}
                    </p>
                  </div>
                  {filtered.length > 0 ? (
                    <ul>
                      {filtered.map((s, i) => (
                        <li key={i}>
                          <button
                            onClick={() => {
                              setSearchQuery(s);
                              setSearchOpen(false);
                            }}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                          >
                            <Search
                              size={13}
                              className="text-gray-400 shrink-0"
                            />
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-3 py-4 text-sm text-gray-400 text-center">
                      Tidak ada hasil untuk &ldquo;{searchQuery}&rdquo;
                    </p>
                  )}
                </div>
              )}
            </div>
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

            {/* ── Notifications ───────────────────────────── */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setSettingsOpen(false);
                  setUserOpen(false);
                }}
                className="relative p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <Bell
                  size={18}
                  className="text-gray-600 group-hover:text-blue-500 transition-colors"
                />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-1 shadow-md">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">
                        Notifikasi
                      </h3>
                      {unread > 0 && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                          {unread} baru
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unread > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Check size={11} /> Tandai semua
                        </button>
                      )}
                      {notifs.length > 0 && (
                        <button
                          onClick={clearAll}
                          className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={11} /> Hapus semua
                        </button>
                      )}
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {notifs.length === 0 ? (
                      <div className="py-10 text-center">
                        <Bell
                          size={28}
                          className="text-gray-200 mx-auto mb-2"
                        />
                        <p className="text-sm text-gray-400">
                          Tidak ada notifikasi
                        </p>
                      </div>
                    ) : (
                      notifs.map((n) => {
                        const Icon = n.icon;
                        return (
                          <div
                            key={n.id}
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group ${!n.read ? "bg-blue-50/40" : ""}`}
                            onClick={() => markRead(n.id)}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
                            >
                              <Icon size={14} className={n.iconColor} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={`text-sm font-semibold truncate ${!n.read ? "text-gray-900" : "text-gray-600"}`}
                                >
                                  {n.title}
                                </p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotif(n.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all shrink-0"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5 truncate">
                                {n.desc}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {n.time}
                              </p>
                            </div>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Settings ────────────────────────────────── */}
            <div className="relative hidden sm:block" ref={settingsRef}>
              <button
                onClick={() => {
                  setSettingsOpen((v) => !v);
                  setNotifOpen(false);
                  setUserOpen(false);
                }}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <Settings
                  size={18}
                  className={`transition-all duration-300 group-hover:text-blue-500 ${settingsOpen ? "rotate-45 text-blue-500" : "text-gray-600"}`}
                />
              </button>

              {settingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Pengaturan
                    </p>
                  </div>
                  <div className="p-2">
                    {/* Dark Mode Toggle */}
                    <div
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setDarkMode((v) => !v)}
                    >
                      <div className="flex items-center gap-2.5">
                        {darkMode ? (
                          <Moon size={15} className="text-indigo-500" />
                        ) : (
                          <Sun size={15} className="text-amber-500" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {darkMode ? "Dark Mode" : "Light Mode"}
                        </span>
                      </div>
                      <div
                        className={`w-9 h-5 rounded-full transition-colors duration-300 relative ${darkMode ? "bg-blue-500" : "bg-gray-200"}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${darkMode ? "translate-x-4" : "translate-x-0"}`}
                        />
                      </div>
                    </div>

                    {[
                      {
                        icon: Shield,
                        label: "Keamanan & Privasi",
                        color: "text-emerald-500",
                      },
                      {
                        icon: HelpCircle,
                        label: "Bantuan & Dukungan",
                        color: "text-blue-500",
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors text-left"
                      >
                        <item.icon size={15} className={item.color} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-7 bg-gray-200 mx-1" />

            {/* ── User Profile ────────────────────────────── */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  setUserOpen((v) => !v);
                  setNotifOpen(false);
                  setSettingsOpen(false);
                }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow shrink-0">
                  B2B
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    B2B
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    Ravelle Fashion
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
                        B2B
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">B2B</p>
                        <p className="text-xs text-gray-500">
                          b2b@ravelle.com
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-semibold rounded-full">
                          B2B
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="p-2">
                    {[
                      {
                        icon: User,
                        label: "Profil Saya",
                        color: "text-blue-500",
                      },
                      {
                        icon: Shield,
                        label: "Keamanan",
                        color: "text-emerald-500",
                      },
                      {
                        icon: Settings,
                        label: "Pengaturan Akun",
                        color: "text-gray-500",
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors text-left"
                      >
                        <item.icon size={15} className={item.color} />
                        {item.label}
                      </button>
                    ))}

                    <div className="h-px bg-gray-100 my-1.5" />

                    <Link href="/">
                      <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-semibold text-red-500 transition-colors text-left">
                        <LogOut size={15} />
                        Keluar
                      </button>
                    </Link>
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
