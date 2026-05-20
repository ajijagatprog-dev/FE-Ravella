"use client";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useBanners } from "@/lib/useBanners";

// ─── SETUP FONT (tambahkan ke layout.tsx / _document.tsx) ────────────────────
// <link rel="preconnect" href="https://fonts.googleapis.com" />
// <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
// <link
//   href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap"
//   rel="stylesheet"
// />
//
// tailwind.config.ts:
// fontFamily: {
//   serif: ['Cormorant Garamond', 'Georgia', 'serif'],
//   sans:  ['Jost', 'system-ui', 'sans-serif'],
// }
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_HERO_IMAGES = [
  "/Hero/banner1.png",
  "/Hero/banner2.png",
  "/Hero/banner3.png",
];

const HERO_DATA = [
  {
    badge: "PENAWARAN TERBAIK",
    title: "Peralatan Dapur Premium",
    subtitle: "Koleksi Best Seller",
    description:
      "Temukan peralatan dapur berkualitas tinggi dengan harga terjangkau. Sempurnakan setiap masakan Anda.",
    cta: "Belanja Sekarang",
    link: "/products",
  },
  {
    badge: "KOLEKSI TERBARU",
    title: "Inovasi Dapur Modern",
    subtitle: "New Arrival 2025",
    description:
      "Hadirkan inovasi terbaru ke dapur Anda. Desain modern, fungsi maksimal, kualitas terjamin.",
    cta: "Lihat Koleksi",
    link: "/products/new",
  },
  {
    badge: "KUALITAS PREMIUM",
    title: "Investasi Terbaik Anda",
    subtitle: "Garansi Resmi",
    description:
      "Produk original dengan garansi resmi. Layanan purna jual terpercaya untuk kepuasan Anda.",
    cta: "Jelajahi Sekarang",
    link: "/products",
  },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const HERO_IMAGES = useBanners("home", DEFAULT_HERO_IMAGES);

  const nextSlide = () => {
    setActive((p) => (p + 1) % HERO_IMAGES.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setActive((p) => (p - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
    setProgress(0);
  };

  useEffect(() => {
    const slide = setInterval(nextSlide, 6000);
    const bar = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 1.7));
    }, 100);
    return () => {
      clearInterval(slide);
      clearInterval(bar);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#352309]">
      {/* ── HERO IMAGE & CONTENT — full width ── */}
      <div className="relative">
        <div className="relative w-full md:h-[440px] overflow-hidden">
          <HeroBackground active={active} images={HERO_IMAGES} />

          {/* Nav Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-7 h-7 md:w-11 md:h-11 flex items-center justify-center border border-white/25 text-white hover:bg-white hover:text-neutral-900 transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-7 h-7 md:w-11 md:h-11 flex items-center justify-center border border-white/25 text-white hover:bg-white hover:text-neutral-900 transition-all duration-300 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="max-w-[1600px] mx-auto">
        <div className="relative px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 border-t border-white/10">
          {/* Tabs & Progress */}
          <div className="flex items-center justify-between gap-1 lg:gap-6 py-1 lg:py-5">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1 sm:gap-4 w-full lg:w-auto">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActive(i);
                    setProgress(0);
                  }}
                  className="relative group px-1.5 py-1 sm:px-4 sm:py-2.5 transition-all duration-300"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <span
                    className={`text-[9px] sm:text-[10px] md:text-[11px] font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 ${
                      active === i
                        ? "text-white"
                        : "text-white/40 group-hover:text-white/80"
                    }`}
                  >
                    {HERO_DATA[i]?.subtitle || `Banner ${i + 1}`}
                  </span>

                  <div
                    className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-500 ease-out ${
                      active === i
                        ? "w-full"
                        : "w-0 group-hover:w-1/2 group-hover:bg-white/40"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="hidden lg:flex w-64 items-center gap-4 lg:px-0">
              <div className="flex-1 h-[2px] bg-white/10 overflow-hidden rounded-full">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-white/50 text-[10px] sm:text-[11px] font-medium tracking-[0.2em] min-w-[3rem] text-right">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(HERO_IMAGES.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 mb-0 sm:mb-6 lg:mb-8">
            <FeatureBadge
              icon={<Truck className="w-4 h-4 sm:w-5 sm:h-5" />}
              label="Gratis Ongkir"
              subtext="Min. Belanja 100k"
            />
            <FeatureBadge
              icon={<ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />}
              label="Garansi Resmi"
              subtext="100% Original"
            />
            <FeatureBadge
              icon={<Award className="w-4 h-4 sm:w-5 sm:h-5" />}
              label="Kualitas Premium"
              subtext="Trusted Quality"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── BACKGROUND ── */
function HeroBackground({
  active,
  images,
}: {
  active: number;
  images: string[];
}) {
  return (
    <div className="relative w-full md:absolute md:inset-0 bg-[#352309]">
      {images.map((img, i) => {
        const link = HERO_DATA[i]?.link || "/products";
        const isActive = active === i;
        return (
          <Link
            href={link}
            key={i}
            className={`block transition-opacity duration-[1400ms] ease-in-out ${
              isActive
                ? "relative md:absolute md:inset-0 opacity-100 z-10"
                : "absolute inset-0 opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={img}
              alt={HERO_DATA[i]?.title || `Banner ${i + 1}`}
              className="w-full h-auto md:h-full md:object-cover md:object-center"
            />
          </Link>
        );
      })}
    </div>
  );
}

/* ── FEATURE BADGE ── */
function FeatureBadge({
  icon,
  label,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  subtext: string;
}) {
  return (
    <div className="group flex items-center justify-center sm:justify-start gap-1.5 sm:gap-4 px-1 sm:px-6 py-1.5 sm:py-5 hover:bg-white/5 transition-colors duration-300">
      <div className="flex-shrink-0 text-white/60 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <div className="text-center sm:text-left">
        <div className="font-semibold text-white text-[10px] sm:text-[11px] tracking-[0.15em] sm:tracking-[0.18em] uppercase leading-tight">
          {label}
        </div>
        <div className="text-white/50 text-[9px] sm:text-[10px] mt-0.5 tracking-[0.1em] sm:tracking-[0.12em] font-light">
          {subtext}
        </div>
      </div>
    </div>
  );
}
