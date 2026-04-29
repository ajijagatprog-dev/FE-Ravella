"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface VideoFeedItemProps {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    videoUrl: string;
    image: string;
  };
  isActive: boolean;
}

const JOST = "'Jost', system-ui, sans-serif";
const CORMORANT = "'Cormorant Garamond', Georgia, serif";

export default function VideoFeedItem({
  product,
  isActive,
}: VideoFeedItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {
        // Autoplay might be blocked if not muted
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // Check if it's a YouTube URL
  const isYouTube =
    product.videoUrl.includes("youtube.com") ||
    product.videoUrl.includes("youtu.be");
  let embedUrl = product.videoUrl;
  if (isYouTube) {
    const ytMatch = product.videoUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
    );
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=${isActive ? 1 : 0}&mute=1&controls=0&loop=1&playlist=${ytMatch[1]}`;
    }
  }

  return (
    <div className="relative w-full h-screen bg-black snap-start overflow-hidden flex items-center justify-center">
      {/* Video Content */}
      <div className="absolute inset-0 w-full h-full" onClick={togglePlay}>
        {isYouTube ? (
          <iframe
            src={embedUrl}
            className="w-full h-full pointer-events-none"
            allow="autoplay; encrypted-media"
            style={{ border: 0 }}
          />
        ) : (
          <video
            ref={videoRef}
            src={product.videoUrl}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
          />
        )}

        {/* Play/Pause Overlay Indicator */}
        <AnimatePresence>
          {!isPlaying && !isYouTube && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <Play className="w-10 h-10 text-white fill-white ml-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Interaction Sidebar */}
      <div className="absolute right-2 sm:right-4 bottom-24 sm:bottom-32 flex flex-col items-center gap-4 sm:gap-6 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${isLiked ? "bg-red-500" : "bg-white/10 hover:bg-white/20"} backdrop-blur-md`}
          >
            <Heart
              className={`w-5 h-5 sm:w-6 sm:h-6 ${isLiked ? "fill-white text-white" : "text-white"}`}
            />
          </div>
          <span
            className="text-[10px] text-white font-medium"
            style={{ fontFamily: JOST }}
          >
            1.2k
          </span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all">
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span
            className="text-[10px] text-white font-medium"
            style={{ fontFamily: JOST }}
          >
            Share
          </span>
        </button>

        {!isYouTube && (
          <button
            onClick={toggleMute}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            )}
          </button>
        )}
      </div>

      {/* Product Info Overlay */}
      <div className="absolute left-4 bottom-8 right-16 sm:right-20 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-md"
        >
          <Link
            href={`/product/${product.id}`}
            className="group inline-flex flex-col gap-1 sm:gap-2"
          >
            <h3
              className="text-lg sm:text-2xl font-semibold text-white drop-shadow-lg group-hover:text-neutral-300 transition-colors"
              style={{ fontFamily: CORMORANT }}
            >
              {product.name}
            </h3>
            <p
              className="text-xs sm:text-sm text-white/80 line-clamp-2 mb-3 sm:mb-4 font-light leading-relaxed"
              style={{ fontFamily: JOST }}
            >
              {product.description}
            </p>
          </Link>

          {/* Product Card Overlay */}
          <motion.div
            whileHover={{ y: -5 }}
            className="flex items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-3 sm:p-4 rounded-2xl max-w-[240px] sm:max-w-xs overflow-hidden"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[8px] sm:text-[10px] text-white/60 font-bold uppercase tracking-wider mb-0.5 sm:mb-1"
                style={{ fontFamily: JOST }}
              >
                Featured Product
              </p>
              <p
                className="text-white font-bold text-xs sm:text-sm mb-0.5 sm:mb-1 truncate"
                style={{ fontFamily: JOST }}
              >
                {formatPrice(product.price)}
              </p>
              <Link
                href={`/product/${product.id}`}
                className="inline-flex items-center gap-1 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-neutral-300 transition-colors"
                style={{ fontFamily: JOST }}
              >
                Buy Now <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Music / Sound Label */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
        <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center animate-spin-slow">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
        <span
          className="text-[10px] text-white/40 tracking-widest uppercase font-medium"
          style={{ fontFamily: JOST }}
        >
          Original Sound - Ravelle Official
        </span>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
