"use client";

import React, { useState } from "react";
import { X, Sparkles, BookOpen, Send, Globe2, User, AlertCircle, Compass, Loader2 } from "lucide-react";
import { soundEngine } from "../lib/audio";
import { validateSanctuaryContent } from "../lib/moderation";
import confetti from "canvas-confetti";
import { WORLD_LANGUAGES } from "../lib/languages";
import { useGuardianInspection } from "../lib/useGuardianInspection";
import SanctuaryGuardianModal from "./SanctuaryGuardianModal";
import DarkConfessionDisclaimerModal from "./DarkConfessionDisclaimerModal";

export interface CommunityStory {
  slug: string;
  title: string;
  author: string;
  authorBio?: string;
  subtitle: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  category: string;
  locationName: string;
  coverImage?: string;
  sections: {
    heading?: string;
    paragraphs: string[];
  }[];
  isCommunityStory: boolean;
}

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryPublished: (story: CommunityStory) => void;
}

export default function ShareStoryModal({
  isOpen,
  onClose,
  onStoryPublished,
}: ShareStoryModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [locationName, setLocationName] = useState("");
  const [category, setCategory] = useState("Life & Grief");
  const [storyLanguage, setStoryLanguage] = useState("en");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWeavingStory, setIsWeavingStory] = useState(false);
  const [previousStoryDraft, setPreviousStoryDraft] = useState<string | null>(null);
  const [storyAiError, setStoryAiError] = useState<string | null>(null);

  const {
    inspect,
    isInspecting,
    guardianModalState,
    closeGuardianModal,
    disclaimerModalState,
    closeDisclaimerModal,
    promptDisclaimer,
  } = useGuardianInspection();

  const handleAiWeaveStory = async () => {
    if (!content.trim() || isWeavingStory) return;
    setIsWeavingStory(true);
    setStoryAiError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "weave_story",
          rawStory: content,
          title,
          category,
        }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        soundEngine.playLightShimmer();
        setPreviousStoryDraft(content);
        setContent(data.text);
      } else {
        setStoryAiError(data.error || "Could not weave story. Please try again.");
      }
    } catch {
      setStoryAiError("Cosmic connection timed out. Please try again.");
    } finally {
      setIsWeavingStory(false);
    }
  };

  const handleUndoStory = () => {
    if (previousStoryDraft !== null) {
      setContent(previousStoryDraft);
      setPreviousStoryDraft(null);
    }
  };

  if (!isOpen) return null;

  const handleAutoDetect = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.city && data.country_name) {
          setLocationName(`${data.city}, ${data.country_name}`);
          return;
        }
      }
    } catch {}
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const city = tz.split("/").pop()?.replace(/_/g, " ");
      setLocationName(`Somewhere near ${city}`);
    } catch {
      setLocationName("An Anonymous Place on Earth");
    }
  };

  const executePublishStory = () => {
    setIsSubmitting(true);
    soundEngine.playCelestialAscension();

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#fbbf24", "#ffffff", "#c084fc", "#38bdf8"],
    });

    const paragraphs = content
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    const excerpt = paragraphs[0]?.slice(0, 160) + "...";
    const wordCount = content.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 180))} min read`;

    const newStory: CommunityStory = {
      slug,
      title: title.trim(),
      author: author.trim() || "Anonymous Soul",
      authorBio: authorBio.trim() || undefined,
      subtitle: `A real human chronicle from ${locationName.trim() || "Earth"}`,
      excerpt,
      readTime,
      publishedAt: "Just now",
      category,
      locationName: locationName.trim() || "Somewhere on Earth",
      sections: [
        {
          heading: "The Memoir",
          paragraphs: paragraphs.length > 0 ? paragraphs : [content.trim()],
        },
      ],
      isCommunityStory: true,
    };

    setTimeout(() => {
      onStoryPublished(newStory);
      setIsSubmitting(false);
      onClose();
      setTitle("");
      setAuthor("");
      setAuthorBio("");
      setContent("");
      setLocationName("");
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !content.trim()) {
      setErrorMessage("Please provide a title and your story.");
      return;
    }

    const val = validateSanctuaryContent(content, false);
    if (!val.isClean) {
      setErrorMessage(val.error || "Please write words appropriate for this sanctuary.");
      return;
    }

    // AI Guardian inspection
    setIsSubmitting(true);
    const result = await inspect(
      content,
      "story",
      author || "Anonymous Soul",
      locationName || "Unknown Location",
      title
    );
    setIsSubmitting(false);

    if (!result.passed) {
      if (result.action === "REQUIRE_DISCLAIMER") {
        promptDisclaimer(title, result.disclaimerNote, () => {
          closeDisclaimerModal();
          executePublishStory();
        });
      }
      return;
    }

    executePublishStory();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-gradient-to-b from-neutral-900/95 via-neutral-950/95 to-black p-5 sm:p-8 shadow-2xl shadow-black text-white overflow-hidden max-h-[92vh] overflow-y-auto scrollbar-none">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>COMMUNITY CHRONICLE & MEMOIR ARCHIVE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-white/95">
            Share Your True Story
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Write your life story, an unspoken grief, or a personal journey. Your words become a permanent, indexed chronicle in the global archive.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5 tracking-wide">
              STORY TITLE
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Twenty Years of Silence, What I Never Said, A Letter to the Sea, The Night Everything Changed..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
            />
          </div>

          {/* Author Name and Bio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 tracking-wide flex items-center gap-1">
                <User className="w-3 h-3 text-amber-300" />
                <span>YOUR NAME OR PEN NAME (OPTIONAL)</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Anonymous Soul, A Quiet Wanderer, or your chosen pen name..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 tracking-wide">
                SHORT INTRO / BIO (OPTIONAL)
              </label>
              <input
                type="text"
                value={authorBio}
                onChange={(e) => setAuthorBio(e.target.value)}
                placeholder="e.g. A healing heart, learning to let go of old shadows..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
              />
            </div>
          </div>

          {/* Location, Language & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-white/70 tracking-wide flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-amber-300" />
                  <span>LOCATION</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  className="text-[10px] text-amber-300/80 hover:text-amber-300 underline"
                >
                  📍 Detect
                </button>
              </div>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Tokyo, London, Kyoto..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 tracking-wide flex items-center gap-1">
                <span>🌐</span>
                <span>LANGUAGE</span>
              </label>
              <select
                value={storyLanguage}
                onChange={(e) => setStoryLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
              >
                {WORLD_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5 tracking-wide">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400/50"
              >
                <option value="Grief & Loss">🕊️ Grief & Memory</option>
                <option value="Unspoken Love">🌹 Unspoken Love</option>
                <option value="Spiritual Journey">🕯️ Solace & Prayer</option>
                <option value="Healing & Forgiveness">🍃 Self-Forgiveness</option>
                <option value="Life & Memoirs">📖 Life Chronicles</option>
              </select>
            </div>
          </div>

          {/* The Full Story Content with AI Muse */}
          <div>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1.5">
              <label className="text-xs font-medium text-white/70 tracking-wide flex items-center gap-1.5">
                <span>YOUR STORY / MEMOIR (WRITE FREELY)</span>
                {previousStoryDraft !== null && (
                  <button
                    type="button"
                    onClick={handleUndoStory}
                    className="text-[10px] text-amber-300/80 hover:text-amber-200 underline decoration-dotted transition-colors cursor-pointer"
                  >
                    (Undo AI Weave)
                  </button>
                )}
              </label>

              <button
                type="button"
                onClick={handleAiWeaveStory}
                disabled={isWeavingStory || !content.trim()}
                title="Weave rough thoughts or memories into a rich literary memoir"
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isWeavingStory
                    ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 animate-pulse cursor-wait"
                    : !content.trim()
                    ? "bg-white/[0.03] text-white/30 border border-white/5 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 text-amber-200 border border-amber-400/30 shadow-sm"
                }`}
              >
                {isWeavingStory ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-amber-300" />
                    <span>Polishing Memoir...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>✦ Weave Story (AI Muse)</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pour your heart onto this page without fear or judgement. Even rough notes or stream of consciousness work—tap '✦ Weave Story (AI Muse)' above anytime to polish it into a moving literary chronicle..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 leading-relaxed resize-y"
            />
            {storyAiError && (
              <p className="text-[11px] text-rose-400/80 mt-1 flex items-center gap-1">
                <span>⚠</span> {storyAiError}
              </p>
            )}
            {previousStoryDraft && (
              <p className="text-[10px] text-amber-300/60 mt-1">
                ✦ Your original draft is preserved. Click &ldquo;Undo AI Weave&rdquo; above anytime to restore it.
              </p>
            )}
            <p className="text-[10px] text-white/40 mt-1">
              ✦ Tip: Press Enter twice to create new paragraphs.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 text-neutral-950 font-medium text-sm tracking-wide shadow-xl shadow-amber-400/20 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing to the Chronicles...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish to Chronicles & Cosmos</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Sanctuary Guardian Strike Modal */}
      <SanctuaryGuardianModal
        isOpen={guardianModalState.isOpen}
        onClose={closeGuardianModal}
        strikeLevel={guardianModalState.strikeLevel}
        guidanceMessage={guardianModalState.guidanceMessage}
        reason={guardianModalState.reason}
        remainingMs={guardianModalState.remainingMs}
      />

      {/* Dark Confession Disclaimer Modal */}
      <DarkConfessionDisclaimerModal
        isOpen={disclaimerModalState.isOpen}
        onClose={closeDisclaimerModal}
        onConfirmPublish={() => {
          if (disclaimerModalState.pendingConfirm) {
            disclaimerModalState.pendingConfirm();
          }
        }}
        disclaimerNote={disclaimerModalState.disclaimerNote}
        storyTitle={disclaimerModalState.storyTitle}
      />
    </div>
  );
}