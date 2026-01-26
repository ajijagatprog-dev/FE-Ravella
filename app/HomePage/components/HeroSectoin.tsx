"use client";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1920",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1920",
  "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=1920",
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [loaded] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const slide = setInterval(() => {
      setActive((p) => (p + 1) % HERO_IMAGES.length);
      setProgress(0);
    }, 6000);

    const bar = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 1.7));
    }, 100);

    return () => {
      clearInterval(slide);
      clearInterval(bar);
    };
  }, [active]);

  return (
    <section className="relative bg-white px-4 md:px-10 lg:px-40 py-12 overflow-hidden">
      {/* ambient light */}
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-primary/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-orange-400/20 blur-[120px]" />

      <div className="max-w-[1280px] mx-auto relative">
        <div className="relative overflow-hidden rounded-[36px] min-h-[650px] flex items-center shadow-2xl">
          <HeroBackground active={active} />
          <HeroContent loaded={loaded} />
        </div>

        {/* indicator + progress */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-3">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActive(i);
                  setProgress(0);
                }}
                className={`h-2 rounded-full transition-all ${
                  active === i
                    ? "w-10 bg-primary"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <div className="hidden md:block w-44 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBackground({ active }: { active: number }) {
  return (
    <div className="absolute inset-0">
      {HERO_IMAGES.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-[1400ms] ease-out ${
            active === i ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
    </div>
  );
}

function HeroContent({ loaded }: { loaded: boolean }) {
  return (
    <div className="relative z-10 px-8 md:px-16 max-w-2xl text-white">
      {/* BRAND BADGE */}
      <span
        className={`inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full text-xs font-bold tracking-widest
        bg-white/10 backdrop-blur border border-white/20
        transition-all duration-700 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Sparkles className="w-4 h-4 text-primary" />
        RAVELLA • KITCHEN ESSENTIALS
      </span>

      {/* HEADLINE */}
      <h1
        className={`text-4xl md:text-7xl font-black leading-tight mb-6
        transition-all duration-700 delay-100 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Ravella <br />
        <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
          Elevate Your Kitchen
        </span>
      </h1>

      {/* DESCRIPTION */}
      <p
        className={`text-gray-100 text-base md:text-lg mb-10 max-w-xl leading-relaxed
        transition-all duration-700 delay-200 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Ravella menghadirkan peralatan dapur modern dengan desain elegan dan
        performa tinggi. Dibuat untuk dapur masa kini yang mengutamakan fungsi
        dan estetika.
      </p>

      {/* CTA */}
      <div
        className={`flex flex-wrap gap-4 transition-all duration-700 delay-300 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button className="px-8 py-4 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 hover:scale-[1.04] hover:shadow-xl transition">
          Jelajahi Produk
          <ArrowRight className="w-5 h-5" />
        </button>

        <button className="px-8 py-4 rounded-xl border border-white/70 bg-white/10 backdrop-blur hover:bg-white/20 transition font-medium">
          Tentang Ravella
        </button>
      </div>

      {/* TRUST BADGES */}
      <div
        className={`mt-12 flex flex-wrap gap-6 transition-all duration-700 delay-500 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Badge icon={<Truck className="w-4 h-4" />} label="Gratis Ongkir" />
        <Badge
          icon={<ShieldCheck className="w-4 h-4" />}
          label="Garansi Resmi"
        />
        <Badge
          icon={<Sparkles className="w-4 h-4" />}
          label="Premium Quality"
        />
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium">
      {icon}
      {label}
    </div>
  );
}
