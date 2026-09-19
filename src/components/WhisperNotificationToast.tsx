"use client";

import React from "react";
import { Sparkles, X, Heart } from "lucide-react";

interface WhisperNotificationProps {
  notification: {
    starId: string;
    recipient: string;
    whisperText: string;
    fromLocation: string;
  } | null;
  onClose: () => void;
  onViewStar: (starId: string) => void;
}

export default function WhisperNotificationToast({
  notification,
  onClose,
  onViewStar,
}: WhisperNotificationProps) {
  if (!notification) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 w-[92%] max-w-sm animate-fade-in pointer-events-auto">
      <div className="relative rounded-2xl border border-amber-400/40 bg-black/90 backdrop-blur-2xl p-4 shadow-2xl shadow-amber-500/25 text-white overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-white/40 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-300 uppercase tracking-widest mb-1">
              <span>Prayer Received on Your Star</span>
            </div>
            <h5 className="text-xs font-semibold text-white/95 mb-1 line-clamp-1">
              {notification.recipient}
            </h5>
            <p className="text-xs text-white/80 italic font-serif leading-relaxed line-clamp-2">
              "{notification.whisperText}"
            </p>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[10px] text-white/40">From {notification.fromLocation}</span>
              <button
                onClick={() => {
                  onViewStar(notification.starId);
                  onClose();
                }}
                className="text-[11px] font-medium text-amber-300 hover:text-amber-200 underline underline-offset-2"
              >
                View Your Star →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}