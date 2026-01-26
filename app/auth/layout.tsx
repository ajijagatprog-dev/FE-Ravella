import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f8]">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-[#e7ebf3] px-6 md:px-10 py-3 bg-white">
        <div className="flex items-center gap-3 text-[#0d121b]">
          <div className="size-6 text-primary">
            <svg viewBox="0 0 48 48" fill="currentColor">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Ravelle</h2>
        </div>

        <Link
          href="/auth/login"
          className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center hover:opacity-90 transition"
        >
          Login
        </Link>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT IMAGE */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1350&q=80")',
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-12 left-12 text-white max-w-md">
            <h3 className="text-3xl font-bold mb-3">Crafting Better Living</h3>
            <p className="opacity-90">
              Premium kitchenware for modern households.
            </p>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full lg:w-1/2 flex justify-center items-center px-4 sm:px-6 md:px-12 py-10 bg-white">
          <div className="w-full max-w-[420px] sm:max-w-[480px]">
            {children}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 border-t border-gray-100 bg-white text-center">
        <p className="text-xs text-gray-400">
          © 2024 Ravelle Indonesia. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
