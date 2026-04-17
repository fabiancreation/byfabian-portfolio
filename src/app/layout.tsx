import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://byfabian.com"),
  title: {
    default: "ByFabian — AI Campaign Imagery",
    template: "%s — ByFabian",
  },
  description:
    "ByFabian creates AI-generated fashion, beauty, and activewear campaigns. Editorial-grade imagery, no crew, no location, no plane ticket.",
  openGraph: {
    title: "ByFabian — AI Campaign Imagery",
    description:
      "Editorial-grade AI campaigns for fashion, beauty, and lifestyle brands.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ground text-ink antialiased">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
