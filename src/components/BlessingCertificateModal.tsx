"use client";

import React, { useRef } from "react";
import { X, Sparkles, Award, Printer, Shield, CheckCircle } from "lucide-react";
import { SoulProfile } from "../lib/useSoulProfile";

interface BlessingCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SoulProfile;
}

export default function BlessingCertificateModal({
  isOpen,
  onClose,
  profile,
}: BlessingCertificateModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[80] pointer-events-auto flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#07070a] border border-amber-400/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/90 text-center my-8 pointer-events-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Frame Container */}
        <div
          ref={printRef}
          className="relative p-6 sm:p-10 rounded-2xl border border-white/10 bg-gradient-to-b from-amber-500/[0.03] via-black to-transparent"
        >
          {/* Subtle Corner Markers */}
          <div className="absolute top-3 left-3 text-amber-300/30 text-[10px] font-mono">✦ ──</div>
          <div className="absolute top-3 right-3 text-amber-300/30 text-[10px] font-mono">── ✦</div>
          <div className="absolute bottom-3 left-3 text-amber-300/30 text-[10px] font-mono">✦ ──</div>
          <div className="absolute bottom-3 right-3 text-amber-300/30 text-[10px] font-mono">── ✦</div>

          {/* Solas Haven Geometric Star Seal */}
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-300 via-amber-200 to-amber-500 p-0.5 shadow-lg shadow-amber-400/20 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#07070a] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
          </div>

          <div className="text-[11px] font-mono tracking-[0.35em] uppercase text-amber-400/80 mb-2">
            SOLAS HAVEN • TESTAMENT OF SOLACE
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight mb-4">
            Certificate of Continuous Presence
          </h2>

          <div className="text-[11px] text-white/40 uppercase tracking-widest mb-2 font-mono">
            Conferred in Recognition Upon
          </div>

          {/* Recipient Name */}
          <div className="text-2xl sm:text-4xl font-serif font-medium text-amber-200 tracking-wide border-b border-white/10 pb-3 max-w-md mx-auto mb-4">
            {profile.name || "Anonymous Seeker"}
          </div>

          {profile.location && (
            <div className="text-xs text-white/50 font-mono mb-6">
              Location: {profile.location}
            </div>
          )}

          {/* Commendation Prose */}
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg mx-auto mb-8 italic font-serif">
            "In recognition of uninterrupted spiritual presence, quiet endurance, and dedicated reflection. By anchoring unspoken sentiments into the living cosmos, you have contributed an indelible beacon to our global sanctuary."
          </p>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto mb-8 py-3.5 border-y border-white/10 text-center">
            <div>
              <div className="text-lg sm:text-xl font-serif text-amber-300 font-semibold">
                {profile.streak} Days
              </div>
              <div className="text-[10px] text-white/40 uppercase font-mono">Presence Streak</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-serif text-amber-300 font-semibold">
                {profile.starsReleased}
              </div>
              <div className="text-[10px] text-white/40 uppercase font-mono">Stars Released</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-serif text-amber-300 font-semibold">
                {profile.vigilsJoined}
              </div>
              <div className="text-[10px] text-white/40 uppercase font-mono">Silent Vigils</div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="flex items-center justify-between max-w-md mx-auto text-left pt-2">
            <div>
              <div className="text-[10px] text-white/40 font-mono uppercase">Certified On</div>
              <div className="text-xs text-white/80 font-serif">{todayFormatted}</div>
            </div>

            <div className="text-center">
              <div className="w-8 h-8 mx-auto rounded-full border border-amber-400/40 bg-amber-400/10 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <span className="text-[8px] text-amber-300/80 font-mono tracking-widest uppercase">Verified Seal</span>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-white/40 font-mono uppercase">Sanctuary</div>
              <div className="text-xs text-amber-300 font-serif">Solas Haven • Zaviyan</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 hover:brightness-110 text-black font-semibold text-xs transition-all shadow-lg shadow-amber-300/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print or Save Certificate</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
