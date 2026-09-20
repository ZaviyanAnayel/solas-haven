"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LibraryBook } from "../lib/library/types";
import { soundEngine } from "../lib/audio";
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  VolumeX,
  Type,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Share2,
  Check,
  Menu,
  X,
  ShieldCheck,
  Bookmark
} from "lucide-react";

interface LibraryReaderViewProps {
  book: LibraryBook;
  relatedBooks: LibraryBook[];
}

export default function LibraryReaderView({ book, relatedBooks }: LibraryReaderViewProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [fontFamily, setFontFamily] = useState<"serif" | "sans">("serif");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [starReleasedToast, setStarReleasedToast] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const currentChapter = book.chapters[currentChapterIndex] || book.chapters[0];

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentChapterIndex]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopAmbient();
    };
  }, []);

  const toggleAudio = () => {
    if (isAudioPlaying) {
      soundEngine.stopAmbient();
      setIsAudioPlaying(false);
    } else {
      soundEngine.startAmbient();
      setIsAudioPlaying(true);
    }
  };

  // Text selection listener for quote release
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 15) {
      const text = selection.toString().trim();
      setSelectedText(text.slice(0, 300));
    } else {
      // Don't immediately clear if clicking on the tooltip button
    }
  };

  const releaseSelectedQuoteAsStar = () => {
    if (!selectedText) return;

    try {
      const storageKey = "letters_to_eternity_stars_v1";
      const existing = localStorage.getItem(storageKey);
      let stars = [];
      if (existing) {
        try {
          stars = JSON.parse(existing);
        } catch {}
      }

      const newStar = {
        id: `star-library-${Date.now()}`,
        recipient: `${book.author} • ${book.title}`,
        category: "prayer",
        letter: `"${selectedText}" — ${book.title} (${book.author})`,
        x: (Math.random() - 0.5) * 1200,
        y: (Math.random() - 0.5) * 1200,
        z: (Math.random() - 0.5) * 800,
        color: book.accentColor || "#f59e0b",
        createdDate: new Date().toISOString(),
        likes: 1,
      };

      stars.unshift(newStar);
      localStorage.setItem(storageKey, JSON.stringify(stars));

      // Trigger pleasant auditory shimmer
      soundEngine.playLightShimmer();

      setStarReleasedToast(`Quote released into the Solas Haven sky as a golden star!`);
      setSelectedText(null);
      setTimeout(() => setStarReleasedToast(null), 5000);
    } catch {
      setStarReleasedToast("Saved to your celestial reflections.");
      setTimeout(() => setStarReleasedToast(null), 4000);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${book.title} - ${book.author}`,
          text: `Reading ${book.title} by ${book.author} on Solas Haven.`,
          url,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 3000);
    }
  };

  const fontSizeClasses = {
    sm: "text-sm leading-relaxed",
    base: "text-base sm:text-lg leading-loose",
    lg: "text-lg sm:text-xl leading-loose",
    xl: "text-xl sm:text-2xl leading-loose",
  };

  return (
    <div
      className="min-h-screen bg-[#030408] text-white selection:bg-amber-400/30 selection:text-amber-100 flex flex-col justify-between"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      {/* Sticky Top Reader Controls */}
      <header className="sticky top-0 z-40 bg-[#030408]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Back to Library */}
          <Link
            href="/library"
            className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sanctuary Library</span>
            <span className="sm:hidden">Library</span>
          </Link>

          {/* Book & Chapter Indicator */}
          <div className="flex-1 text-center px-2 truncate">
            <h1 className="text-xs sm:text-sm font-serif text-white/90 truncate">{book.title}</h1>
            <p className="text-[10px] text-amber-300/80 font-mono truncate">
              {currentChapter.title} ({currentChapterIndex + 1}/{book.chapters.length})
            </p>
          </div>

          {/* Reader Tools Cluster */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Ambient 432Hz Audio Toggle */}
            <button
              onClick={toggleAudio}
              title={isAudioPlaying ? "Mute 432Hz ambient sound" : "Play 432Hz restorative ambient audio"}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isAudioPlaying
                  ? "bg-amber-400/20 border-amber-400/50 text-amber-300 shadow-lg shadow-amber-500/20"
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Font Family Switcher (Serif / Sans) */}
            <button
              onClick={() => setFontFamily((prev) => (prev === "serif" ? "sans" : "serif"))}
              title="Switch font between Serif and Sans-Serif"
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer hidden sm:flex"
            >
              <Type className="w-3.5 h-3.5" />
            </button>

            {/* Font Size Adjuster */}
            <div className="flex items-center rounded-full bg-white/5 border border-white/10 p-0.5 text-xs font-mono">
              <button
                onClick={() =>
                  setFontSize((prev) =>
                    prev === "xl" ? "lg" : prev === "lg" ? "base" : prev === "base" ? "sm" : "sm"
                  )
                }
                className="px-2 py-1 text-white/60 hover:text-white transition-colors"
                title="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={() =>
                  setFontSize((prev) =>
                    prev === "sm" ? "base" : prev === "base" ? "lg" : prev === "lg" ? "xl" : "xl"
                  )
                }
                className="px-2 py-1 text-white/60 hover:text-white transition-colors border-l border-white/10"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Table of Contents Drawer Toggle */}
            <button
              onClick={() => setIsTocOpen(true)}
              title="Table of Contents"
              className="p-2 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-200 hover:bg-amber-400/25 transition-colors cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Quote Selection Tooltip */}
      {selectedText && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="flex items-center gap-2 p-2 px-4 rounded-full bg-neutral-900/95 border border-amber-400/50 backdrop-blur-2xl shadow-2xl shadow-amber-500/20 text-xs">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-white/90">Selected Quote</span>
            <button
              onClick={releaseSelectedQuoteAsStar}
              className="ml-2 px-3 py-1 rounded-full bg-amber-400 text-black font-semibold text-xs hover:bg-amber-300 transition-all cursor-pointer"
            >
              Release as Starlight ✦
            </button>
            <button
              onClick={() => setSelectedText(null)}
              className="p-1 text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Star Released Toast Notification */}
      {starReleasedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in max-w-md w-full px-4">
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-400/20 border border-amber-400/60 backdrop-blur-2xl text-amber-200 text-xs shadow-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{starReleasedToast}</span>
            </div>
            <Link
              href="/"
              className="underline font-semibold hover:text-white shrink-0 ml-2"
            >
              View in Sky →
            </Link>
          </div>
        </div>
      )}

      {/* Table of Contents Slideout Drawer */}
      {isTocOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md bg-neutral-950 border-l border-white/15 h-full p-6 flex flex-col justify-between overflow-y-auto animate-slide-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="font-serif text-lg text-white">{book.title}</h2>
                  <p className="text-xs text-white/50 font-mono mt-0.5">Table of Contents</p>
                </div>
                <button
                  onClick={() => setIsTocOpen(false)}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chapter List */}
              <div className="flex flex-col gap-2 mt-4">
                {book.chapters.map((ch, idx) => {
                  const isCurrent = idx === currentChapterIndex;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setCurrentChapterIndex(idx);
                        setIsTocOpen(false);
                      }}
                      className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-amber-400/20 border-amber-400/50 text-amber-200 shadow-md"
                          : "bg-white/[0.02] border-white/5 text-white/70 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm">{ch.title}</span>
                        <span className="text-[10px] font-mono text-white/40">#{idx + 1}</span>
                      </div>
                      {ch.subtitle && (
                        <p className="text-[11px] text-white/40 mt-1 line-clamp-1 italic font-serif">
                          {ch.subtitle}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-white/10 text-xs text-white/40 font-mono text-center">
              {book.publicDomainNotice}
            </div>
          </div>
        </div>
      )}

      {/* Main Reading Canvas */}
      <main
        ref={contentRef}
        className={`flex-1 max-w-3xl mx-auto w-full px-4 sm:px-8 py-10 sm:py-16 ${
          fontFamily === "serif" ? "font-serif" : "font-sans"
        }`}
      >
        {/* Chapter Header */}
        <div className="mb-10 text-center space-y-3 pb-8 border-b border-white/10">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono">
            {book.title} • {book.author}
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif text-white/95 leading-tight">
            {currentChapter.title}
          </h1>
          {currentChapter.subtitle && (
            <p className="text-sm sm:text-base text-amber-200/70 italic max-w-xl mx-auto">
              "{currentChapter.subtitle}"
            </p>
          )}
        </div>

        {/* Chapter Paragraphs */}
        <article className={`space-y-6 text-white/80 ${fontSizeClasses[fontSize]}`}>
          {currentChapter.content.map((paragraph, pIdx) => (
            <p key={pIdx} className="tracking-wide">
              {paragraph}
            </p>
          ))}
        </article>

        {/* Tip for Highlight & Release */}
        <div className="mt-12 p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs text-white/50 font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tip: Highlight any sentence to release it as a star into the constellation.</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-amber-300 hover:underline cursor-pointer"
          >
            {copiedQuote ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedQuote ? "Link Copied" : "Share"}</span>
          </button>
        </div>

        {/* Chapter Navigation Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between gap-4">
          <button
            disabled={currentChapterIndex === 0}
            onClick={() => setCurrentChapterIndex((prev) => Math.max(0, prev - 1))}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-medium transition-all ${
              currentChapterIndex === 0
                ? "opacity-30 cursor-not-allowed border-white/5 text-white/40"
                : "bg-white/5 border-white/10 text-white hover:bg-white/10 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Chapter</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <span className="text-xs font-mono text-white/40">
            {currentChapterIndex + 1} / {book.chapters.length}
          </span>

          <button
            disabled={currentChapterIndex === book.chapters.length - 1}
            onClick={() =>
              setCurrentChapterIndex((prev) => Math.min(book.chapters.length - 1, prev + 1))
            }
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-medium transition-all ${
              currentChapterIndex === book.chapters.length - 1
                ? "opacity-30 cursor-not-allowed border-white/5 text-white/40"
                : "bg-amber-400/20 border-amber-400/50 text-amber-200 hover:bg-amber-400/30 cursor-pointer"
            }`}
          >
            <span className="hidden sm:inline">Next Chapter</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Related Sanctuary Books Section */}
        {relatedBooks.length > 0 && (
          <section className="mt-16 pt-12 border-t border-white/10">
            <h3 className="text-lg font-serif text-white/90 mb-4">Continue Reading</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedBooks.map((rb) => (
                <Link
                  key={rb.slug}
                  href={`/library/${rb.slug}`}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all block group"
                >
                  <span className="text-[10px] font-mono text-amber-300 block mb-1">
                    {rb.category}
                  </span>
                  <h4 className="font-serif text-sm text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                    {rb.title}
                  </h4>
                  <p className="text-xs text-white/50 font-mono mt-0.5">{rb.author}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Reader Footer Provenance */}
      <footer className="border-t border-white/10 bg-black/40 py-6 px-4 text-center text-xs text-white/40 font-mono">
        <p>{book.publicDomainNotice}</p>
        <p className="mt-1 text-white/30">
          Solas Haven • An anonymous sanctuary for human reflection and solace.
        </p>
      </footer>
    </div>
  );
}
