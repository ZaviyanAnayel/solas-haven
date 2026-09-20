import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Solas Haven",
  description: "Official Privacy Policy for Solas Haven, operated by Zaviyan.",
  alternates: {
    canonical: "https://solashaven.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#020204] text-white selection:bg-amber-400/30 selection:text-amber-100">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sanctuary</span>
          </Link>
          <span className="text-xs text-amber-300/80 font-mono">ZAVIYAN</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>LEGAL & PRIVACY COMPLIANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-white/95 mb-3">
            Privacy Policy
          </h1>
          <p className="text-xs text-white/50 font-mono">
            Effective Date: September 18, 2026 • Operated by Zaviyan
          </p>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              1. Introduction and Core Philosophy
            </h2>
            <p>
              Welcome to <strong>Solas Haven</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), owned and operated by <strong>Zaviyan</strong>. Our foundational promise is to provide a sacred, reflective digital sanctuary where human grief, unspoken words, and silent prayers can be expressed without surveillance or intrusive profiling.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              2. Information We Do Not Collect
            </h2>
            <p>
              Unlike traditional social media platforms, Solas Haven does not require user registration. We do not collect or store:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
              <li>Names, email addresses, or phone numbers for letter submission</li>
              <li>Passwords or account credentials</li>
              <li>Precise GPS location data</li>
              <li>Personal social media identities</li>
            </ul>
            <p className="mt-2">
              All submitted letters, whispers, and stars are published anonymously by default unless you choose to provide a poetic or general pseudonym in the letter text.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              3. Information Collected Automatically & Log Files
            </h2>
            <p>
              Like most web properties, our servers automatically record basic standard protocol data, such as internet protocol (IP) addresses, browser types, internet service providers (ISPs), date/time stamps, and referring/exit pages. This information is used strictly to diagnose technical server errors, prevent distributed denial-of-service (DDoS) abuse, and administer the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              4. Cookies and Advertising Partners (Google AdSense Disclosure)
            </h2>
            <p>
              To keep this platform open and free to individuals worldwide, we may partner with third-party advertising networks, including <strong>Google AdSense</strong>.
            </p>
            <p className="mt-2">
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to our website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites on the Internet.
            </p>
            <p className="mt-2">
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 underline"
              >
                Google Ads Settings
              </a>
              . Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting{" "}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 underline"
              >
                aboutads.info
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              5. GDPR & CCPA Compliance (Data Subject Rights)
            </h2>
            <p>
              If you reside in the European Economic Area (EEA) or California (CCPA/CPRA), you possess specific legal rights concerning your personal data. Because we do not store names or user accounts, we do not maintain identifiable customer dossiers. However, if you believe a letter or piece of content references your private identifying details, you have the right to request immediate erasure.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              6. Content Removal & Editorial Contact
            </h2>
            <p>
              If you ever wish to have a specific star, letter, or whisper removed from the celestial constellation, please email us with the link or unique title at:
            </p>
            <div className="my-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <span className="text-xs text-white/50 block">Official Support & Removal:</span>
                <a
                  href="mailto:business@zaviyanllc.com"
                  className="text-sm font-medium text-amber-300 hover:underline"
                >
                  business@zaviyanllc.com
                </a>
              </div>
            </div>
            <p className="text-xs text-white/50">
              Content removal requests are evaluated and processed within 24 to 48 business hours.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/30 tracking-widest font-mono uppercase">
        Solas Haven • Operated by Zaviyan • All Rights Reserved
      </footer>
    </div>
  );
}