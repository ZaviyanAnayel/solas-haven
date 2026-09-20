import React from "react";
import Link from "next/link";
import { CHRONICLES, getChronicleBySlug, getRelatedChronicles } from "../../../lib/chroniclesData";
import CommunityChronicleFallback from "../../../components/CommunityChronicleFallback";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  Feather,
  Calendar,
  User,
  Share2,
  BookOpen,
  Tag,
  ShieldCheck
} from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return CHRONICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getChronicleBySlug(slug);

  if (!article) {
    return {
      title: "Community Chronicle | Solas Haven",
      description: "Human reflections on grief, unspoken love, and silent prayers.",
    };
  }

  return {
    title: `${article.title} | Solas Haven`,
    description: article.excerpt,
    alternates: {
      canonical: `https://solashaven.com/chronicles/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ChronicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getChronicleBySlug(slug);

  if (!article) {
    return <CommunityChronicleFallback slug={slug} />;
  }

  const related = getRelatedChronicles(slug, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.coverImage,
    "datePublished": "2026-09-01",
    "author": {
      "@type": "Person",
      "name": article.author || "Solas Haven Sanctuary",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Solas Haven",
      "url": "https://solashaven.com"
    }
  };

  return (
    <div className="min-h-screen bg-[#020204] text-white selection:bg-amber-400/30 selection:text-amber-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Bar */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link
            href="/chronicles"
            className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Chronicles ({CHRONICLES.length})</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-300 text-black font-medium text-xs hover:brightness-110 transition-all"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Leave a Star</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        {/* Category & Metadata Pills */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-white/50 mb-4">
          <Link
            href="/chronicles"
            className="px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 font-mono text-[11px] border border-amber-400/30 hover:bg-amber-400/25 transition-colors"
          >
            {article.category}
          </Link>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400/70" />
            {article.readTime}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-white/40" />
            {article.publishedAt}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-white/95 mb-4 leading-[1.15]">
          {article.title}
        </h1>

        {/* Subtitle */}
        {article.subtitle && (
          <p className="text-base sm:text-xl text-neutral-300/90 font-serif italic leading-relaxed mb-6">
            "{article.subtitle}"
          </p>
        )}

        {/* Author Byline */}
        {article.author && (
          <div className="flex items-center gap-2.5 py-3 border-y border-white/10 mb-8 text-xs text-white/70">
            <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-medium text-white/90">{article.author}</span>
              <span className="text-white/40 ml-2">• Authentic Human Chronicle</span>
            </div>
          </div>
        )}

        {/* Cover Image Banner */}
        {article.coverImage && (
          <div className="relative w-full h-[280px] sm:h-[440px] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl shadow-black/80">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-transparent to-transparent opacity-60" />
          </div>
        )}
      </div>

      {/* Main Article Prose */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <div className="space-y-10 text-base sm:text-lg text-neutral-300 leading-relaxed font-sans">
          {article.sections.map((sec, sIdx) => (
            <section key={sIdx} className="space-y-5">
              {sec.heading && (
                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white/95 pt-6 pb-2 border-b border-white/[0.08]">
                  {sec.heading}
                </h2>
              )}
              {sec.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className={
                    sIdx === 0 && pIdx === 0
                      ? "first-letter:text-5xl first-letter:font-serif first-letter:text-amber-300 first-letter:float-left first-letter:mr-3 first-letter:leading-none text-neutral-200"
                      : "text-neutral-300"
                  }
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* Tags & Verification Badge */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-white/40" />
              {article.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-mono"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-amber-300/80 font-mono">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Archived Permanently in Solas Haven</span>
          </div>
        </div>

        {/* Related Chronicles Section */}
        {related.length > 0 && (
          <div className="mt-20 pt-10 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <h3 className="text-xl font-serif font-medium text-white">Related Memoirs & Chronicles</h3>
              </div>
              <Link href="/chronicles" className="text-xs text-amber-300 hover:underline">
                View All ({CHRONICLES.length}) →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/chronicles/${rel.slug}`}
                  className="group block p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-400/30 transition-all flex flex-col justify-between"
                >
                  {rel.coverImage && (
                    <div className="w-full h-28 rounded-xl overflow-hidden mb-3 bg-neutral-900">
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-90 group-hover:brightness-100"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-mono text-amber-300/80 block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-serif font-medium text-white/95 group-hover:text-amber-200 transition-colors line-clamp-2 mb-2 leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-white/40 font-mono flex items-center gap-1 mt-2">
                    <Clock className="w-2.5 h-2.5" />
                    {rel.readTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Box */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl border border-amber-400/20 bg-gradient-to-b from-amber-500/10 to-transparent text-center">
          <Sparkles className="w-6 h-6 text-amber-300 mx-auto mb-3" />
          <h3 className="text-xl font-serif font-medium text-white mb-2">
            Is there a letter lingering in your silence?
          </h3>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto mb-6 leading-relaxed">
            Do not let your unsaid words weigh down your heart. Release them to the eternal living constellation of Solas Haven.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 text-black font-semibold text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-300/20"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Enter the Sanctuary & Release a Star</span>
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-white/60 mb-3 font-sans">
          <Link href="/privacy" className="hover:text-amber-300 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-amber-300 transition-colors">Terms of Sanctuary</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-amber-300 transition-colors">Contact & Support</Link>
        </div>
        <p className="text-[11px] text-white/30 tracking-widest font-mono uppercase">
          Solas Haven • Operated by Zaviyan • business@zaviyanllc.com
        </p>
      </footer>
    </div>
  );
}