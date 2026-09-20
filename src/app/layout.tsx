import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Solas Haven - The Celestial Sanctuary of Unspoken Words",
  description:
    "Solas Haven is a sacred digital cosmos where unspoken grief, unsaid goodbyes, and silent prayers ascend into permanent starlight.",
  keywords: [
    "solas haven",
    "solashaven",
    "sanctuary of light",
    "unspoken words",
    "silent prayers",
    "grief healing",
    "letters to heaven",
    "catharsis",
    "spiritual sanctuary",
    "anonymous healing",
  ],
  authors: [{ name: "Solas Haven Sanctuary" }],
  openGraph: {
    title: "Solas Haven - The Celestial Sanctuary of Unspoken Words",
    description:
      "Where unsaid goodbyes, silent prayers, and secret truths become permanent stars in a living 3D cosmos.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solas Haven - Sanctuary of Light",
    description:
      "Where silent prayers and unsaid words become permanent stars in the cosmos.",
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} dark h-full bg-black text-white antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="google042113ed54845edd" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3405098265613384"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-amber-400/30 selection:text-amber-100 bg-black text-white">
        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-KXYQTHGKCJ"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KXYQTHGKCJ');
            `,
          }}
        />

        {children}
      </body>
    </html>
  );
}