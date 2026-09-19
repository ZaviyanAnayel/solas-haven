// Solas Sentinel Guardian Engine & Operator Intelligence System
// Developed for Solas Haven • Operated by Zaviyan (business@zaviyanllc.com)

export interface GuardianIncident {
  id: string;
  timestamp: number;
  origin: "story" | "whisper" | "letter" | "chat";
  type: "BULLYING_STRIKE" | "HARSH_SPEECH" | "DARK_CONFESSION_DISCLAIMER";
  author: string;
  location: string;
  excerpt: string;
  verdict: string;
  strikeLevel?: number;
  isReadByOperator: boolean;
}

export interface StrikeState {
  count: number;
  lastStrikeAt: number;
  isRestricted: boolean;
  remainingMs: number;
}

const STRIKES_KEY = "solas_guardian_strikes_v1";
const INCIDENTS_KEY = "solas_guardian_intel_logs_v1";
const OPERATOR_NOTIFIED_KEY = "solas_operator_last_notified_v1";
const RESTRICTION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Default seed logs for creator preview
const SEED_INCIDENTS: GuardianIncident[] = [
  {
    id: "inc-seed-01",
    timestamp: Date.now() - 1000 * 60 * 42, // 42 mins ago
    origin: "story",
    type: "DARK_CONFESSION_DISCLAIMER",
    author: "Anonymous Soul",
    location: "Chicago, Illinois",
    excerpt: "I was present during the night of the incident twenty years ago. The guilt has eaten away at my bones...",
    verdict: "Heavy moral & historical trauma recount. Retained in sanctuary under voluntary author legal disclaimer.",
    isReadByOperator: false,
  },
  {
    id: "inc-seed-02",
    timestamp: Date.now() - 1000 * 60 * 115, // ~2 hours ago
    origin: "whisper",
    type: "BULLYING_STRIKE",
    author: "Unknown Guest",
    location: "London, United Kingdom",
    excerpt: "You deserve to suffer for what you felt, get over yourself you pathetic...",
    verdict: "Targeted malicious attack against another grieving visitor. Blocked immediately and Strike 1 issued.",
    strikeLevel: 1,
    isReadByOperator: false,
  },
];

export function getStrikeState(): StrikeState {
  if (typeof window === "undefined") {
    return { count: 0, lastStrikeAt: 0, isRestricted: false, remainingMs: 0 };
  }

  try {
    const raw = localStorage.getItem(STRIKES_KEY);
    if (!raw) return { count: 0, lastStrikeAt: 0, isRestricted: false, remainingMs: 0 };

    const parsed = JSON.parse(raw);
    const count = Number(parsed.count) || 0;
    const lastStrikeAt = Number(parsed.lastStrikeAt) || 0;

    // Decay strikes if more than 7 days have passed
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - lastStrikeAt > SEVEN_DAYS_MS) {
      localStorage.removeItem(STRIKES_KEY);
      return { count: 0, lastStrikeAt: 0, isRestricted: false, remainingMs: 0 };
    }

    if (count >= 3) {
      const elapsed = Date.now() - lastStrikeAt;
      if (elapsed < RESTRICTION_DURATION_MS) {
        return {
          count,
          lastStrikeAt,
          isRestricted: true,
          remainingMs: RESTRICTION_DURATION_MS - elapsed,
        };
      } else {
        // Cooldown passed: reduce to 2 strikes
        const resetState = { count: 2, lastStrikeAt: Date.now() };
        localStorage.setItem(STRIKES_KEY, JSON.stringify(resetState));
        return { count: 2, lastStrikeAt: Date.now(), isRestricted: false, remainingMs: 0 };
      }
    }

    return { count, lastStrikeAt, isRestricted: false, remainingMs: 0 };
  } catch {
    return { count: 0, lastStrikeAt: 0, isRestricted: false, remainingMs: 0 };
  }
}

export function recordStrike(): { newCount: number; isRestricted: boolean } {
  if (typeof window === "undefined") return { newCount: 1, isRestricted: false };

  try {
    const current = getStrikeState();
    const newCount = Math.min(3, current.count + 1);
    const lastStrikeAt = Date.now();
    localStorage.setItem(STRIKES_KEY, JSON.stringify({ count: newCount, lastStrikeAt }));

    return {
      newCount,
      isRestricted: newCount >= 3,
    };
  } catch {
    return { newCount: 1, isRestricted: false };
  }
}

export function resetStrikes(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STRIKES_KEY);
  } catch {}
}

export function getGuardianIncidents(): GuardianIncident[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(INCIDENTS_KEY);
    if (!raw) {
      // Initialize with seed incidents on first load
      localStorage.setItem(INCIDENTS_KEY, JSON.stringify(SEED_INCIDENTS));
      return SEED_INCIDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function logGuardianIncident(
  incident: Omit<GuardianIncident, "id" | "timestamp" | "isReadByOperator">
): GuardianIncident {
  const newIncident: GuardianIncident = {
    ...incident,
    id: `inc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    isReadByOperator: false,
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getGuardianIncidents();
      const updated = [newIncident, ...existing].slice(0, 50); // keep last 50
      localStorage.setItem(INCIDENTS_KEY, JSON.stringify(updated));

      // Dispatch custom event for real-time UI pulse update
      window.dispatchEvent(new CustomEvent("solas-guardian-incident-logged", { detail: newIncident }));
    } catch {}
  }

  return newIncident;
}

export function getUnreadIncidentCount(): number {
  const list = getGuardianIncidents();
  return list.filter((i) => !i.isReadByOperator).length;
}

export function markIncidentsRead(): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getGuardianIncidents();
    const updated = existing.map((i) => ({ ...i, isReadByOperator: true }));
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(updated));
    localStorage.setItem(OPERATOR_NOTIFIED_KEY, Date.now().toString());
    window.dispatchEvent(new CustomEvent("solas-guardian-incidents-read"));
  } catch {}
}

export function clearGuardianIncidents(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent("solas-guardian-incidents-read"));
  } catch {}
}
