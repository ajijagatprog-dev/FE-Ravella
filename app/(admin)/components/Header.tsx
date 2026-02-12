"use client";

import { Bell, Settings, Search, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Left Section - Menu Button (Mobile) + Search */}
          <div className="flex items-center gap-3 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="text-gray-600" size={20} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative group">
                <Search
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            {/* Store Status - Hidden on mobile & tablet */}
            <div className="hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-green-50 border border-green-200">
              <div className="relative">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 block" />
                <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600 font-medium">Status:</span>
                <span className="font-semibold text-green-700">Online</span>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all group">
              <Bell
                className="text-gray-600 group-hover:text-primary transition-colors"
                size={18}
              />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] flex items-center justify-center bg-red-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full px-1 shadow-lg shadow-red-500/50">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </button>

            {/* Settings - Hidden on small mobile */}
            <button className="hidden sm:block p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all group">
              <Settings
                className="text-gray-600 group-hover:text-primary transition-colors"
                size={18}
              />
            </button>

            {/* Divider - Hidden on mobile */}
            <div className="hidden md:block w-px h-8 bg-gray-200" />

            {/* User Profile */}
            <button className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 px-1.5 sm:px-2 lg:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-all group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-md shrink-0">
                A
              </div>
              <div className="hidden md:block text-left min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  Admin
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Ravelle Fashion
                </p>
              </div>
              <ChevronDown
                className="hidden md:block text-gray-400 group-hover:text-primary transition-colors shrink-0"
                size={16}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Store Status Bar - Tampil di mobile */}
      <div className="xl:hidden px-4 pb-3">
        <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
          <div className="relative">
            <span className="w-2 h-2 rounded-full bg-green-500 block" />
            <span className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
          </div>
          <span className="text-xs font-medium text-gray-600">Status:</span>
          <span className="text-xs font-semibold text-green-700">Online</span>
        </div>
      </div>
    </header>
  );
}
