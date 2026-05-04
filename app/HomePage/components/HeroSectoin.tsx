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
    <section className="relative w-full overflow-hidden bg-neutral-900">
      {/* ── HERO IMAGE & CONTENT — full width ── */}
      <div className="relative">
        <div className="relative h-[380px] sm:h-[440px] w-full">
          <HeroBackground active={active} images={HERO_IMAGES} />

          {/* Nav Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center border border-white/25 text-white hover:bg-white hover:text-neutral-900 transition-all duration-300 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center border border-white/25 text-white hover:bg-white hover:text-neutral-900 transition-all duration-300 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <HeroContent active={active} />
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="max-w-[1600px] mx-auto">
        <div className="relative px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 border-t border-white/10">
          {/* Dots & Progress */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 py-5 sm:py-6">
            <div className="flex items-center gap-4">
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
                    className={`h-[1px] transition-all duration-500 ${
                      active === i
                        ? "w-10 sm:w-12 bg-white"
                        : "w-4 bg-white/30 hover:bg-white/60 hover:w-7"
                    }`}
                  />
                  <div
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 bg-neutral-900 border border-white/10 text-white/80 text-[9px] tracking-[0.2em] uppercase pointer-events-none transition-all duration-200 ${
                      active === i
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
                    }`}
                  >
                    {HERO_DATA[i].subtitle}
                  </div>
                </button>
              ))}
            </div>

            <div className="w-full sm:w-56 md:w-64 flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-white/50 text-[11px] font-light tracking-[0.2em] min-w-[3rem]">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(HERO_IMAGES.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border-t border-white/10 mb-8 sm:mb-10">
            <FeatureBadge
              icon={<Truck className="w-4 h-4" />}
              label="Gratis Ongkir"
              subtext="Min. Belanja 100k"
            />
            <FeatureBadge
              icon={<ShieldCheck className="w-4 h-4" />}
              label="Garansi Resmi"
              subtext="100% Original"
            />
            <FeatureBadge
              icon={<Award className="w-4 h-4" />}
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
    <div className="absolute inset-0 bg-neutral-900">
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            active === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      ))}
      {/* Gradient overlays removed for brighter banner */}
    </div>
  );
}

import { motion, Variants } from "framer-motion";

/* ── CONTENT ── */
function HeroContent({ active }: { active: number }) {
  const data = HERO_DATA[active];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="relative z-10 h-full flex items-center">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <motion.div
          key={active}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl lg:max-w-2xl"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-4 h-[1px] bg-white/50" />
              <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.25em] uppercase text-white/70">
                {data.badge}
              </span>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.div variants={itemVariants}>
            <p className="text-white/60 font-light text-[10px] sm:text-[11px] mb-2 tracking-[0.2em] uppercase">
              {data.subtitle}
            </p>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-tight text-white mb-2 sm:mb-3">
              {data.title.split(" ").slice(0, 2).join(" ")}
              <span className="block font-normal mt-0.5">
                {data.title.split(" ").slice(2).join(" ")}
              </span>
            </h1>
          </motion.div>

          {/* Thin rule */}
          <motion.div variants={itemVariants}>
            <div className="w-8 h-[1px] bg-white/30 mb-3 sm:mb-4" />
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed max-w-sm lg:max-w-md mb-4 sm:mb-5 font-light line-clamp-2 sm:line-clamp-none">
              {data.description}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-5"
          >
            <Link
              href="/product"
              className="group w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-neutral-900 font-medium text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-100 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {data.cta}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Trust */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 sm:gap-5"
          >
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-white font-medium text-[10px] sm:text-xs tracking-[0.1em] ml-1">
                4.9
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-white/65 text-[10px] sm:text-xs font-light tracking-[0.08em]">
                <span className="font-medium text-white">12,500+</span>{" "}
                Pelanggan Puas
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
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
    <div className="group flex items-center gap-3 px-5 sm:px-6 py-4 sm:py-5 hover:bg-white/5 transition-colors duration-300">
      <div className="flex-shrink-0 text-white/60 group-hover:text-white/90 transition-colors duration-300">
        {icon}
      </div>
      <div>
        <div className="font-medium text-white text-[11px] tracking-[0.18em] uppercase leading-tight">
          {label}
        </div>
        <div className="text-white/45 text-[10px] mt-0.5 tracking-[0.12em] font-light">
          {subtext}
        </div>
      </div>
    </div>
  );
}
