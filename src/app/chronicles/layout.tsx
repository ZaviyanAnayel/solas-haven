import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chronicles of Light & Memory | Solas Haven",
  description:
    "Explore deeply moving true human reflections on grief, unrequited love, forgiveness, and silent prayers written to eternity across 195+ nations.",
  keywords: [
    "grief stories",
    "unspoken love chronicles",
    "letters to heaven stories",
    "bereavement healing articles",
    "emotional catharsis essays",
    "unsent letters project",
    "grief journaling reflections",
    "memorial tributes",
    "solas haven chronicles",
  ],
  alternates: {
    canonical: "https://solashaven.com/chronicles",
  },
  openGraph: {
    title: "Chronicles of Light & Memory | Solas Haven",
    description:
      "A sacred sanctuary archive of true human letters, grief reflections, and silent prayers across 195+ nations.",
    url: "https://solashaven.com/chronicles",
    siteName: "Solas Haven",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chronicles of Light & Memory | Solas Haven",
    description:
      "A sacred sanctuary archive of true human letters, grief reflections, and silent prayers across 195+ nations.",
  },
};

export default function ChroniclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
