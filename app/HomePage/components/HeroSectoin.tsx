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

const HERO_IMAGES = [
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

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

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
    <section
      className="relative w-full overflow-hidden bg-neutral-900"
      style={{ fontFamily: JOST }}
    >
      <div className="relative max-w-[1600px] mx-auto">

        {/* ── HERO IMAGE & CONTENT ── */}
        <div className="relative h-[480px] sm:h-[540px] md:h-[600px] lg:h-[680px] xl:h-[720px] w-full">
          <HeroBackground active={active} />

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

          <HeroContent active={active} isLoaded={isLoaded} />
        </div>

        {/* ── CONTROLS ── */}
        <div className="relative px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 border-t border-white/10">

          {/* Dots & Progress */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 py-5 sm:py-6">
            <div className="flex items-center gap-4">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActive(i); setProgress(0); }}
                  className="relative group"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <div
                    className={`h-[1px] transition-all duration-500 ${active === i
                        ? "w-10 sm:w-12 bg-white"
                        : "w-4 bg-white/30 hover:bg-white/60 hover:w-7"
                      }`}
                  />
                  <div
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 bg-neutral-900 border border-white/10 text-white/80 text-[9px] tracking-[0.2em] uppercase pointer-events-none transition-all duration-200 ${active === i
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
                      }`}
                    style={{ fontFamily: JOST }}
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
              <span
                className="text-white/50 text-[11px] font-light tracking-[0.2em] min-w-[3rem]"
                style={{ fontFamily: JOST }}
              >
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(HERO_IMAGES.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border-t border-white/10 mb-8 sm:mb-10">
            <FeatureBadge icon={<Truck className="w-4 h-4" />} label="Gratis Ongkir" subtext="Min. Belanja 100k" />
            <FeatureBadge icon={<ShieldCheck className="w-4 h-4" />} label="Garansi Resmi" subtext="100% Original" />
            <FeatureBadge icon={<Award className="w-4 h-4" />} label="Kualitas Premium" subtext="Trusted Quality" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── BACKGROUND ── */
function HeroBackground({ active }: { active: number }) {
  return (
    <div className="absolute inset-0 bg-neutral-900">
      {HERO_IMAGES.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${active === i ? "opacity-100" : "opacity-0"
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
      {/* Left-to-right gradient — text sits on the darker left side */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />
    </div>
  );
}

/* ── CONTENT ── */
function HeroContent({ active, isLoaded }: { active: number; isLoaded: boolean }) {
  const data = HERO_DATA[active];
  const anim = (delay: string) =>
    `transform transition-all duration-700 ${delay} ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
    }`;

  return (
    <div className="relative z-10 h-full flex items-center">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="max-w-xl lg:max-w-2xl">

          {/* Badge */}
          <div className={anim("delay-0")}>
            <div className="inline-flex items-center gap-2.5 mb-4 sm:mb-5">
              <div className="w-5 h-[1px] bg-white/50" />
              <span
                className="text-[10px] sm:text-[11px] font-medium tracking-[0.28em] uppercase text-white/70"
                style={{ fontFamily: JOST }}
              >
                {data.badge}
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <div className={anim("delay-75")}>
            <p
              className="text-white/60 font-light text-[11px] sm:text-xs mb-3 tracking-[0.22em] uppercase"
              style={{ fontFamily: JOST }}
            >
              {data.subtitle}
            </p>
          </div>

          {/* Title — Cormorant Garamond, brand-matched serif */}
          <div className={anim("delay-150")}>
            <h1
              className="text-[42px] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[78px] font-light leading-[1.05] text-white mb-4 sm:mb-5"
              style={{ fontFamily: CORMORANT, letterSpacing: "-0.01em" }}
            >
              {data.title.split(" ").slice(0, 2).join(" ")}
              <em
                className="block not-italic font-semibold mt-0.5"
                style={{ fontFamily: CORMORANT, fontStyle: "italic" }}
              >
                {data.title.split(" ").slice(2).join(" ")}
              </em>
            </h1>
          </div>

          {/* Thin rule */}
          <div className={anim("delay-[200ms]")}>
            <div className="w-10 h-[1px] bg-white/30 mb-4 sm:mb-5" />
          </div>

          {/* Description */}
          <div className={anim("delay-[225ms]")}>
            <p
              className="text-white/75 text-sm sm:text-base leading-relaxed max-w-md mb-7 sm:mb-8 font-light"
              style={{ fontFamily: JOST }}
            >
              {data.description}
            </p>
          </div>

          {/* CTA */}
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 mb-7 ${anim("delay-300")}`}>
            <Link
              href="/product"
              className="group w-full sm:w-auto px-8 py-3.5 bg-white text-neutral-900 font-medium text-[11px] tracking-[0.22em] uppercase hover:bg-neutral-100 transition-all duration-300 flex items-center justify-center gap-3"
              style={{ fontFamily: JOST }}
            >
              {data.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/promo"
              className="w-full sm:w-auto px-8 py-3.5 border border-white/40 text-white hover:bg-white/10 hover:border-white/70 transition-all duration-300 font-light text-[11px] tracking-[0.22em] uppercase text-center"
              style={{ fontFamily: JOST }}
            >
              Lihat Semua Promo
            </Link>
          </div>

          {/* Trust */}
          <div className={`flex flex-wrap items-center gap-5 sm:gap-6 ${anim("delay-[375ms]")}`}>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span
                className="text-white font-medium text-xs tracking-[0.1em] ml-1"
                style={{ fontFamily: JOST }}
              >
                4.9
              </span>
            </div>
            <div
              className="flex items-center gap-2"
              style={{ fontFamily: JOST }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-white/65 text-xs font-light tracking-[0.08em]">
                <span className="font-medium text-white">12,500+</span> Pelanggan Puas
              </span>
            </div>
          </div>

        </div>
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
    <div
      className="group flex items-center gap-3 px-5 sm:px-6 py-4 sm:py-5 hover:bg-white/5 transition-colors duration-300"
      style={{ fontFamily: JOST }}
    >
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