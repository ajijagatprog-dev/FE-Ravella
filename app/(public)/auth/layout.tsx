"use client";

import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* LEFT — Hero Image Panel */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden flex-col">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80")',
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />

        {/* Logo */}
        <div className="relative z-10 px-10 pt-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#8B5E3C] flex items-center justify-center shadow-md">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-5 h-5"
            >
              <path d="M21 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2M21 9H3M21 9l-1 10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 9" />
            </svg>
          </div>
          <span className="text-white text-lg font-bold tracking-widest uppercase">
            Ravelle
          </span>
        </div>

        {/* Bottom Text */}
        <div className="relative z-10 mt-auto px-10 pb-12">
          <h2 className="text-white text-4xl font-black leading-tight mb-4 drop-shadow-lg">
            Elevating Home
            <br />
            Living
            <br />
            Management.
          </h2>
          <p className="text-white/80 text-sm leading-relaxed max-w-xs">
            Access the core of Ravelle&apos;s household operations. Our secure
            dashboard provides real-time insights into curated collections,
            artisanal inventory, and home fulfillment analytics.
          </p>

          {/* Avatar Row */}
          <div className="flex items-center gap-3 mt-8">
            <div className="flex -space-x-2">
              {["bg-amber-400", "bg-rose-400", "bg-slate-500"].map(
                (color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-white ${color} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {["A", "B", "C"][i]}
                  </div>
                )
              )}
            </div>
            <p className="text-white/70 text-xs">
              Trusted by over 40+ global household curators.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT — Form Panel */}
      <div className="w-full lg:w-[42%] bg-[#f9f8f6] flex flex-col justify-center px-8 sm:px-12 md:px-16 py-12 relative">
        <div className="w-full max-w-sm mx-auto">{children}</div>

        {/* Footer */}
        <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] uppercase tracking-widest text-gray-400">
          © 2026 Ravelle Home Decor. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}