"use client";

import { Mail, Send, Shield, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      alert("Mohon masukkan email yang valid");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Terima kasih! Email ${email} telah terdaftar.`);
    setEmail("");
    setIsSubmitting(false);
  };

  const articles = [
    {
      title: "5 Kebiasaan yang Membuat Rice Cooker Cepat Rusak",
      date: "10 Des 2025",
      image:
        "https://asset-2.tstatic.net/shopping/foto/bank/images/ilustrasi-rice-cooker-mini-untuk-kemudahan-menanak-nasi-di-dapur-mungil.jpg",
      category: "Tips & Trik",
    },
    {
      title: "Fungsi Tersembunyi Rice Cooker di Rumah Anda",
      date: "8 Des 2025",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800",
      category: "Tutorial",
    },
    {
      title: "Kesalahan Umum Menggunakan Juicer",
      date: "5 Des 2025",
      image:
        "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=800",
      category: "Panduan",
    },
  ];

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-[1600px] mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl">
        {/* Decorative ambient lights */}
        <div className="absolute -top-32 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 sm:p-10 md:p-16 lg:p-20">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-xl border border-orange-400/30 rounded-full shadow-lg">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-orange-400">
                Ravella Insight
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight">
              Insight & Tips Dapur{" "}
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                dari Ravella
              </span>
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12">
              Dapatkan tips, tutorial, dan insight terbaru seputar peralatan
              dapur Ravella. Dari cara penggunaan hingga perawatan agar alat
              dapur lebih awet.
            </p>
          </div>

          {/* Articles Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {articles.map((item, i) => (
              <a
                key={i}
                href="/news"
                className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    {item.date}
                  </p>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-orange-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-5 h-5 text-orange-400" />
                </div>
              </a>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mb-10 sm:mb-14">
            <a
              href="/news"
              className="inline-flex items-center gap-2 text-orange-400 font-bold text-sm sm:text-base hover:text-orange-300 transition-colors group"
            >
              <span>Lihat Semua Artikel & Tips Dapur</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
