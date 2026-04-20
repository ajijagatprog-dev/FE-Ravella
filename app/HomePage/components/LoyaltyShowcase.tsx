"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

/* ─── Tier interface (matches backend) ───────────────────────────────────── */
interface Tier {
  name: string;
  min: number;
  max: number | null;
  perks: string[];
}

/* ─── Per-tier visual palette ────────────────────────────────────────────── */
const TIER_PALETTE: Record<
  string,
  {
    gradient: string;
    border: string;
    iconBg: string;
    iconColor: string;
    accentColor: string;
    checkColor: string;
    labelBg: string;
    labelText: string;
    barFrom: string;
    barTo: string;
    tagline: string;
    glow: string;
  }
> = {
  Basic: {
    gradient: "from-slate-50 via-white to-slate-50",
    border: "border-slate-200",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    accentColor: "text-slate-600",
    checkColor: "text-slate-400",
    labelBg: "bg-slate-100",
    labelText: "text-slate-600",
    barFrom: "from-slate-300",
    barTo: "to-slate-400",
    tagline: "Entry Level",
    glow: "",
  },
  Gold: {
    gradient: "from-amber-50 via-yellow-50/80 to-orange-50/60",
    border: "border-amber-200/80",
    iconBg: "bg-gradient-to-br from-amber-100 to-yellow-100",
    iconColor: "text-amber-600",
    accentColor: "text-amber-700",
    checkColor: "text-amber-500",
    labelBg: "bg-amber-100",
    labelText: "text-amber-700",
    barFrom: "from-amber-400",
    barTo: "to-yellow-500",
    tagline: "Most Popular",
    glow: "shadow-amber-100/50",
  },
  Platinum: {
    gradient: "from-blue-50 via-indigo-50/80 to-violet-50/60",
    border: "border-blue-200/80",
    iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100",
    iconColor: "text-blue-600",
    accentColor: "text-blue-700",
    checkColor: "text-blue-500",
    labelBg: "bg-blue-100",
    labelText: "text-blue-700",
    barFrom: "from-blue-500",
    barTo: "to-indigo-500",
    tagline: "Premium",
    glow: "shadow-blue-100/50",
  },
};

/* ─── SVG Icons ──────────────────────────────────────────────────────────── */
function TierIcon({ name, className }: { name: string; className?: string }) {
  if (name === "Gold") {
    return (
      <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    );
  }
  if (name === "Platinum") {
    return (
      <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    );
  }
  // Basic — person/shield icon
  return (
    <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ─── Intersection Observer hook — uses callback ref for safe timing ──── */
function useInView(threshold = 0.1) {
  const [inView, setInView] = useState(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  // callback ref — works even if the DOM node appears later
  const ref = (el: HTMLDivElement | null) => {
    setNode(el);
  };

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold]);

  return { ref, inView };
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function LoyaltyShowcase() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { ref: sectionRef, inView } = useInView(0.08);

  useEffect(() => {
    api
      .get("/public/loyalty/tiers")
      .then((res) => {
        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          setTiers(res.data.data);
        }
      })
      .catch(() => {
        /* silently fail — section just won't render */
      })
      .finally(() => setLoaded(true));
  }, []);

  // Don't render anything if loyalty is disabled or no tiers
  if (loaded && tiers.length === 0) return null;

  // Show nothing while loading (no layout shift)
  if (!loaded) return null;

  return (
    <section
      ref={sectionRef}
      className="relative px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-20 sm:py-24 md:py-32 bg-neutral-50 overflow-hidden"
      style={{ fontFamily: JOST }}
      id="loyalty-program"
    >
      {/* ── Subtle background decoration ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-100/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-100/30 to-transparent blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* ── Header ── */}
        <div
          className={`text-center mb-14 sm:mb-16 md:mb-20 transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-6 h-[1px] bg-amber-400" />
            <span
              className="text-amber-600 font-medium text-[11px] uppercase tracking-[0.28em]"
              style={{ fontFamily: JOST }}
            >
              Member Exclusive
            </span>
            <div className="w-6 h-[1px] bg-amber-400" />
          </div>

          {/* Heading */}
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-neutral-900 mb-4"
            style={{ fontFamily: CORMORANT, letterSpacing: "-0.01em" }}
          >
            Loyalty{" "}
            <em className="font-semibold not-italic" style={{ fontStyle: "italic" }}>
              Rewards
            </em>
          </h2>

          {/* Thin rule */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
          </div>

          {/* Description */}
          <p
            className="text-neutral-500 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed tracking-wide"
            style={{ fontFamily: JOST }}
          >
            Nikmati benefit eksklusif sebagai member Ravelle. Semakin banyak Anda belanja,
            semakin besar keuntungan yang didapat — mulai dari gratis ongkir hingga akses VIP.
          </p>
        </div>

        {/* ── Tier Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-14 sm:mb-16">
          {tiers.map((tier, i) => (
            <TierCard key={`${tier.name}-${i}`} tier={tier} index={i} inView={inView} />
          ))}
        </div>

        {/* ── CTA ── */}
        <div
          className={`text-center transition-all duration-1000 delay-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/auth/register"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-neutral-900 text-white hover:bg-black transition-all duration-300 text-[11px] tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: JOST }}
          >
            <span>Daftar &amp; Mulai Kumpul Poin</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
          <p
            className="mt-4 text-xs text-neutral-400 font-light tracking-wide"
            style={{ fontFamily: JOST }}
          >
            Gratis pendaftaran • Otomatis terdaftar sebagai member Basic
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  TIER CARD                                                                */
/* ═══════════════════════════════════════════════════════════════════════════ */
function TierCard({ tier, index, inView }: { tier: Tier; index: number; inView: boolean }) {
  const p = TIER_PALETTE[tier.name] ?? TIER_PALETTE["Basic"];
  const isGold = tier.name === "Gold";
  const isPlatinum = tier.name === "Platinum";

  const formatCurrency = (n: number) =>
    `Rp ${Number(n).toLocaleString("id-ID")}`;

  return (
    <div
      className={`
        relative flex flex-col bg-gradient-to-br ${p.gradient}
        rounded-2xl ${p.border} border
        transition-all duration-700 ease-out
        hover:shadow-xl hover:-translate-y-2
        ${p.glow ? `shadow-lg ${p.glow}` : "shadow-sm"}
        ${isGold ? "lg:-translate-y-3 lg:hover:-translate-y-5" : ""}
        ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
      `}
      style={{
        transitionDelay: `${200 + index * 150}ms`,
      }}
    >
      {/* ── Popular badge (Gold only) ── */}
      {isGold && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-md shadow-amber-200/50"
            style={{ fontFamily: JOST }}
          >
            ★ Paling Populer
          </span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="px-6 sm:px-7 pt-7 sm:pt-8 pb-5">
        <div className="flex items-start gap-3.5">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${p.iconBg}`}
          >
            <TierIcon name={tier.name} className={p.iconColor} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3
                className="text-xl sm:text-2xl font-semibold text-neutral-900"
                style={{ fontFamily: CORMORANT }}
              >
                {tier.name}
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${p.labelBg} ${p.labelText}`}
                style={{ fontFamily: JOST }}
              >
                {p.tagline}
              </span>
            </div>
            <p
              className="text-xs text-neutral-500 mt-1 font-light tracking-wide"
              style={{ fontFamily: JOST }}
            >
              {tier.max
                ? `${formatCurrency(tier.min)} – ${formatCurrency(tier.max)}`
                : `${formatCurrency(tier.min)}+`}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 rounded-full bg-neutral-200/70 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${p.barFrom} ${p.barTo} transition-all duration-1000 ease-out`}
            style={{
              width: inView ? (index === 0 ? "33%" : index === 1 ? "66%" : "100%") : "0%",
              transitionDelay: `${500 + index * 200}ms`,
            }}
          />
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-6 sm:mx-7 h-[1px] bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      {/* ── Perks ── */}
      <div className="px-6 sm:px-7 py-5 flex-1">
        <p
          className="text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-4"
          style={{ fontFamily: JOST }}
        >
          Keuntungan Member
        </p>
        <ul className="space-y-2.5">
          {(tier.perks ?? []).map((perk, pi) => (
            <li
              key={perk}
              className={`flex items-start gap-3 text-sm text-neutral-700 font-light transition-all duration-500 ${
                inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              }`}
              style={{
                fontFamily: JOST,
                transitionDelay: `${600 + index * 150 + pi * 80}ms`,
              }}
            >
              <CheckIcon className={p.checkColor} />
              <span>{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Footer — Aspirational CTA ── */}
      <div className="px-6 sm:px-7 pb-6 sm:pb-7">
        {isPlatinum ? (
          <div
            className="w-full py-3 text-center text-[10px] font-medium tracking-[0.18em] uppercase rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200/50"
            style={{ fontFamily: JOST }}
          >
            Tier Tertinggi
          </div>
        ) : isGold ? (
          <div
            className="w-full py-3 text-center text-[10px] font-medium tracking-[0.18em] uppercase rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-md shadow-amber-200/40"
            style={{ fontFamily: JOST }}
          >
            Upgrade dari Basic
          </div>
        ) : (
          <div
            className="w-full py-3 text-center text-[10px] font-medium tracking-[0.18em] uppercase rounded-xl border border-neutral-200 text-neutral-500"
            style={{ fontFamily: JOST }}
          >
            Mulai dari sini
          </div>
        )}
      </div>
    </div>
  );
}
