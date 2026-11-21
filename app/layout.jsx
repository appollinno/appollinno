import {
  Permanent_Marker,
  Lato,
  Source_Code_Pro,
  Instrument_Serif,
  Inter_Tight,
} from "next/font/google";
import "./globals.css";

// --- Appollo coffee shop fonts ---
const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-marker",
});
const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
});
const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source",
});

// --- Higgsfield (/higgsfield) fonts, preserved ---
const serif = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});
const inter = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Appollo — Coffee Shop & Roastery",
  description:
    "Appollo is a small-batch coffee shop crafting exceptional coffee, one roast at a time. Explore our roasts, subscriptions, brewing guides and cafés.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${marker.variable} ${lato.variable} ${sourceCode.variable} ${serif.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
