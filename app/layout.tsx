import type { Metadata } from "next";
import { Quicksand, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { Suspense } from "react";
import UtmTracker from "./components/UtmTracker";
import "./globals.css";

// Fonts
// Quicksand → Headlines, judul, navigasi
// Poppins   → Body copy, teks deskripsi, paragraf
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ravella",
  description: "E-Commerce Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${quicksand.variable} ${poppins.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T4PF6ZDVQQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T4PF6ZDVQQ');
          `}
        </Script>
      </head>
      <body className={poppins.className}>
        <Suspense fallback={null}>
          <UtmTracker />
        </Suspense>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
