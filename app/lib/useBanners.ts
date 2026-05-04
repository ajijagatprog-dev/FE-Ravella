import { useState, useEffect } from "react";
import api from "@/lib/axios";

interface BannerData {
  id: number;
  page: string;
  slot: number;
  image: string | null;
  is_active: boolean;
}

/**
 * Hook to fetch dynamic banners for a page from the API.
 * Returns an array of banner image URLs (falling back to defaults if API fails or no banner uploaded).
 *
 * @param page - The page key (e.g. "home", "product", "news")
 * @param defaultImages - Array of default image URLs to fall back to
 */
export function useBanners(page: string, defaultImages: string[]): string[] {
  const [images, setImages] = useState<string[]>(defaultImages);

  useEffect(() => {
    let cancelled = false;

    const fetchBanners = async () => {
      try {
        const res = await api.get(`/public/banners/${page}`);
        if (res.data?.status === "success" && !cancelled) {
          const banners: BannerData[] = res.data.data;

          if (banners.length > 0) {
            // Determine max slots from either defaults or API data
            const maxSlots = Math.max(
              defaultImages.length,
              ...banners.map((b) => b.slot),
            );

            const result: string[] = [];
            for (let i = 0; i < maxSlots; i++) {
              const banner = banners.find((b) => b.slot === i + 1);
              if (banner?.image) {
                result.push(banner.image);
              } else {
                result.push(defaultImages[i] || "");
              }
            }
            setImages(result);
          }
        }
      } catch (err) {
        // Log error for debugging, fall back to defaults
        console.warn(`[useBanners] Failed to fetch banners for "${page}":`, err);
      }
    };

    fetchBanners();

    return () => {
      cancelled = true;
    };
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  return images;
}

