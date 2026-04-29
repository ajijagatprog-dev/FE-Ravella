"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  PlayCircle,
  Loader2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import VideoFeedItem from "./components/VideoFeedItem";

export default function ContentsPage() {
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

    // We need to wait for products to be rendered
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
  }, [products]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
        <p className="text-white/60 text-sm font-light tracking-[0.2em] uppercase">
          Loading Experience...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="w-16 h-16 text-white/20 mb-6" />
        <h2 className="text-3xl text-white font-medium mb-4">No Videos Yet</h2>
        <p className="text-white/60 max-w-xs mb-8 font-light">
          Our video gallery is currently being curated. Check back soon for more
          product inspirations!
        </p>
        <Link
          href="/product"
          className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-white font-black text-[10px] tracking-[0.4em] uppercase">
            Konten Produk
          </span>
          <div className="w-8 h-[1px] bg-white/40 mt-1" />
        </div>
        <div className="w-9" /> {/* Spacer */}
      </div>

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
            <VideoFeedItem product={product} isActive={activeIndex === index} />
          </div>
        ))}
      </div>

      {/* Scroll Down Indicator (Only for first item) */}
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

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
