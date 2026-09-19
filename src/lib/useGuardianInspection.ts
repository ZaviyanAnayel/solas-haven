"use client";

import { useState, useCallback } from "react";
import {
  getStrikeState,
  recordStrike,
  logGuardianIncident,
  StrikeState,
} from "./guardianEngine";

export interface GuardianInspectionResult {
  passed: boolean;
  action: "ALLOW" | "REQUIRE_DISCLAIMER" | "BLOCK";
  classification?: "CLEAN" | "DEEP_CONFESSION" | "MALICIOUS_HARM";
  disclaimerNote?: string | null;
  guidanceMessage?: string | null;
  reason?: string | null;
}

export function useGuardianInspection() {
  const [isInspecting, setIsInspecting] = useState(false);
  const [guardianModalState, setGuardianModalState] = useState<{
    isOpen: boolean;
    strikeLevel: number;
    guidanceMessage?: string | null;
    reason?: string | null;
    remainingMs?: number;
  }>({
    isOpen: false,
    strikeLevel: 1,
    guidanceMessage: null,
    reason: null,
  });

  const [disclaimerModalState, setDisclaimerModalState] = useState<{
    isOpen: boolean;
    storyTitle: string;
    disclaimerNote?: string | null;
    pendingConfirm?: () => void;
  }>({
    isOpen: false,
    storyTitle: "",
    disclaimerNote: null,
  });

  const inspect = useCallback(
    async (
      text: string,
      context: "story" | "whisper" | "letter" | "chat",
      author = "Anonymous Soul",
      location = "Unknown Location",
      storyTitle = "Untitled"
    ): Promise<GuardianInspectionResult> => {
      // 1. Check if user is already in a 24-hour timeout/cooldown
      const strikeState: StrikeState = getStrikeState();
      if (strikeState.isRestricted) {
        setGuardianModalState({
          isOpen: true,
          strikeLevel: 3,
          guidanceMessage:
            "Your voice is currently paused in Solas Haven to protect all visiting souls from emotional harm.",
          reason: "Active 24-hour restriction.",
          remainingMs: strikeState.remainingMs,
        });
        return { passed: false, action: "BLOCK" };
      }

      setIsInspecting(true);

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "guardian_inspect",
            text,
            context,
            author,
            location,
          }),
        });

        if (!res.ok) {
          // If network / API error, allow but do not crash the user
          setIsInspecting(false);
          return { passed: true, action: "ALLOW" };
        }

        const data = await res.json();
        const action = data.action || "ALLOW";
        const classification = data.classification || "CLEAN";
        const guidanceMessage = data.guidanceMessage;
        const disclaimerNote = data.disclaimerNote;
        const reason = data.reason;

        // Action: BLOCK (Bullying / Targeted Malice)
        if (action === "BLOCK" || classification === "MALICIOUS_HARM") {
          const { newCount } = recordStrike();
          logGuardianIncident({
            origin: context,
            type: "BULLYING_STRIKE",
            author,
            location,
            excerpt: text.slice(0, 140) + (text.length > 140 ? "..." : ""),
            verdict: `Strike ${newCount} issued. Malicious/bullying speech blocked.`,
            strikeLevel: newCount,
          });

          setGuardianModalState({
            isOpen: true,
            strikeLevel: newCount,
            guidanceMessage:
              guidanceMessage ||
              "Solas Haven is dedicated to reverence and healing. Hostility and hurtful language toward others are strictly forbidden.",
            reason: reason || "Detected hostile language or personal attack.",
            remainingMs: newCount >= 3 ? 24 * 60 * 60 * 1000 : undefined,
          });

          setIsInspecting(false);
          return { passed: false, action: "BLOCK", guidanceMessage, reason };
        }

        // Action: REQUIRE_DISCLAIMER (Dark Confessions, Murder/Crime recounts, Extreme Trauma)
        if (action === "REQUIRE_DISCLAIMER" || classification === "DEEP_CONFESSION") {
          logGuardianIncident({
            origin: context,
            type: "DARK_CONFESSION_DISCLAIMER",
            author,
            location,
            excerpt: text.slice(0, 140) + (text.length > 140 ? "..." : ""),
            verdict: "Heavy moral / historical recount. Prompts author voluntary liability acknowledgment.",
          });

          setIsInspecting(false);
          return {
            passed: false,
            action: "REQUIRE_DISCLAIMER",
            disclaimerNote:
              disclaimerNote ||
              "This chronicle touches on deep moral, historical, or sensitive confessions. Published under sole voluntary author responsibility.",
            reason,
          };
        }

        // Action: ALLOW
        setIsInspecting(false);
        return { passed: true, action: "ALLOW" };
      } catch (err) {
        console.warn("Guardian inspect error:", err);
        setIsInspecting(false);
        return { passed: true, action: "ALLOW" };
      }
    },
    []
  );

  const closeGuardianModal = () => {
    setGuardianModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const closeDisclaimerModal = () => {
    setDisclaimerModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const promptDisclaimer = (
    storyTitle: string,
    disclaimerNote: string | null | undefined,
    onConfirm: () => void
  ) => {
    setDisclaimerModalState({
      isOpen: true,
      storyTitle,
      disclaimerNote,
      pendingConfirm: onConfirm,
    });
  };

  return {
    inspect,
    isInspecting,
    guardianModalState,
    closeGuardianModal,
    disclaimerModalState,
    closeDisclaimerModal,
    promptDisclaimer,
  };
}
