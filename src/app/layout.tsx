import type { Metadata } from "next";
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
      <body className="min-h-full flex flex-col font-sans selection:bg-amber-400/30 selection:text-amber-100 bg-black text-white">
        {children}
      </body>
    </html>
  );
}