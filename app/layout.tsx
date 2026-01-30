import type { Metadata } from "next";
import { Geist, Geist_Mono, Luckiest_Guy } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import { WholesaleProvider } from "./context/WholesaleContext";
import WholesaleOverlay from "./components/WholesaleOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const luckiestGuy = Luckiest_Guy({
  weight: "400",
  variable: "--font-luckiest-guy",
  subsets: ["latin"],
  display: "swap",
});

const sweetSans = localFont({
  src: "../public/SweetSansPro-Medium_2.otf",
  variable: "--font-sweet-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DiPiù® | Handcrafted Tiramisu",
  description: "Authentic Handcrafted Tiramisu made with love in Brisbane City, Queensland.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sweetSans.variable} ${luckiestGuy.variable} antialiased`}
      >
        <WholesaleProvider>
          <SmoothScroll />
          <Navbar />
          <WholesaleOverlay />
          {children}
        </WholesaleProvider>
      </body>
    </html>
  );
}
