import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import { WholesaleProvider } from "./context/WholesaleContext";
import WholesaleOverlay from "./components/WholesaleOverlay";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

const sweetSans = localFont({
  src: "../public/SweetSansPro-Medium_2.otf",
  variable: "--font-sweet-sans",
  display: "swap",
});

const headerFont = localFont({
  src: "../public/file.woff2",
  variable: "--font-header",
  display: "swap",
});

const siteUrl = "https://dipiutiramisu.com.au";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DiPiù® | Handcrafted Tiramisu in Brisbane",
    template: "%s | DiPiù® Tiramisu",
  },
  description:
    "Authentic handcrafted tiramisu made fresh in Brisbane, Queensland. Classic, Pistacchio, Biscoff, Nutella & Limone flavours. Find us at local markets or order wholesale.",
  keywords: [
    "tiramisu",
    "handcrafted tiramisu",
    "Brisbane tiramisu",
    "Italian dessert Brisbane",
    "artisan tiramisu",
    "DiPiù",
    "Di Più tiramisu",
    "tiramisu Brisbane markets",
    "wholesale tiramisu",
    "authentic Italian tiramisu Queensland",
    "mascarpone dessert",
    "espresso tiramisu",
    "fruit sorbets Brisbane",
    "handmade desserts Brisbane",
  ],
  authors: [{ name: "DiPiù Tiramisu" }],
  creator: "DiPiù Tiramisu",
  publisher: "DiPiù Tiramisu",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "DiPiù® Tiramisu",
    title: "DiPiù® | Handcrafted Tiramisu in Brisbane",
    description:
      "Authentic handcrafted tiramisu made fresh in Brisbane. Classic, Pistacchio, Biscoff & more. Find us at local markets!",
    images: [
      {
        url: "/nuevoHero/heroPrincipal1.jpg",
        width: 1200,
        height: 630,
        alt: "DiPiù handcrafted tiramisu — Authentic Italian recipe made in Brisbane",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DiPiù® | Handcrafted Tiramisu in Brisbane",
    description:
      "Authentic handcrafted tiramisu made fresh in Brisbane. Classic, Pistacchio, Biscoff & more.",
    images: ["/nuevoHero/heroPrincipal1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Food & Drink",
};

// JSON-LD Structured Data for LocalBusiness
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: "DiPiù Tiramisu",
  alternateName: "DiPiù® Handcrafted Tiramisu",
  description:
    "Authentic handcrafted tiramisu made fresh in Brisbane, Queensland. Classic, Pistacchio, Biscoff, Nutella & Limone flavours available at local markets and for wholesale.",
  url: siteUrl,
  logo: `${siteUrl}/dipiuLogos/SVG/%233%20Logomark%20Red%20Positive.svg`,
  image: `${siteUrl}/nuevoHero/heroPrincipal1.jpg`,
  telephone: ["+61416306220", "+61434951515"],
  email: "dipiutiramisu@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brisbane",
    addressRegion: "QLD",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -27.4698,
    longitude: 153.0251,
  },
  areaServed: {
    "@type": "City",
    name: "Brisbane",
  },
  servesCuisine: "Italian",
  priceRange: "$$",
  sameAs: [
    "https://www.facebook.com/share/1GGBVfkzeU/",
    "https://www.instagram.com/dipiutiramisu",
  ],
  hasMenu: {
    "@type": "Menu",
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Tiramisu",
        hasMenuItem: [
          { "@type": "MenuItem", name: "Classico", description: "Authentic Savoiardi fingers soaked in espresso, layered with mascarpone cream and dusted with premium cocoa powder." },
          { "@type": "MenuItem", name: "Pistacchio Siciliano", description: "Espresso-infused Savoiardi and mascarpone blended with pure pistachio paste, finished with crushed pistachios." },
          { "@type": "MenuItem", name: "Biscoff Crunch", description: "Espresso-soaked Savoiardi and mascarpone cream with a touch of cinnamon, finished with Biscoff cookies." },
          { "@type": "MenuItem", name: "Nutella", description: "Espresso-soaked Savoiardi with mascarpone and ribbons of Nutella." },
          { "@type": "MenuItem", name: "Limone Fresco", description: "Homemade lemon curd swirls through mascarpone and espresso-soaked Savoiardi." },
        ],
      },
      {
        "@type": "MenuSection",
        name: "Fruit Sorbets",
        hasMenuItem: [
          { "@type": "MenuItem", name: "Strawberry Lemonade", description: "Fresh strawberries blended with zesty lemon." },
          { "@type": "MenuItem", name: "Mango & Raspberry", description: "Tropical mango sweetness meets tangy raspberry ripples." },
          { "@type": "MenuItem", name: "Kiwi, Lemon & Mint", description: "A super refreshing green trio." },
          { "@type": "MenuItem", name: "Passion Fruit & Orange", description: "Exotic passion fruit punch with a citrusy orange twist." },
          { "@type": "MenuItem", name: "Coconut", description: "Creamy, rich coconut. Pure tropical paradise." },
        ],
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sweetSans.variable} ${fredoka.variable} ${headerFont.variable} antialiased`}
      >
        <AuthProvider>
          <WholesaleProvider>
            <SmoothScroll />
            <Navbar />
            <WholesaleOverlay />
            {children}
          </WholesaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

