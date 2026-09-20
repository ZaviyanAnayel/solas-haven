import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Sanctuary Ethics Desk | Solas Haven",
  description:
    "Get in touch with the Solas Haven Sanctuary and Zaviyan ethics team for support, star removal requests, or general inquiries.",
  alternates: {
    canonical: "https://www.solashaven.com/contact",
  },
  openGraph: {
    title: "Contact & Sanctuary Ethics Desk | Solas Haven",
    description: "Support, ethics desk, and inquiries for the Solas Haven Sanctuary.",
    url: "https://www.solashaven.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
