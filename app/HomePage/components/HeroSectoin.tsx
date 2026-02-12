"use client";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { link } from "fs";

const HERO_IMAGES = [
  "/Hero/banner1.png",
  "/Hero/banner2.png",
  "/Hero/banner3.png",
];

const HERO_DATA = [
  {
    badge: "🔥 PENAWARAN TERBAIK",
    title: "Peralatan Dapur Premium",
    subtitle: "Koleksi Best Seller",
    description:
      "Temukan peralatan dapur berkualitas tinggi dengan harga terjangkau. Sempurnakan setiap masakan Anda.",
    cta: "Belanja Sekarang",
    link: "/products",
  },
  {
    badge: "✨ KOLEKSI TERBARU",
    title: "Inovasi Dapur Modern",
    subtitle: "New Arrival 2025",
    description:
      "Hadirkan inovasi terbaru ke dapur Anda. Desain modern, fungsi maksimal, kualitas terjamin.",
    cta: "Lihat Koleksi",
    link: "/products/new",
  },
  {
    badge: "💎 KUALITAS PREMIUM",
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
  const [isLoaded, setIsLoaded] = useState(false);

  const nextSlide = () => {
    setActive((p) => (p + 1) % HERO_IMAGES.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setActive((p) => (p - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
    setProgress(0);
  };

  useEffect(() => {
    setIsLoaded(true);
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
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* HERO CONTAINER */}
      <div className="relative max-w-[1600px] mx-auto">
        {/* HERO IMAGE & CONTENT */}
        <div className="relative h-[480px] sm:h-[540px] md:h-[600px] lg:h-[680px] xl:h-[720px] w-full">
          <HeroBackground active={active} />

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center hover:scale-110 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center hover:scale-110 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <HeroContent active={active} isLoaded={isLoaded} />
        </div>

        {/* CONTROLS & INDICATORS */}
        <div className="relative px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
          {/* Navigation Dots & Progress */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 py-6 sm:py-8">
            {/* Dots */}
            <div className="flex items-center gap-3">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActive(i);
                    setProgress(0);
                  }}
                  className="relative group"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      active === i
                        ? "w-12 sm:w-16 bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg shadow-orange-500/50"
                        : "w-2 bg-white/30 hover:bg-white/50 hover:w-8"
                    }`}
                  />
                  {/* Tooltip */}
                  <div
                    className={`absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg transition-all duration-300 shadow-xl pointer-events-none ${
                      active === i
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
                    }`}
                  >
                    <div className="font-semibold">{HERO_DATA[i].subtitle}</div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full sm:w-56 md:w-64 flex items-center gap-3">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 transition-all rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-white/60 text-xs font-medium min-w-[3rem]">
                {active + 1} / {HERO_IMAGES.length}
              </span>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pb-8 sm:pb-10 md:pb-12">
            <FeatureBadge
              icon={<Truck className="w-5 h-5" />}
              label="Gratis Ongkir"
              subtext="Min. Belanja 100k"
            />
            <FeatureBadge
              icon={<ShieldCheck className="w-5 h-5" />}
              label="Garansi Resmi"
              subtext="100% Original"
            />
            <FeatureBadge
              icon={<Award className="w-5 h-5" />}
              label="Kualitas Premium"
              subtext="Trusted Quality"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}

/* ================= BACKGROUND ================= */
function HeroBackground({ active }: { active: number }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
      {HERO_IMAGES.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
            active === i ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      ))}

      {/* Sophisticated gradient overlays - reduced opacity for better image visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
    </div>
  );
}

/* ================= CONTENT ================= */
function HeroContent({
  active,
  isLoaded,
}: {
  active: number;
  isLoaded: boolean;
}) {
  const data = HERO_DATA[active];

  return (
    <div className="relative z-10 h-full flex items-center">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Badge */}
          <div
            className={`transform transition-all duration-700 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-xl border border-orange-400/30 text-white rounded-full shadow-lg">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-300" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">
                {data.badge}
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <div
            className={`transform transition-all duration-700 delay-75 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <p className="text-orange-400 font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 tracking-wide uppercase">
              {data.subtitle}
            </p>
          </div>

          {/* Title */}
          <div
            className={`transform transition-all duration-700 delay-150 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] text-white mb-4 sm:mb-5 md:mb-6">
              {data.title.split(" ").slice(0, 2).join(" ")}{" "}
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
                {data.title.split(" ").slice(2).join(" ")}
              </span>
            </h1>
          </div>

          {/* Description */}
          <div
            className={`transform transition-all duration-700 delay-225 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <p className="text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mb-6 sm:mb-8">
              {data.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 transform transition-all duration-700 delay-300 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <Link
              href="/product"
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-sm sm:text-base hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>{data.cta}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/promo"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl border-2 border-white/60 text-white backdrop-blur-xl bg-white/5 hover:bg-white/10 hover:border-white/80 transition-all duration-300 font-semibold text-sm sm:text-base hover:scale-[1.02]"
            >
              Lihat Semua Promo
            </Link>
          </div>

          {/* Rating & Trust Indicators */}
          <div
            className={`flex flex-wrap items-center gap-4 sm:gap-6 transform transition-all duration-700 delay-375 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
          >
            <div className="flex items-center gap-2 backdrop-blur-xl bg-white/10 px-3 sm:px-4 py-2 rounded-full border border-white/20">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-white font-bold text-xs sm:text-sm">
                4.9
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
              <span className="text-xs sm:text-sm font-medium">
                <span className="font-bold text-white">12,500+</span> Pelanggan
                Puas
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= FEATURE BADGE ================= */
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
    <div className="group relative overflow-hidden flex items-center gap-3 sm:gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-4 sm:px-5 py-3 sm:py-4 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="relative">
        <div className="font-bold text-white text-xs sm:text-sm md:text-base leading-tight">
          {label}
        </div>
        <div className="text-white/60 text-[10px] sm:text-xs mt-0.5">
          {subtext}
        </div>
      </div>
    </div>
  );
}
