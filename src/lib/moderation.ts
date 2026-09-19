// Content moderation and sacred sanctuary filter

const BANNED_PATTERNS = [
  /\b(fuck|shit|bitch|bastard|asshole|cunt|dick|whore|slut|pussy)\b/i,
  /\b(chutiya|gandu|harami|bhenchod|madarchod|kutti|kamina|randi|saale|kanjar)\b/i,
  /\b(kill\s+yourself|go\s+die|hang\s+yourself|kys)\b/i,
  /\b(https?:\/\/|www\.|\.com|\.org|\.xyz|\.net|t\.me|telegram|whatsapp)\b/i, // spam links
  /\b(casino|crypto\s+free|free\s+money|lottery|viagra)\b/i,
];

export function validateSanctuaryContent(text: string, isWhisper = false): { isClean: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { isClean: false, error: "Please enter your unspoken words." };
  }

  const trimmed = text.trim();

  if (isWhisper && trimmed.length > 180) {
    return { isClean: false, error: "A whisper must be gentle and brief (under 180 characters)." };
  }

  if (!isWhisper && trimmed.length < 10) {
    return { isClean: false, error: "A letter to eternity should be at least 10 characters." };
  }

  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isClean: false,
        error: "This sanctuary is dedicated to grief, reverence, and healing. Profanity, spam, and harmful language are not permitted."
      };
    }
  }

  return { isClean: true };
}