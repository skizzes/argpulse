import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARGPULSE | Argentina's Real-Time Country Status",
  description: "Live dashboard tracking Argentina's economic health through the Pulse Score. Exchange rates, inflation, country risk, reserves, and market data in real-time.",
  keywords: ["Argentina", "dólar blue", "inflación", "MERVAL", "riesgo país", "BCRA", "reservas", "economía argentina", "Pulse Score", "tipo de cambio", "MEP", "CCL"],
  authors: [{ name: "SkizzeS" }],
  metadataBase: new URL("https://argpulse.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ARGPULSE | Argentina's Real-Time Economic Dashboard",
    description: "Track the Pulse Score, exchange rates, inflation, country risk, and markets — all in one place. The go-to dashboard for the Argentine economy.",
    url: "https://argpulse.com",
    siteName: "ARGPULSE",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/logo.webp",
        width: 800,
        height: 400,
        alt: "ARGPULSE — Argentina Economic Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARGPULSE | Argentina's Real-Time Economic Dashboard",
    description: "Pulse Score, dólar blue, inflation, MERVAL, and more. Live data for investors and citizens. 🇦🇷",
    images: ["/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.webp",
  },
};

import { LanguageProvider } from "@/components/shared/language-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        {/* Google AdSense — Replace ca-pub-6795274738490710 with your publisher ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6795274738490710"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ARGPULSE",
              url: "https://argpulse.com",
              description: "Real-time dashboard for Argentina's economic indicators",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
