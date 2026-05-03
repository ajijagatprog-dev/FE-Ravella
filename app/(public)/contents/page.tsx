"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  ChevronDown,
  Video,
  FileText,
  Gift,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import VideoFeedItem from "./components/VideoFeedItem";

export default function ContentsPage() {
  const [activeTab, setActiveTab] = useState<"video" | "article" | "affiliate">(
    "video",
  );
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        // Fetch all products to find those with videos
        const res = await api.get("/products", { params: { limit: 100 } });
        if (res.data.status === "success") {
          const fetchedData = res.data.data.data;

          const videoProducts: any[] = [];

          fetchedData.forEach((item: any) => {
            // Check main video_url
            if (item.video_url) {
              videoProducts.push({
                id: item.id,
                name: item.name,
                description: item.description || "",
                price: item.promoted_price || item.price,
                videoUrl: item.video_url,
                image: item.image,
              });
            }

            // Check media array for videos
            if (item.media && Array.isArray(item.media)) {
              item.media.forEach((m: any) => {
                if (m.type === "video" && m.url !== item.video_url) {
                  videoProducts.push({
                    id: item.id,
                    name: item.name,
                    description: item.description || "",
                    price: item.promoted_price || item.price,
                    videoUrl: m.url,
                    image: item.image,
                  });
                }
              });
            }
          });

          setProducts(videoProducts);
        }
      } catch (err) {
        console.error("Failed to fetch testimonial videos", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (activeTab !== "video") return;

    const observerOptions = {
      root: containerRef.current,
      threshold: 0.5,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(
            entry.target.getAttribute("data-index") || "0",
          );
          setActiveIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const timeoutId = setTimeout(() => {
      if (containerRef.current) {
        const items = containerRef.current.querySelectorAll(".snap-start");
        items.forEach((item) => observer.observe(item));
      }
    }, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [products, activeTab]);

  return (
    <div
      className={`relative min-h-screen w-full transition-colors duration-500 ${
        activeTab === "video"
          ? "bg-black overflow-hidden h-screen"
          : "bg-white overflow-auto"
      }`}
    >
      {/* Header Overlay / Navbar */}
      <div
        className={`z-50 w-full transition-all duration-300 ${
          activeTab === "video"
            ? "absolute top-0 left-0 right-0 p-6 pointer-events-none"
            : "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-neutral-100 p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] pointer-events-auto"
        }`}
      >
        <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <Link
              href="/"
              className={`pointer-events-auto p-2 rounded-full transition-all ${
                activeTab === "video"
                  ? "bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black"
                  : "bg-neutral-100 text-neutral-600 hover:bg-black hover:text-white"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-col items-center md:items-start">
              <span
                className={`font-black text-[10px] tracking-[0.4em] uppercase ${
                  activeTab === "video" ? "text-white" : "text-black"
                }`}
              >
                Ravelle Connect
              </span>
              <div
                className={`w-8 h-[1px] mt-1 ${
                  activeTab === "video" ? "bg-white/40" : "bg-black/20"
                }`}
              />
            </div>
            <div className="w-9 md:hidden" />{" "}
            {/* Spacer for mobile centering */}
          </div>

          {/* Tabs Nav */}
          <div
            className={`flex items-center gap-1 p-1 rounded-full pointer-events-auto overflow-x-auto w-full md:w-auto no-scrollbar ${
              activeTab === "video"
                ? "bg-black/20 backdrop-blur-md border border-white/10"
                : "bg-neutral-100 border border-neutral-200/50"
            }`}
          >
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === "video"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
            <button
              onClick={() => setActiveTab("article")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === "article"
                  ? "bg-black text-white shadow-sm"
                  : activeTab === "video"
                    ? "text-white/70 hover:text-white"
                    : "text-neutral-500 hover:text-black"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Artikel Collab</span>
            </button>
            <button
              onClick={() => setActiveTab("affiliate")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === "affiliate"
                  ? "bg-black text-white shadow-sm"
                  : activeTab === "video"
                    ? "text-white/70 hover:text-white"
                    : "text-neutral-500 hover:text-black"
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Affiliate</span>
            </button>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          TAB 1: VIDEO FEED (FITUR LAMA)
      ──────────────────────────────────────────────────────── */}
      {activeTab === "video" && (
        <div className="absolute inset-0 z-0">
          {isLoading ? (
            <div className="h-full w-full bg-black flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
              <p className="text-white/60 text-sm font-light tracking-[0.2em] uppercase">
                Loading Experience...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="h-full w-full bg-black flex flex-col items-center justify-center p-6 text-center">
              <Sparkles className="w-16 h-16 text-white/20 mb-6" />
              <h2 className="text-3xl text-white font-medium mb-4">
                No Videos Yet
              </h2>
              <p className="text-white/60 max-w-xs mb-8 font-light">
                Our video gallery is currently being curated. Check back soon
                for more product inspirations!
              </p>
            </div>
          ) : (
            <>
              {/* Video Feed Container */}
              <div
                ref={containerRef}
                className="h-full w-full overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-smooth"
              >
                {products.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    data-index={index}
                    className="h-full w-full snap-start"
                  >
                    <VideoFeedItem
                      product={product}
                      isActive={activeIndex === index}
                    />
                  </div>
                ))}
              </div>

              {/* Scroll Down Indicator */}
              <AnimatePresence>
                {activeIndex === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
                  >
                    <span className="text-white/40 text-[8px] uppercase tracking-[0.3em] font-bold">
                      Swipe Up
                    </span>
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-white/40" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 2: ARTIKEL & COLLAB
      ──────────────────────────────────────────────────────── */}
      {activeTab === "article" && (
        <div className="max-w-[1320px] mx-auto px-6 md:px-12 pt-[140px] pb-16 animate-fade-in">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4">
              Artikel & Collab
            </h1>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Temukan inspirasi, tips memasak, dan kisah kolaborasi eksklusif
              Ravelle bersama para kreator terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                category: "Tips & Trick",
                date: "24 Okt 2026",
                title: "5 Cara Mudah Merawat Pisau Dapur Agar Tetap Tajam",
                desc: "Pisau yang tajam adalah kunci kenyamanan memasak. Simak tips eksklusif dari Chef Arnold cara merawat koleksi pisau Ravelle Anda.",
              },
              {
                category: "Collab",
                date: "12 Okt 2026",
                title: "Ravelle x Tasyi Athasyia: Koleksi Ezy Series Terbaru",
                desc: "Intip keseruan launching koleksi terbaru dari Ravelle hasil kolaborasi dengan food vlogger ternama Tasyi Athasyia.",
              },
              {
                category: "Recipe",
                date: "05 Okt 2026",
                title:
                  "Resep Pasta Creamy Mushroom Menggunakan Wok Pan Ravelle",
                desc: "Sajikan hidangan ala restoran di rumah dengan resep rahasia yang dijamin anti gagal dan mudah dibuat.",
              },
              {
                category: "Home Living",
                date: "28 Sep 2026",
                title: "Menata Dapur Estetik Minimalis ala Rumah Modern",
                desc: "Bingung menata alat masak? Berikut adalah inspirasi desain dapur bersih dan elegan menggunakan produk Ravelle.",
              },
              {
                category: "Collab",
                date: "15 Sep 2026",
                title:
                  "Grand Launching Ravelle Flagship Store Bersama Nagita Slavina",
                desc: "Momen bersejarah pembukaan gerai resmi pertama Ravelle yang dihadiri banyak artis papan atas ibu kota.",
              },
              {
                category: "Promo",
                date: "01 Sep 2026",
                title:
                  "Keuntungan Menggunakan Air Fryer Ravelle untuk Kesehatan",
                desc: "Beralih ke gaya hidup sehat tanpa minyak. Kenali bagaimana Air Fryer Ravelle membantu menjaga nutrisi keluarga Anda.",
              },
            ].map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-neutral-100 relative">
                  <img
                    src={`https://picsum.photos/seed/ravelle${idx + 1}/600/450`}
                    alt="Article Thumbnail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold tracking-widest uppercase rounded-sm">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3 text-[11px] font-semibold tracking-wider uppercase">
                  <span className="text-neutral-400">{item.date}</span>
                </div>
                <h3 className="text-[19px] font-bold text-black group-hover:text-[#B79F5D] transition-colors mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 3: AFFILIATE PROGRAM
      ──────────────────────────────────────────────────────── */}
      {activeTab === "affiliate" && (
        <div className="max-w-[900px] mx-auto px-6 md:px-12 pt-[140px] pb-16 animate-fade-in">
          {/* Hero Affiliate */}
          <div className="bg-gradient-to-br from-neutral-900 to-black rounded-[2rem] p-8 md:p-16 text-center text-white mb-16 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1200&q=80')] opacity-20 object-cover mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#B79F5D] text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-full mb-6">
                <Sparkles className="w-3 h-3" />
                Program Afiliasi Resmi
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Ubah Pengaruh Anda <br /> Menjadi{" "}
                <span className="text-[#B79F5D]">Penghasilan</span>
              </h1>
              <p className="text-neutral-300 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed font-light">
                Dapatkan penghasilan tak terbatas setiap bulannya hanya dengan
                membagikan link produk eksklusif Ravelle ke media sosial Anda.
              </p>
              <button className="px-8 py-4 bg-white text-black font-bold uppercase tracking-[0.15em] text-xs rounded hover:bg-[#B79F5D] hover:text-white transition-all duration-300 shadow-[0_8px_30px_rgba(183,159,93,0.3)]">
                Daftar Sekarang
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
                Keuntungan Bergabung
              </h2>
              <p className="text-neutral-500 text-sm">
                Mengapa Anda harus menjadi bagian dari Ravelle Affiliate?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Komisi Menarik",
                  desc: "Dapatkan komisi hingga 15% untuk setiap penjualan yang berhasil dari link unik Anda.",
                },
                {
                  title: "Produk Eksklusif",
                  desc: "Akses lebih awal untuk mencoba produk-produk home living terbaru dari Ravelle secara gratis.",
                },
                {
                  title: "Dukungan Penuh",
                  desc: "Dapatkan materi promosi lengkap mulai dari foto HQ, video, hingga panduan copywriting.",
                },
              ].map((b, i) => (
                <div
                  key={i}
                  className="p-8 bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_-8px_rgba(183,159,93,0.15)] transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-6 h-6 text-rose-500" />
                  </div>
                  <h3 className="text-[17px] font-bold text-black mb-3">
                    {b.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-neutral-50 p-8 md:p-10 rounded-3xl border border-neutral-100">
            <div className="flex items-center gap-3 mb-8 border-b border-neutral-200 pb-6">
              <FileText className="w-6 h-6 text-[#B79F5D]" />
              <h2 className="text-xl font-bold text-black">
                Syarat & Ketentuan
              </h2>
            </div>

            <ul className="space-y-5 text-neutral-600 text-sm">
              <li className="flex items-start gap-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-900 flex-shrink-0 mt-0.5">
                  1
                </span>
                <p className="leading-relaxed pt-1">
                  Memiliki akun media sosial yang aktif digunakan (Instagram,
                  TikTok, atau YouTube) dengan jumlah followers organik minimal
                  1.000 pengikut.
                </p>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-900 flex-shrink-0 mt-0.5">
                  2
                </span>
                <p className="leading-relaxed pt-1">
                  Seluruh konten promosi yang dibagikan tidak boleh mengandung
                  unsur SARA, pornografi, ujaran kebencian, atau menyinggung
                  pihak lain.
                </p>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-900 flex-shrink-0 mt-0.5">
                  3
                </span>
                <p className="leading-relaxed pt-1">
                  Pencairan komisi akan diproses dan dibayarkan setiap tanggal
                  10 pada bulan berikutnya setelah status pesanan pelanggan
                  dinyatakan selesai.
                </p>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-900 flex-shrink-0 mt-0.5">
                  4
                </span>
                <p className="leading-relaxed pt-1">
                  Pihak Ravelle berhak penuh untuk membatalkan status affiliate
                  maupun komisi jika ditemukan adanya kecurangan atau
                  pelanggaran terhadap Syarat & Ketentuan.
                </p>
              </li>
            </ul>
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
