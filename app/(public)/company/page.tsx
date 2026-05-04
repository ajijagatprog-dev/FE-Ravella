"use client";

import {
  Award,
  Users,
  Globe,
  TrendingUp,
  Shield,
  Sparkles,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Package,
  Palette,
  MessageCircle,
  Handshake,
} from "lucide-react";
import { useState } from "react";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";
import BestSellers from "../../HomePage/components/BestSellers";
import { useBanners } from "@/lib/useBanners";

export default function Company() {
  const [activeTimeline, setActiveTimeline] = useState(0);

  const [companyBanner] = useBanners("company", ["/Company/company.webp"]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ── */}
      <section className="relative h-[380px] sm:h-[440px] overflow-hidden bg-neutral-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${companyBanner})`,
          }}
        />

        <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-5 h-[1px] bg-white/50" />
              <span className="text-white/70 font-medium text-[11px] uppercase tracking-[0.25em]">
                About Us
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Ravelle <span className="font-normal text-white">Indonesia</span>
            </h1>

            <div className="w-10 h-[1px] bg-white/30 mb-5" />

            <p className="text-white/75 text-sm sm:text-base font-light leading-relaxed max-w-lg">
              Providing premium quality kitchen appliances with modern and
              innovative designs to make your cooking activities easier.
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
        {/* ── COMPANY STORY & EXCELLENCE ── */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="grid lg:grid-cols-2 gap-0 items-stretch max-w-[1400px] mx-auto">
            {/* Image */}
            <div className="relative w-full h-full min-h-[400px] lg:min-h-[800px]">
              <img
                src="/Company/company2.png"
                alt="Ravelle Company"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="bg-[#fcfcfc] border border-neutral-100 p-8 sm:p-12 md:p-16 lg:p-20 space-y-16">
              {/* Improve the Living Quality */}
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-neutral-900 leading-tight">
                  Improve the <br />
                  <span className="font-normal text-neutral-900">
                    Living Quality
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
                  Since its debut in{" "}
                  <span className="font-medium text-neutral-900">2020</span>,
                  RAVELLE has continued to improve the living quality of
                  Indonesian families especially during the pandemic time by
                  consistently carrying these values in all of its products:
                </p>

                <ul className="space-y-2.5">
                  {[
                    "Quality everyday life",
                    "Joyful experience",
                    "Inner strength and independency",
                    "Honesty and communicative",
                    "Clarity and transparency",
                  ].map((value, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-neutral-400 text-sm sm:text-base mt-1">
                        •
                      </span>
                      <span className="text-sm sm:text-base font-light text-neutral-600">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ravelle Product */}
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-900 leading-tight">
                  Ravelle Product
                </h2>

                <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
                  These values are consistently translated into all RAVELLE
                  products through:
                </p>

                <ul className="space-y-2.5">
                  {[
                    "Modern and innovative product designs.",
                    "Colourful, creative and unique shapes and sizes.",
                    "Excellent built quality for product durability.",
                    "Open and positive product communications to convey accurate information.",
                    "Responsive customer service combined with excellent product knowledge for better customer piece of mind.",
                    "Fostering good and ethical working relationship with our business partners and customers alike.",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-neutral-400 text-sm sm:text-base mt-1">
                        •
                      </span>
                      <span className="text-sm sm:text-base font-light text-neutral-600">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── CLOSING MESSAGE ── */}
          <div className="max-w-3xl mx-auto text-center mt-20 sm:mt-24 space-y-6">
            <p className="text-[10px] sm:text-xs text-neutral-900 font-medium leading-relaxed uppercase tracking-[0.15em] sm:tracking-[0.2em]">
              With your continuous support, Ravelle will enrich the lives of
              Indonesian families... creating quality living for many years to
              come.
            </p>
            <p
              className="text-sm sm:text-base text-neutral-600 font-light"
              style={{ fontStyle: "italic" }}
            >
              Thank you and happy cooking
            </p>
            <div className="pt-6">
              <a
                href="/product"
                className="inline-block px-10 py-3.5 bg-black text-white text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-neutral-800 transition-colors"
              >
                Product
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* ── BEST SELLERS ── */}
      <BestSellers />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
        {/* ── STATS ── */}
        <section className="py-16 sm:py-20 md:py-24">
          <div className="bg-neutral-900 p-8 sm:p-12 md:p-16 relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2.5 mb-4">
                  <div className="w-5 h-[1px] bg-white/30" />
                  <span className="text-white/50 font-medium text-[11px] uppercase tracking-[0.25em]">
                    Achievements
                  </span>
                  <div className="w-5 h-[1px] bg-white/30" />
                </div>
                <h2
                  className="text-4xl sm:text-5xl font-light text-white mb-3"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  Proud{" "}
                  <em
                    className="font-semibold not-italic"
                    style={{ fontStyle: "italic" }}
                  >
                    Achievements
                  </em>
                </h2>
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-[1px] bg-white/20" />
                </div>
                <p className="text-white/50 text-sm font-light max-w-xl mx-auto">
                  Numbers that prove our dedication to delivering the best
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
                {[
                  { icon: Users, value: "10,000+", label: "Happy Customers" },
                  { icon: Award, value: "6+", label: "Years Experience" },
                  { icon: Globe, value: "50+", label: "Cities in Indonesia" },
                  {
                    icon: TrendingUp,
                    value: "99%",
                    label: "Customer Satisfaction",
                  },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      className="text-center py-10 px-6 bg-neutral-900 hover:bg-neutral-800 transition-colors duration-300"
                    >
                      <Icon className="w-6 h-6 text-white/40 mx-auto mb-4" />
                      <div className="text-4xl sm:text-5xl font-light text-white mb-2">
                        {stat.value}
                      </div>
                      <div className="text-[11px] text-white/45 tracking-[0.18em] uppercase font-medium">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── VISION & MISSION ── */}
        <section className="py-16 sm:py-20 border-t border-neutral-100">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-5 h-[1px] bg-neutral-400" />
              <span className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.25em]">
                Direction
              </span>
              <div className="w-5 h-[1px] bg-neutral-400" />
            </div>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900"
              style={{ letterSpacing: "-0.01em" }}
            >
              Vision &amp;{" "}
              <em
                className="font-semibold not-italic"
                style={{ fontStyle: "italic" }}
              >
                Mission
              </em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Vision */}
            <div className="bg-neutral-900 p-8 sm:p-10 md:p-12 text-white">
              <div className="w-10 h-10 flex items-center justify-center border border-white/20 mb-6">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-[11px] tracking-[0.22em] uppercase text-white/40 font-medium mb-3">
                Vision
              </p>
              <h3 className="text-3xl sm:text-4xl font-light text-white mb-5">
                Leading with <em style={{ fontStyle: "italic" }}>Purpose</em>
              </h3>
              <div className="w-8 h-[1px] bg-white/20 mb-5" />
              <p className="text-white/65 text-sm sm:text-base font-light leading-relaxed">
                To become the leading kitchen appliance brand in Indonesia,
                known for innovation, premium quality, and high customer trust
                by 2030.
              </p>
            </div>

            {/* Mission */}
            <div className="border border-neutral-200 bg-white p-8 sm:p-10 md:p-12">
              <div className="w-10 h-10 flex items-center justify-center border border-neutral-200 mb-6">
                <Zap className="w-5 h-5 text-neutral-700" />
              </div>
              <p className="text-[11px] tracking-[0.22em] uppercase text-neutral-400 font-medium mb-3">
                Mission
              </p>
              <h3 className="text-3xl sm:text-4xl font-light text-neutral-900 mb-5">
                Built to <em style={{ fontStyle: "italic" }}>Serve</em>
              </h3>
              <div className="w-8 h-[1px] bg-neutral-200 mb-5" />
              <ul className="space-y-4">
                {[
                  "Deliver innovative high-quality products",
                  "Provide best-in-class customer service",
                  "Continuously innovate based on market needs",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-4 h-[1px] bg-neutral-400 flex-shrink-0 mt-[10px]" />
                    <span className="text-sm text-neutral-600 font-light leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="py-16 sm:py-20 border-t border-neutral-100">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-5 h-[1px] bg-neutral-400" />
              <span className="text-neutral-500 font-medium text-[11px] uppercase tracking-[0.25em]">
                Milestones
              </span>
              <div className="w-5 h-[1px] bg-neutral-400" />
            </div>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900"
              style={{ letterSpacing: "-0.01em" }}
            >
              Our{" "}
              <em
                className="font-semibold not-italic"
                style={{ fontStyle: "italic" }}
              >
                Journey
              </em>
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-[1px] bg-neutral-200" />

            <div className="space-y-10">
              {[
                {
                  year: "2020",
                  title: "RAVELLE Founded",
                  description:
                    "Started our journey with a vision to provide quality kitchen appliances for every Indonesian home.",
                  icon: Star,
                },
                {
                  year: "2021",
                  title: "Product Expansion",
                  description:
                    "Launched complete product lines including rice cookers, blenders, and juicers with modern technology.",
                  icon: TrendingUp,
                },
                {
                  year: "2023",
                  title: "10,000+ Customers",
                  description:
                    "Reached milestone of 10,000+ satisfied customers across Indonesia with 4.8/5 rating.",
                  icon: Users,
                },
                {
                  year: "2024",
                  title: "Quality Award",
                  description:
                    "Received 'Best Kitchen Appliance Brand' award from Indonesia Home & Living Awards.",
                  icon: Award,
                },
                {
                  year: "2026",
                  title: "Continuous Innovation",
                  description:
                    "Launching smart kitchen appliances with IoT technology for the kitchen of the future.",
                  icon: Zap,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`relative flex items-start gap-8 ${
                      i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                    onMouseEnter={() => setActiveTimeline(i)}
                  >
                    {/* Dot */}
                    <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-900 border-2 border-white ring-1 ring-neutral-300 z-10 mt-5" />

                    {/* Card */}
                    <div
                      className={`flex-1 ml-20 sm:ml-0 ${
                        i % 2 === 0 ? "sm:pr-12" : "sm:pl-12"
                      }`}
                    >
                      <div
                        className={`border p-6 sm:p-8 transition-all duration-300 ${
                          activeTimeline === i
                            ? "border-neutral-800 bg-neutral-900 text-white"
                            : "border-neutral-100 bg-white hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Icon
                            className={`w-4 h-4 ${activeTimeline === i ? "text-white/60" : "text-neutral-400"}`}
                          />
                          <span
                            className={`text-3xl sm:text-4xl font-light ${activeTimeline === i ? "text-white" : "text-neutral-900"}`}
                          >
                            {item.year}
                          </span>
                        </div>
                        <h3
                          className={`text-base sm:text-lg font-medium mb-2 tracking-wide ${activeTimeline === i ? "text-white" : "text-neutral-900"}`}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={`text-sm font-light leading-relaxed ${activeTimeline === i ? "text-white/60" : "text-neutral-500"}`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden sm:block flex-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
