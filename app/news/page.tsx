"use client";

import {
  Award,
  Users,
  Globe,
  TrendingUp,
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
  Calendar,
  Eye,
} from "lucide-react";
import { useState } from "react";
import Header from "../HomePage/components/Header";
import Footer from "../HomePage/Footer";

export default function News() {
  const [activeTab, setActiveTab] = useState<"about" | "news">("about");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <Header />
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1920&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-white font-bold text-sm uppercase tracking-wide">
                Tentang Ravella
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Inovasi Dapur{" "}
              <span className="block mt-2 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Sejak 2018
              </span>
            </h1>
            <p className="text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Menyediakan peralatan dapur berkualitas premium dengan desain
              modern dan inovatif untuk memudahkan aktivitas memasak Anda
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
          <div className="flex gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-6 sm:px-8 py-4 font-bold text-sm sm:text-base transition-all relative ${
                activeTab === "about"
                  ? "text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Tentang Kami
              {activeTab === "about" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`px-6 sm:px-8 py-4 font-bold text-sm sm:text-base transition-all relative ${
                activeTab === "news"
                  ? "text-orange-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Artikel & Tips
              {activeTab === "news" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-full" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-12 sm:py-16 md:py-20">
        {activeTab === "about" ? <AboutContent /> : <NewsContent />}
      </div>
    </div>
  );
}

function AboutContent() {
  const stats = [
    { icon: Users, value: "10,000+", label: "Pelanggan Puas" },
    { icon: Award, value: "8+", label: "Tahun Pengalaman" },
    { icon: Globe, value: "50+", label: "Kota di Indonesia" },
    { icon: TrendingUp, value: "99%", label: "Kepuasan Pelanggan" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Kualitas Premium",
      description:
        "Kami berkomitmen menyediakan produk berkualitas tinggi dengan material terbaik dan teknologi terkini untuk memastikan kepuasan pelanggan.",
    },
    {
      icon: Shield,
      title: "Garansi Terpercaya",
      description:
        "Setiap produk dilengkapi garansi resmi dan layanan purna jual terbaik untuk memberikan ketenangan pikiran kepada pelanggan kami.",
    },
    {
      icon: Sparkles,
      title: "Inovasi Berkelanjutan",
      description:
        "Terus berinovasi menghadirkan produk-produk baru yang modern, fungsional, dan sesuai dengan kebutuhan dapur masa kini.",
    },
    {
      icon: Users,
      title: "Pelayanan Prima",
      description:
        "Tim customer service kami siap membantu Anda 24/7 untuk memberikan pengalaman berbelanja yang menyenangkan dan memuaskan.",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 md:space-y-24">
      {/* Company Story */}
      <section>
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Cerita{" "}
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Ravella
              </span>
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-base sm:text-lg">
                Sejak didirikan pada tahun 2018, Ravella telah menjadi brand
                terpercaya dalam menyediakan peralatan dapur berkualitas premium
                di Indonesia. Kami percaya bahwa setiap rumah layak memiliki
                peralatan dapur yang tidak hanya fungsional, tetapi juga estetis
                dan tahan lama.
              </p>
              <p className="text-base sm:text-lg">
                Dengan pengalaman lebih dari 8 tahun, kami terus berinovasi
                menghadirkan produk-produk terbaik yang telah dipercaya oleh
                ribuan keluarga Indonesia. Dari rice cooker, blender, hingga
                perlengkapan masak lainnya, setiap produk Ravella dirancang
                dengan standar kualitas internasional.
              </p>
              <p className="text-base sm:text-lg">
                Komitmen kami adalah memberikan nilai terbaik kepada pelanggan
                melalui produk berkualitas, harga kompetitif, dan layanan
                pelanggan yang responsif.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
                alt="Ravella Kitchen"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-3xl opacity-50 -z-10" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-12">
            Pencapaian Kami
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Nilai-Nilai{" "}
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Kami
            </span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Prinsip yang menjadi fondasi setiap keputusan dan tindakan kami
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function NewsContent() {
  const articles = [
    {
      id: 1,
      title: "5 Kebiasaan Sehari-hari yang Membuat Rice Cooker Cepat Rusak",
      excerpt:
        "Hindari kesalahan umum dalam penggunaan rice cooker yang dapat memperpendek umur perangkat Anda. Pelajari cara perawatan yang benar.",
      image:
        "https://images.unsplash.com/photo-1604908554168-5f88f2d7b3a5?w=800&q=80",
      category: "Tips & Trik",
      date: "15 Januari 2026",
      readTime: "5 min",
      views: "2.5k",
    },
    {
      id: 2,
      title: "Fungsi Tersembunyi Rice Cooker yang Jarang Disadari",
      excerpt:
        "Rice cooker Anda bisa lebih dari sekedar memasak nasi. Temukan berbagai fungsi tersembunyi yang akan mengubah cara Anda memasak.",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
      category: "Tutorial",
      date: "12 Januari 2026",
      readTime: "7 min",
      views: "3.2k",
    },
    {
      id: 3,
      title: "Cara Membersihkan Blender Agar Tetap Awet dan Higienis",
      excerpt:
        "Panduan lengkap membersihkan blender dengan benar untuk menjaga kebersihan dan memperpanjang umur perangkat.",
      image:
        "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
      category: "Panduan",
      date: "10 Januari 2026",
      readTime: "6 min",
      views: "1.8k",
    },
    {
      id: 4,
      title: "Kesalahan Umum Menggunakan Juicer yang Harus Dihindari",
      excerpt:
        "Maksimalkan hasil jus Anda dan hindari kerusakan pada juicer dengan menghindari kesalahan-kesalahan umum ini.",
      image:
        "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80",
      category: "Tips & Trik",
      date: "8 Januari 2026",
      readTime: "5 min",
      views: "2.1k",
    },
    {
      id: 5,
      title: "Tren Peralatan Dapur Modern di Tahun 2026",
      excerpt:
        "Simak tren terbaru dalam dunia peralatan dapur yang akan membuat aktivitas memasak Anda lebih efisien dan menyenangkan.",
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
      category: "Trend",
      date: "5 Januari 2026",
      readTime: "8 min",
      views: "4.5k",
    },
    {
      id: 6,
      title: "Resep Sehat dengan Peralatan Dapur Ravella",
      excerpt:
        "Kumpulan resep sehat dan praktis yang bisa Anda buat menggunakan peralatan dapur Ravella kesayangan Anda.",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      category: "Resep",
      date: "3 Januari 2026",
      readTime: "10 min",
      views: "5.3k",
    },
  ];

  const categories = [
    "Semua",
    "Tips & Trik",
    "Tutorial",
    "Panduan",
    "Trend",
    "Resep",
  ];
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredArticles =
    activeCategory === "Semua"
      ? articles
      : articles.filter((article) => article.category === activeCategory);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
              activeCategory === cat
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
          >
            {/* Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${article.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                  {article.category}
                </span>
              </div>

              {/* Stats */}
              <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white text-xs">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{article.views}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {article.readTime} baca
                </span>
                <button className="group/btn flex items-center gap-2 text-orange-600 font-semibold text-sm hover:gap-3 transition-all">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <Footer />
    </div>
  );
}
