"use client";

import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      alert("Mohon masukkan email yang valid");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Terima kasih! Email ${email} telah terdaftar.`);
    setEmail("");
    setIsSubmitting(false);
  };

  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get("/news?limit=3&status=published");
        if (res.data.status === "success") {
          const mapped = res.data.data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            image:
              item.image ||
              "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
            category: item.category,
            date: item.published_at
              ? new Date(item.published_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-",
          }));
          setArticles(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch news", error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-10 sm:py-16 md:py-24 bg-white">
      <div className="max-w-[1600px] mx-auto bg-[#352309] overflow-hidden">
        <div className="relative p-4 sm:p-8 md:p-16 lg:p-20">
          {/* ── Header ── */}
          <div className="text-center mb-8 sm:mb-12">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-5 h-[1px] bg-white/30" />
              <span className="text-white/50 font-medium text-[11px] uppercase tracking-[0.25em]">
                Ravelle Insight
              </span>
              <div className="w-5 h-[1px] bg-white/30" />
            </div>

            {/* Title — Cormorant Garamond */}
            <h2
              className="text-2xl sm:text-4xl md:text-5xl font-light text-white mb-3 sm:mb-6 leading-[1.05]"
              style={{ letterSpacing: "-0.01em" }}
            >
              Insight &amp;{" "}
              <em
                className="font-semibold not-italic"
                style={{ fontStyle: "italic" }}
              >
                Tips Dapur
              </em>
            </h2>

            {/* Thin rule */}
            <div className="flex justify-center mb-5">
              <div className="w-10 h-[1px] bg-white/20" />
            </div>

            {/* Description */}
            <p className="text-white/60 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
              Dapatkan tips, tutorial, dan insight terbaru seputar peralatan
              dapur Ravelle. Dari cara penggunaan hingga perawatan agar alat
              dapur lebih awet.
            </p>
          </div>

          {/* ── Articles Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-8 sm:mb-12">
            {articles.map((item, i) => (
              <a
                key={i}
                href={`/news/${item.id}`}
                className="group relative overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-28 sm:h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Category badge — rectangular, Jost */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white text-neutral-900 text-[10px] font-medium tracking-[0.15em] uppercase">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-5">
                  <p className="text-[8px] sm:text-[10px] text-white/40 mb-1.5 sm:mb-2 tracking-[0.15em] uppercase font-medium">
                    {item.date}
                  </p>
                  <h3
                    className="text-xs sm:text-lg font-light text-white leading-snug group-hover:text-white/70 transition-colors line-clamp-2"
                    style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-4 h-4 text-white/60" />
                </div>

                {/* Bottom slide-in line */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </a>
            ))}
          </div>

          {/* ── View All ── */}
          <div className="text-center">
            <a
              href="/news"
              className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-2.5 sm:py-3.5 border border-white/30 text-white hover:bg-white hover:text-neutral-900 transition-all duration-300 text-[9px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase font-medium"
            >
              Lihat Semua Artikel &amp; Tips Dapur
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
