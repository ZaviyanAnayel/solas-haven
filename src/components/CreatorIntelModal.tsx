"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Radio,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  Trash2,
  Sparkles,
  AlertTriangle,
  FileText,
  X,
  ExternalLink,
} from "lucide-react";
import {
  GuardianIncident,
  getGuardianIncidents,
  markIncidentsRead,
  clearGuardianIncidents,
  logGuardianIncident,
} from "../lib/guardianEngine";

interface CreatorIntelModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: GuardianIncident[];
  onRefresh: () => void;
}

export default function CreatorIntelModal({
  isOpen,
  onClose,
  incidents,
  onRefresh,
}: CreatorIntelModalProps) {
  const [filter, setFilter] = useState<"ALL" | "BULLYING" | "DARK_CONFESSION">("ALL");

  if (!isOpen) return null;

  const filtered = incidents.filter((item) => {
    if (filter === "BULLYING") return item.type === "BULLYING_STRIKE" || item.type === "HARSH_SPEECH";
    if (filter === "DARK_CONFESSION") return item.type === "DARK_CONFESSION_DISCLAIMER";
    return true;
  });

  const handleMarkAllRead = () => {
    markIncidentsRead();
    onRefresh();
  };

  const handleClear = () => {
    if (confirm("Clear all sanctuary incident records?")) {
      clearGuardianIncidents();
      onRefresh();
    }
  };

  const handleSimulate = () => {
    logGuardianIncident({
      origin: "story",
      type: "DARK_CONFESSION_DISCLAIMER",
      author: "Test Confessor",
      location: "San Francisco, California",
      excerpt: "Simulated test confession: I kept this secret locked away for fifteen years...",
      verdict: "Simulated Sentinel check: Author acknowledged voluntary liability disclaimer. Story preserved.",
    });
    onRefresh();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 text-white selection:bg-amber-400/30 selection:text-amber-100"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl my-auto bg-[#08090f] border border-amber-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400/20 to-purple-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-semibold text-white">
                  Sanctuary Sentinel • Creator Intelligence
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-mono text-[10px] border border-amber-400/30">
                  OPERATOR TERMINAL
                </span>
              </div>
              <p className="text-[11px] text-white/40 font-mono">
                Operator: Zaviyan • business@zaviyanllc.com
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                filter === "ALL"
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                  : "bg-white/5 text-white/60 hover:text-white border border-white/10"
              }`}
            >
              All ({incidents.length})
            </button>
            <button
              onClick={() => setFilter("BULLYING")}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                filter === "BULLYING"
                  ? "bg-red-500/20 text-red-300 border border-red-500/40"
                  : "bg-white/5 text-white/60 hover:text-white border border-white/10"
              }`}
            >
              Bullying Blocked ({incidents.filter((i) => i.type !== "DARK_CONFESSION_DISCLAIMER").length})
            </button>
            <button
              onClick={() => setFilter("DARK_CONFESSION")}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                filter === "DARK_CONFESSION"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-white/5 text-white/60 hover:text-white border border-white/10"
              }`}
            >
              Dark Confessions ({incidents.filter((i) => i.type === "DARK_CONFESSION_DISCLAIMER").length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={handleSimulate}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300/80 hover:text-amber-300 transition-colors flex items-center gap-1 text-[11px]"
            >
              <Sparkles className="w-3 h-3" />
              <span>Simulate Incident</span>
            </button>
            <button
              onClick={handleMarkAllRead}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={handleClear}
              className="p-1 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 text-white/40 hover:text-red-300 transition-colors"
              title="Clear Incident History"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Incident List */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-white/40 font-mono">
              No sanctuary incidents logged under this filter. All souls are peaceful.
            </div>
          ) : (
            filtered.map((inc) => {
              const dateStr = new Date(inc.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={inc.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    inc.type === "DARK_CONFESSION_DISCLAIMER"
                      ? "bg-purple-950/10 border-purple-500/30 hover:bg-purple-950/20"
                      : "bg-red-950/10 border-red-500/30 hover:bg-red-950/20"
                  } ${!inc.isReadByOperator ? "ring-1 ring-amber-400/40" : ""}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          inc.type === "DARK_CONFESSION_DISCLAIMER"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-red-500/20 text-red-300 border-red-500/30"
                        }`}
                      >
                        {inc.type === "DARK_CONFESSION_DISCLAIMER"
                          ? "CONFESSION ADVISORY"
                          : `BULLYING STRIKE ${inc.strikeLevel ? `#${inc.strikeLevel}` : ""}`}
                      </span>

                      <span className="text-[11px] text-white/40 font-mono uppercase">
                        {inc.origin}
                      </span>

                      {!inc.isReadByOperator && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  {/* Author & Location */}
                  <div className="flex items-center gap-3 text-xs text-white/70 mb-2 font-mono">
                    <span className="flex items-center gap-1 text-white/90">
                      <User className="w-3 h-3 text-amber-300" />
                      {inc.author}
                    </span>
                    {inc.location && (
                      <span className="flex items-center gap-1 text-white/50">
                        <MapPin className="w-3 h-3 text-amber-400/70" />
                        {inc.location}
                      </span>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80 italic mb-2 leading-relaxed font-serif">
                    "{inc.excerpt}"
                  </div>

                  {/* Verdict */}
                  <div className="text-[11px] font-mono flex items-center justify-between text-white/50">
                    <span className="text-amber-300/80">
                      ★ Action: {inc.verdict}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 font-mono shrink-0">
          <span>Solas Haven Sentinel System • Local Operator Terminal</span>
          <span>Automatic 7-day decay cycle</span>
        </div>
      </div>
    </div>
  );
}
