import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { CartHydration } from "@/components/providers/CartHydration";
import { JsonLd } from "@/components/seo/JsonLd";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = "https://appollo-coffee.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Appollo Coffee Shop — Wake Up The Beans",
    template: "%s · Appollo Coffee Shop",
  },
  description:
    "Appollo Coffee Shop is a specialty coffee roaster and e-commerce experience — single-origin beans, sustainable sourcing, and cinematic craft, cup by cup.",
  keywords: [
    "specialty coffee",
    "coffee roaster",
    "single origin coffee",
    "buy coffee online",
    "Appollo Coffee Shop",
  ],
  openGraph: {
    title: "Appollo Coffee Shop — Wake Up The Beans",
    description:
      "Specialty coffee, sourced with purpose and roasted with craft. Shop single-origin beans and brewing essentials.",
    url: siteUrl,
    siteName: "Appollo Coffee Shop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Appollo Coffee Shop — Wake Up The Beans",
    description: "Specialty coffee, sourced with purpose and roasted with craft.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3B241B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Appollo Coffee Shop",
            url: siteUrl,
            logo: `${siteUrl}/favicon.ico`,
            sameAs: [
              "https://instagram.com",
              "https://facebook.com",
              "https://youtube.com",
            ],
          }}
        />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
        <CartHydration />
      </body>
    </html>
  );
}
