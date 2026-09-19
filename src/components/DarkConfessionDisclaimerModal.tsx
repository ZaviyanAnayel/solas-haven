"use client";

import React, { useState } from "react";
import { ShieldAlert, CheckSquare, Square, Feather, ArrowLeft, X } from "lucide-react";

interface DarkConfessionDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  disclaimerNote?: string | null;
  storyTitle: string;
}

export default function DarkConfessionDisclaimerModal({
  isOpen,
  onClose,
  onConfirmPublish,
  disclaimerNote,
  storyTitle,
}: DarkConfessionDisclaimerModalProps) {
  const [hasAgreed, setHasAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 text-white selection:bg-amber-400/30 selection:text-amber-100"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#090b12] border border-amber-400/30 p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25">
                Voluntary Content Advisory
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-serif font-medium text-white mb-2 leading-snug">
          Solemn Chronicle Advisory
        </h3>

        <p className="text-xs text-white/60 mb-5 leading-relaxed">
          Your memoir touches on intense moral, historical, or profound personal confessions.
          Solas Haven does not delete authentic personal reflections, but requires voluntary acknowledgment before archiving into the living constellation.
        </p>

        {/* AI Advisory Box */}
        <div className="p-4 rounded-2xl bg-purple-500/[0.06] border border-purple-400/20 mb-5 text-xs text-purple-100/90 leading-relaxed">
          <div className="font-serif italic text-white/95 mb-1.5">
            "{disclaimerNote ||
              "This chronicle touches on deep moral, historical, or sensitive confessions. Published under sole voluntary author responsibility."}"
          </div>
          <div className="text-[11px] font-mono text-purple-300/60 pt-2 border-t border-purple-400/15">
            Subject: "{storyTitle}" • Retained without alteration.
          </div>
        </div>

        {/* Legal / Liability Terms */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-[11px] text-white/60 leading-relaxed mb-5">
          <p className="mb-2">
            <strong className="text-white/90">Platform Disclaimer:</strong> Solas Haven is a neutral, secular sanctuary for human emotional release and historical memoirs. The platform does not verify, endorse, or accept liability for user-submitted recollections, crime testimonies, or personal declarations.
          </p>
          <p>
            You affirm that you are recording this chronicle voluntarily of your own free will and moral responsibility.
          </p>
        </div>

        {/* Agreement Toggle */}
        <button
          type="button"
          onClick={() => setHasAgreed(!hasAgreed)}
          className="w-full flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-colors text-left mb-6 cursor-pointer"
        >
          <div className="mt-0.5 text-amber-300">
            {hasAgreed ? (
              <CheckSquare className="w-4 h-4 text-amber-400" />
            ) : (
              <Square className="w-4 h-4 text-white/40" />
            )}
          </div>
          <span className="text-xs text-white/80 leading-snug">
            I understand and accept full voluntary responsibility for publishing this chronicle to Solas Haven.
          </span>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-colors border border-white/10"
          >
            Return to Editing
          </button>

          <button
            type="button"
            disabled={!hasAgreed}
            onClick={() => {
              if (hasAgreed) onConfirmPublish();
            }}
            className={`flex-1 py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
              hasAgreed
                ? "bg-gradient-to-r from-amber-300 to-amber-400 text-black hover:brightness-110 shadow-amber-300/20 cursor-pointer"
                : "bg-white/10 text-white/30 border border-white/5 cursor-not-allowed"
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Publish Chronicle</span>
          </button>
        </div>
      </div>
    </div>
  );
}
