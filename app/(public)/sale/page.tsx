"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Check,
  Flame,
  Tag,
  ArrowRight,
  Zap,
  Eye,
  Star,
  ShoppingBag,
  TrendingUp,
  Award,
  Shield,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../HomePage/components/Header";
import Footer from "../../HomePage/components/Footer";
import api from "@/lib/axios";
import { useBanners } from "@/lib/useBanners";

export default function SalePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ visible: boolean; productName: string }>(
    {
      visible: false,
      productName: "",
    },
  );

  const [saleBanner] = useBanners("sale", [
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80",
  ]);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(p);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products", {
          params: { on_sale: true, limit: 50 },
        });
        if (res.data.status === "success") {
          const allProducts = res.data.data.data || res.data.data;
          const saleProducts = allProducts
            .map((p: any) => {
              const activePromo = p.active_promotion;
              const finalPrice = p.promoted_price || p.price;
              const origPrice = p.price;
              const discPercent = activePromo
                ? activePromo.discount_type === "percent"
                  ? activePromo.discount_value
                  : Math.round(((origPrice - finalPrice) / origPrice) * 100)
                : p.discount || 0;

              // Skip if no actual discount (safety check)
              if (finalPrice >= origPrice && discPercent <= 0) return null;

              return {
                id: p.id,
                name: p.name,
                price: finalPrice,
                originalPrice: origPrice,
                discount: discPercent,
                active_promotion: activePromo,
                rating: p.rating ? parseFloat(p.rating) : 0,
                image:
                  p.image ||
                  "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
                badge: p.badge || "",
                category: p.category || "Exclusive",
                stock: p.stock,
              };
            })
            .filter((p: any) => p !== null);
          setProducts(saleProducts);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSaleProducts();
  }, []);

  const handleAddToCart = (product: any) => {
    const stored = localStorage.getItem("ravelle_cart");
    let cart: any[] = stored ? JSON.parse(stored) : [];
    const exists = cart.find((item: any) => item.id === product.id);
    if (exists) {
      cart = cart.map((item: any) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      cart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          badge: product.badge,
          discount: product.discount,
          category: product.category,
          quantity: 1,
          selected: true,
        },
      ];
    }
    localStorage.setItem("ravelle_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("ravelle_cart_updated"));
    setToast({ visible: true, productName: product.name });
    setTimeout(() => setToast({ visible: false, productName: "" }), 2500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-24 right-6 z-[100]"
          >
            <div className="flex items-center gap-3 bg-white border border-neutral-200 shadow-2xl px-6 py-4 min-w-[300px]">
              <div className="w-8 h-8 bg-neutral-900 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-neutral-900 text-[11px] uppercase tracking-wider">
                  Added to Cart
                </p>
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                  {toast.productName}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="relative h-[450px] sm:h-[550px] overflow-hidden bg-neutral-900">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${saleBanner})`,
          }}
        />

        <div className="relative z-10 h-full flex items-center px-6 md:px-16 lg:px-24 xl:px-40">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-6 h-[1px] bg-amber-500" />
              <span className="text-amber-500 font-bold text-[10px] sm:text-xs uppercase tracking-[0.4em]">
                Limited Time Offers
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-6xl md:text-7xl font-light text-white mb-6 leading-[1.1]"
            >
              Pesta Diskon <br />
              <span className="font-semibold italic text-amber-500">Harga</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-white/60 text-sm sm:text-lg font-light leading-relaxed max-w-lg mb-10"
            >
              Bawa pulang produk premium Ravella dengan harga yang lebih
              bersahabat. Kualitas terbaik, desain abadi, kini hadir khusus
              untuk Anda.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex items-center gap-8"
            >
              <div className="flex flex-col">
                <span className="text-white font-bold text-2xl">
                  {products.length}+
                </span>
                <span className="text-white/40 text-[10px] uppercase tracking-wider">
                  On Sale
                </span>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-2xl">Up to 70%</span>
                <span className="text-white/40 text-[10px] uppercase tracking-wider">
                  Discount
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MAIN ── */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-20 sm:py-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-neutral-100 pb-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                Penawaran Terbatas
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-light text-neutral-900">
              Kejutan Mewah,{" "}
              <span className="italic font-medium">Harga Ramah</span>
            </h2>
          </div>
          <p className="text-neutral-500 text-sm font-light max-w-sm leading-relaxed">
            Koleksi pilihan dengan potongan harga signifikan. Setiap produk
            telah melewati standar kualitas Ravella yang ketat.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-neutral-100 mb-6" />
                <div className="h-3 bg-neutral-100 mb-3 w-1/4" />
                <div className="h-6 bg-neutral-100 mb-4 w-3/4" />
                <div className="h-5 bg-neutral-100 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <ShoppingBag className="w-16 h-16 text-neutral-100 mx-auto mb-6 stroke-[1]" />
            <h3 className="text-3xl font-light text-neutral-900 mb-4">
              Belum Ada Promo Aktif
            </h3>
            <p className="text-neutral-500 text-sm font-light mb-10 max-w-xs mx-auto">
              Nantikan penawaran eksklusif kami selanjutnya. Ikuti terus koleksi
              terbaru kami.
            </p>
            <Link
              href="/product"
              className="inline-flex items-center gap-3 px-10 py-4 bg-neutral-900 text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-black transition-all"
            >
              Browse All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  staggerChildren: 0.1,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="group relative flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-neutral-50 overflow-hidden flex items-center justify-center p-8 group-hover:bg-neutral-100 transition-colors duration-500">
                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                  />

                  {/* Overlay for quick actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <span className="px-3 py-1.5 bg-neutral-900 text-white text-[9px] font-black tracking-[0.2em] uppercase shadow-xl">
                      -{product.discount}%
                    </span>
                    {product.active_promotion?.type === "flash_sale" && (
                      <span className="px-3 py-1.5 bg-amber-500 text-white text-[9px] font-black tracking-[0.2em] uppercase flex items-center gap-1.5 shadow-xl">
                        <Flame className="w-3 h-3 fill-white" /> Sale
                      </span>
                    )}
                  </div>

                  {/* Quick Look Button Floating */}
                  <div className="absolute top-4 right-4 translate-x-0 sm:translate-x-4 opacity-100 sm:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-10">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom Action - Add to Cart */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16, 1, 0.3, 1]">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-4 bg-neutral-900 text-white text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-3"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="pt-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                      {product.category}
                    </span>
                    {product.rating > 0 && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-neutral-200" />
                        <div className="flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
                          <span className="text-[10px] font-bold text-neutral-600">
                            {product.rating}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <Link href={`/product/${product.id}`} className="block mb-4">
                    <h3 className="text-xl sm:text-2xl font-medium text-neutral-900 line-clamp-2 hover:text-neutral-500 transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-auto flex flex-col gap-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-lg font-bold text-neutral-900">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-neutral-400 line-through font-light">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                    <span className="text-[9px] text-amber-600 font-bold uppercase tracking-widest">
                      Hemat {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </div>

                  {/* View Details Button (User Requested) */}
                  <div className="mt-6">
                    <Link
                      href={`/product/${product.id}`}
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-900 hover:text-neutral-500 transition-colors group/link"
                    >
                      View Details
                      <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="bg-neutral-50 py-16 border-y border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                icon: Shield,
                title: "Official Warranty",
                desc: "1 Year Full Warranty",
              },
              {
                icon: Award,
                title: "Premium Quality",
                desc: "Certified Raw Materials",
              },
              {
                icon: TrendingUp,
                title: "Best Price",
                desc: "Price Match Guarantee",
              },
              { icon: Zap, title: "Fast Shipping", desc: "Same Day Dispatch" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-5">
                <div className="w-12 h-12 bg-white flex items-center justify-center border border-neutral-100 shadow-sm flex-shrink-0">
                  <item.icon className="w-5 h-5 text-neutral-900" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-1 text-neutral-900">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-600 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
