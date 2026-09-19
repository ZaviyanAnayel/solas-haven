"use client";

import React from "react";
import { X, ShieldCheck, Lock, EyeOff, Sparkles, HeartHandshake } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-400/20 bg-neutral-950/95 p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-white overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono mb-4 w-fit">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>THE SACRED COVENANT</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-semibold text-white/95 mb-2">
          Pure Anonymity & Zero Data Collection
        </h3>
        <p className="text-xs text-white/60 mb-6 leading-relaxed">
          Like a secret whispered into the night wind, your words exist solely for healing. We collect nothing about you.
        </p>

        <div className="space-y-4 text-xs text-neutral-300">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
            <Lock className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white font-medium mb-0.5">No Accounts, No Passwords, No Emails</strong>
              <p className="text-white/60 leading-relaxed">
                You never need to sign up. No email is ever requested or saved. Your presence here leaves zero digital footprint.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
            <EyeOff className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white font-medium mb-0.5">Zero Trackers & Zero Advertising Pixels</strong>
              <p className="text-white/60 leading-relaxed">
                We do not sell data, run tracking cookies, or use commercial advertising SDKs. Your identity remains between you and the stars.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
            <HeartHandshake className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white font-medium mb-0.5">Detached Earthly Identity</strong>
              <p className="text-white/60 leading-relaxed">
                Your star carries only the emotion and words you choose to release. It cannot be traced back to your device or real name.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-all"
          >
            I Understand & Enter in Peace
          </button>
        </div>
      </div>
    </div>
  );
}