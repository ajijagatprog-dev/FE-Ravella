import {
  ArrowRight,
  Home,
  Utensils,
  Package,
  Sofa,
  Laptop,
} from "lucide-react";

export default function CategoryGrid() {
  const categories = [
    {
      title: "Home & Kitchen Appliance",
      subtitle: "Peralatan Rumah & Dapur",
      icon: Home,
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
      count: "150+ Produk",
    },
    {
      title: "Knife Set",
      subtitle: "Pisau & Alat Potong",
      icon: Utensils,
      image:
        "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80",
      count: "80+ Produk",
    },
    {
      title: "Ezy Series",
      subtitle: "Koleksi Premium",
      icon: Package,
      image:
        "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80",
      count: "120+ Produk",
    },
    {
      title: "Home Living",
      subtitle: "Dekorasi & Furniture",
      icon: Sofa,
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
      count: "200+ Produk",
    },
    {
      title: "Kitchen Tools",
      subtitle: "Alat Masak Modern",
      icon: Laptop,
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      count: "95+ Produk",
    },
  ];

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full mb-4">
            <Package className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600 font-bold text-xs sm:text-sm uppercase tracking-wide">
              Kategori Produk
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-3 sm:mb-4">
            Shop by{" "}
            <span className="bg-gradient-to-r bg-black bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Temukan produk berkualitas dalam kategori yang telah kami kurasi
            khusus untuk Anda
          </p>
        </div>

        {/* Grid - Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7">
          {categories.map((cat, i) => (
            <CategoryCard key={i} category={cat} index={i} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r bg-gray-900 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105">
            <span className="text-sm sm:text-base">Lihat Semua Kategori</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category, index }: { category: any; index: number }) {
  const Icon = category.icon;

  return (
    <div
      className={`group relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer
        shadow-lg hover:shadow-2xl transition-all duration-700 ease-out
        hover:-translate-y-2 ${
          index === 1 ? "lg:mt-8" : index === 3 ? "lg:mt-4" : ""
        }`}
    >
      {/* Image Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out
        group-hover:scale-110"
        style={{ backgroundImage: `url(${category.image})` }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-pink-500/0 group-hover:from-orange-500/20 group-hover:to-pink-500/20 transition-all duration-700" />

      {/* Animated border glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-white/20"></div>
      </div>

      {/* Top Badge with Icon */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-xl rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-bold text-gray-900">
            {category.count}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8">
        {/* Subtitle */}
        <p className="text-orange-400 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 uppercase tracking-wide opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          {category.subtitle}
        </p>

        {/* Title */}
        <h3
          className="text-white text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4
          drop-shadow-2xl transition-all duration-700
          transform group-hover:-translate-y-2"
        >
          {category.title}
        </h3>

        {/* Button */}
        <button
          className="inline-flex items-center gap-2
          bg-white hover:bg-gray-50 text-gray-900
          px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold
          opacity-0 translate-y-6
          group-hover:opacity-100 group-hover:translate-y-0
          transition-all duration-700 ease-out
          shadow-xl hover:shadow-2xl hover:scale-105"
        >
          <span>Jelajahi</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </div>
  );
}
