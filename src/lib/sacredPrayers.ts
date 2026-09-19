export interface SacredOffering {
  id: string;
  emoji: string;
  category: "solace" | "memory" | "hope";
  text: string;
}

export const SACRED_EMOJIS = [
  { emoji: "🕊️", name: "Peace Dove", category: "solace" },
  { emoji: "🕯️", name: "Vigil Candle", category: "solace" },
  { emoji: "🤍", name: "Pure Soul", category: "solace" },
  { emoji: "🪽", name: "Angel Wing", category: "solace" },
  { emoji: "🌿", name: "Olive Healing", category: "hope" },
  { emoji: "🌸", name: "Cherry Blossom", category: "memory" },
  { emoji: "🪷", name: "Sacred Lotus", category: "memory" },
  { emoji: "💐", name: "Eternity Bouquet", category: "memory" },
  { emoji: "✨", name: "Starlight", category: "hope" },
  { emoji: "🌟", name: "Guiding Star", category: "hope" },
  { emoji: "🌅", name: "Gentle Dawn", category: "hope" }
];

export const PRESET_PRAYERS: SacredOffering[] = [
  {
    id: "p1",
    emoji: "🕊️",
    category: "solace",
    text: "May light wrap around your deepest wounds and bring your heart quiet peace."
  },
  {
    id: "p2",
    emoji: "🕯️",
    category: "solace",
    text: "I am holding a vigil for your soul tonight. You are not alone in the dark."
  },
  {
    id: "p3",
    emoji: "🌸",
    category: "memory",
    text: "You were so profoundly loved, and genuine love never truly ends."
  },
  {
    id: "p4",
    emoji: "🤍",
    category: "solace",
    text: "I held your pain in my quiet prayers across the oceans tonight."
  },
  {
    id: "p5",
    emoji: "🌿",
    category: "hope",
    text: "The heavy stone in your chest will turn into light. The morning brings mercy."
  },
  {
    id: "p6",
    emoji: "🪽",
    category: "memory",
    text: "They heard every word you never got to say. Rest your tired heart."
  },
  {
    id: "p7",
    emoji: "✨",
    category: "hope",
    text: "Your courage to speak your truth has added new warmth to the cosmos."
  },
  {
    id: "p8",
    emoji: "🪷",
    category: "solace",
    text: "Forgive yourself for what you did not know how to survive back then."
  }
];

export const CELESTIAL_AFFIRMATIONS = [
  {
    title: "Your Soul's Stone Has Turned to Starlight",
    prayer: "The words you carried in secret silence have crossed the veil. You no longer need to carry this alone. The cosmos has received your truth with gentle hands. Breathe slowly; peace is entering your chest."
  },
  {
    title: "A Sacred Beacon is Born",
    prayer: "In the vastness of eternity, your sorrow and your love are now immortalized. May the pain that tore your heart open become the doorway through which divine healing enters."
  },
  {
    title: "You Are Reconciled with the Heavens",
    prayer: "Nothing genuine is ever lost. The prayers you whispered in solitude have been recorded in the living sky. Walk forward in lightness; your burden is now resting in starlight."
  }
];