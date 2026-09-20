import React from "react";
import Link from "next/link";
import { ArrowLeft, Scale, Mail, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Solas Haven",
  description: "Terms and conditions of sanctuary use for Solas Haven, operated by Zaviyan.",
  alternates: {
    canonical: "https://www.solashaven.com/terms",
  },
};

export default function TermsPage() {
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
            <Scale className="w-3.5 h-3.5" />
            <span>TERMS OF SANCTUARY & COMMUNITY RULES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-white/95 mb-3">
            Terms of Service
          </h1>
          <p className="text-xs text-white/50 font-mono">
            Last Updated: September 18, 2026 • Governed by Zaviyan
          </p>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or contributing letters and whispers to <strong>Solas Haven</strong>, you signify that you have read, understood, and agreed to be bound by these Terms of Service, presented by <strong>Zaviyan</strong>. If you do not agree to these terms, please do not use this platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              2. Acceptable Use and Sacred Conduct
            </h2>
            <p>
              This sanctuary exists for healing, grief reflection, silent prayers, and authentic emotional catharsis. To preserve this atmosphere, users agree not to post:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-white/80">
              <li>Hate speech, racism, sectarian hatred, or discrimination of any form</li>
              <li>Harassment, threats, cyberbullying, or intentional emotional cruelty</li>
              <li>Promotion or incitement of suicide or self-harm</li>
              <li>Explicit commercial spam, affiliate marketing, or casino promotions</li>
              <li>Doxxing or revealing private personal telephone numbers, home addresses, or financial data</li>
            </ul>
            <p className="mt-2 text-xs text-white/60">
              We reserve the absolute right to moderate, filter, or permanently remove any content that violates these core covenants.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              3. User Submissions & License
            </h2>
            <p>
              When you submit an unspoken letter, prayer, or comfort whisper, you grant Zaviyan a non-exclusive, worldwide, royalty-free, perpetual license to host, display, and archive that contribution as a star within the digital constellation. You affirm that you possess the moral right to release these anonymous words.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              4. Emotional Well-Being & Medical Disclaimer
            </h2>
            <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-start gap-3 my-3">
              <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-neutral-200">
                <strong>Not a Substitute for Professional Care:</strong> Solas Haven is an artistic and reflective writing experience. It does not provide medical, psychiatric, or psychological counseling. If you are experiencing an acute mental health crisis or suicidal thoughts, please contact your local emergency services or a certified crisis helpline immediately.
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              5. Limitation of Liability
            </h2>
            <p>
              In no event shall Zaviyan, its officers, or its partners be liable for any indirect, incidental, or consequential damages resulting from your use of, or inability to use, the platform. The service is provided &ldquo;as is&rdquo; without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-serif font-medium text-white mb-2">
              6. Inquiries and Legal Notice
            </h2>
            <p>
              For legal inquiries, copyright takedown requests (DMCA), or partnership communications, contact Zaviyan directly:
            </p>
            <div className="my-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <span className="text-xs text-white/50 block">Legal & Corporate Desk:</span>
                <a
                  href="mailto:business@zaviyanllc.com"
                  className="text-sm font-medium text-amber-300 hover:underline"
                >
                  business@zaviyanllc.com
                </a>
              </div>
            </div>
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