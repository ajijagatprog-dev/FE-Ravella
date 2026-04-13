import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { Suspense } from "react";
import UtmTracker from "./components/UtmTracker";
import "./globals.css";

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
    <html lang="id">
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
      <body>
        <Suspense fallback={null}>
          <UtmTracker />
        </Suspense>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
