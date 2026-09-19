import React from "react";
import Link from "next/link";
import { INITIAL_LETTERS } from "../../../lib/initialStars";
import { CATEGORIES } from "../../../lib/types";
import { Sparkles, Heart, ArrowLeft, Globe2, Calendar } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return INITIAL_LETTERS.map((letter) => ({
    id: letter.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const letter = INITIAL_LETTERS.find((l) => l.id === id);

  if (!letter) {
    return {
      title: "Star of Light | Solas Haven",
      description: "A silent prayer released into the cosmic sanctuary of Solas Haven.",
    };
  }

  return {
    title: `${letter.recipient} | Solas Haven`,
    description: `"${letter.content.slice(0, 150)}..." - A permanent star in the Solas Haven celestial sanctuary.`,
    openGraph: {
      title: `${letter.recipient} - Solas Haven`,
      description: `"${letter.content.slice(0, 150)}..."`,
      type: "article",
    },
  };
}

export default async function LetterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const letter = INITIAL_LETTERS.find((l) => l.id === id);

  if (!letter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
        <Sparkles className="w-12 h-12 text-amber-300 mb-4 animate-pulse" />
        <h1 className="text-2xl font-serif mb-2">This star has drifted beyond view</h1>
        <p className="text-white/50 text-sm max-w-md mb-6">
          This letter may have been released in an ephemeral orbit or exists in local time.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-amber-300 text-black font-medium text-sm hover:brightness-110 transition-all"
        >
          Return to the Living Constellation
        </Link>
      </div>
    );
  }

  const categoryInfo = CATEGORIES.find((c) => c.id === letter.category) || CATEGORIES[1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": letter.recipient,
    "headline": letter.recipient,
    "text": letter.content,
    "genre": letter.category,
    "dateCreated": letter.createdAt,
    "locationCreated": {
      "@type": "Place",
      "name": letter.locationName,
    },
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": "https://schema.org/LikeAction",
      "userInteractionCount": letter.lightCount,
    },
  };

  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25"
        style={{ backgroundColor: letter.color }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-xl mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Enter Living Constellation</span>
        </Link>
      </div>

      <article className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-black/80 backdrop-blur-2xl p-7 sm:p-10 shadow-2xl shadow-black">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
            style={{
              backgroundColor: `${letter.color}15`,
              borderColor: `${letter.color}40`,
              color: letter.color,
            }}
          >
            <span>{categoryInfo.icon}</span>
            <span>{categoryInfo.label.toUpperCase()}</span>
          </span>

          <span className="flex items-center gap-1 text-xs text-white/50 font-mono">
            <Globe2 className="w-3 h-3" />
            {letter.locationName}
          </span>

          <span className="flex items-center gap-1 text-xs text-white/50 font-mono">
            <Calendar className="w-3 h-3" />
            {letter.createdAt}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-white/95 mb-6 tracking-tight">
          {letter.recipient}
        </h1>

        <div className="relative my-6 px-6 py-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-serif italic whitespace-pre-line">
            "{letter.content}"
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
          <div className="flex items-center gap-2 text-xs text-rose-300 font-medium">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            <span>{letter.lightCount.toLocaleString()} souls sent light</span>
          </div>

          <Link
            href="/"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 text-black font-medium text-xs hover:shadow-lg hover:shadow-amber-400/20 transition-all"
          >
            Release Your Own Star
          </Link>
        </div>

        {/* Deep Editorial Reflection (Google AdSense High-Value Content & Human Solace) */}
        <section className="mt-10 pt-8 border-t border-white/10 space-y-6">
          <div>
            <span className="text-[11px] font-mono text-amber-300/80 uppercase tracking-wider block mb-1">
              ✦ Psychological Reflection & Editorial Commentary
            </span>
            <h2 className="text-lg font-serif font-medium text-white/90">
              Understanding the Weight of Unspoken Words
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-neutral-300/85 leading-relaxed font-serif">
            <p>
              In cognitive psychology, unexpressed emotional messages—often termed <em>disenfranchised sentiments</em>—exert a measurable cognitive load. When words are withheld due to grief, pride, distance, or the irreversible passage of time, the brain continues to loop the unresolved narrative, an effect closely related to the Zeigarnik phenomenon.
            </p>
            <p>
              By releasing this sentiment into the sanctuary of stars, the author initiates a process known as <strong>symbolic externalization</strong>. Clinical studies spearheaded by Dr. James Pennebaker in expressive writing reveal that translating unacknowledged internal pain into written prose significantly lowers autonomic nervous system arousal, reduces intrusive thoughts, and stabilizes immune biomarkers.
            </p>
            <p>
              This star is not merely text on a screen; it is a permanent emotional monument. It reminds every passerby that personal sorrow and unspoken tenderness are universal conditions shared across all continents and languages.
            </p>
          </div>

          {/* Sanctuary Wisdom Callout */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-white/70 italic font-serif">
            <p className="mb-2">
              "What we keep inside does not disappear; it turns into a shadow that walks beside us. When we give our truth to the stars, we do not forget it—we simply let it rest."
            </p>
            <span className="text-[10px] font-mono text-amber-300/60 not-italic block">
              — Sanctuary Archive of Unspoken Memory
            </span>
          </div>

          {/* Compassionate Mental Health & Care Note */}
          <div className="p-4 rounded-2xl bg-amber-400/[0.05] border border-amber-400/20 text-[11px] text-neutral-300 leading-relaxed">
            <h3 className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5 font-mono text-xs">
              <span>🕊️ Compassionate Care & Global Crisis Resources</span>
            </h3>
            <p className="mb-2">
              If reading this letter touches a deep sorrow or unmanageable grief within you, please know you are not alone on this earth. Free, confidential support is available 24/7:
            </p>
            <ul className="space-y-1 font-mono text-[10px] text-white/70">
              <li>• United States & Canada: Dial <strong>988</strong> (Suicide & Crisis Lifeline)</li>
              <li>• United Kingdom: Call <strong>111</strong> (NHS Mental Health) or text <strong>SHOUT to 85258</strong></li>
              <li>• International & Worldwide: Visit <strong>befrienders.org</strong> for confidential support in your nation.</li>
            </ul>
          </div>
        </section>
      </article>

      {/* Related Reading Navigation for Full SEO Crawlability */}
      <div className="w-full max-w-xl mt-8 flex items-center justify-between text-xs text-white/50 font-mono">
        <Link href="/chronicles" className="hover:text-amber-300 underline underline-offset-4">
          ← Read Master Essays & Memoirs
        </Link>
        <Link href="/about" className="hover:text-amber-300 underline underline-offset-4">
          Sanctuary Mission & Ethics →
        </Link>
      </div>

      <footer className="mt-8 text-center text-xs text-white/30 tracking-widest font-mono uppercase">
        Solas Haven • Operated by Zaviyan • The Celestial Sanctuary of Unspoken Words
      </footer>
    </div>
  );
}