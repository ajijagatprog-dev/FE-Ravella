"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function UtmTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");

    if (utmSource) {
      sessionStorage.setItem("ravella_utm_source", utmSource);
    }
    if (utmMedium) {
      sessionStorage.setItem("ravella_utm_medium", utmMedium);
    }
    if (utmCampaign) {
      sessionStorage.setItem("ravella_utm_campaign", utmCampaign);
    }
  }, [searchParams]);

  return null;
}
