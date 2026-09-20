import { LibraryBook } from "./types";
import { EPIC_OF_GILGAMESH } from "./books/gilgamesh";
import { MAXIMS_OF_PTAHHOTEP } from "./books/ptahhotep";
import { TAO_TE_CHING } from "./books/taoTeChing";
import { BHAGAVAD_GITA } from "./books/bhagavadGita";
import { DHAMMAPADA } from "./books/dhammapada";
import { APOLOGY_AND_PHAEDO } from "./books/apologyAndPhaedo";
import { ON_THE_SHORTNESS_OF_LIFE } from "./books/onTheShortnessOfLife";
import { ENCHIRIDION } from "./books/enchiridion";
import { MEDITATIONS } from "./books/meditations";
import { RUBAIYAT } from "./books/rubaiyat";
import { CONFERENCE_OF_THE_BIRDS } from "./books/conferenceOfTheBirds";
import { RUMI_MASNAVI } from "./books/rumiMasnavi";
import { SELF_RELIANCE } from "./books/selfReliance";
import { WHITE_NIGHTS } from "./books/whiteNights";
import { WALDEN } from "./books/walden";
import { A_CONFESSION } from "./books/aConfession";
import { DICKINSON_POEMS } from "./books/dickinsonPoems";
import { GITANJALI } from "./books/gitanjali";
import { THE_BROKEN_WINGS } from "./books/brokenWings";
import { THE_PROPHET } from "./books/theProphet";
import { LETTERS_TO_A_YOUNG_POET } from "./books/lettersToAYoungPoet";

export type { LibraryBook, LibraryChapter } from "./types";

export const LIBRARY_BOOKS: LibraryBook[] = [
  // Ancient Civilizations (4000 BC – 500 BC)
  EPIC_OF_GILGAMESH,
  MAXIMS_OF_PTAHHOTEP,
  TAO_TE_CHING,
  BHAGAVAD_GITA,

  // Greco-Roman & Classical Era (500 BC – 200 AD)
  DHAMMAPADA,
  APOLOGY_AND_PHAEDO,
  ON_THE_SHORTNESS_OF_LIFE,
  ENCHIRIDION,
  MEDITATIONS,

  // Persian & Sufi Golden Age (1100 AD – 1300 AD)
  RUBAIYAT,
  CONFERENCE_OF_THE_BIRDS,
  RUMI_MASNAVI,

  // Romantic, Transcendental & 19th-Century Classics
  SELF_RELIANCE,
  WHITE_NIGHTS,
  WALDEN,
  A_CONFESSION,
  DICKINSON_POEMS,

  // Early 20th-Century Public Domain Masterpieces (1900 – 1928)
  GITANJALI,
  THE_BROKEN_WINGS,
  THE_PROPHET,
  LETTERS_TO_A_YOUNG_POET,
];

export const LIBRARY_ERAS = [
  "All Eras",
  "Ancient Civilizations (4000 BC – 500 BC)",
  "Greco-Roman & Classical Wisdom",
  "Persian & Sufi Mysticism",
  "Transcendentalism & 19th-Century",
  "Early 20th-Century Masterpieces",
] as const;

export const LIBRARY_CATEGORIES = [
  "All Themes",
  "Ancient Civilizations (Mesopotamia)",
  "Ancient Civilizations (Egypt)",
  "Stillness, Harmony & Letting Go",
  "Ancient Wisdom & Spiritual Courage",
  "Ancient Wisdom & Spiritual Solace",
  "Classical Philosophy & The Immortality of the Soul",
  "Stoic Calm & Resilience",
  "Persian Mysticism & The Ephemeral Hour",
  "Persian & Sufi Mysticism",
  "Transcendentalism, Intuition & Inner Strength",
  "Unrequited Love & Midnight Loneliness",
  "Solitude, Nature & Deliberate Living",
  "Existential Despair & Confession",
  "Solitude, Grief & Unspoken Longing",
  "Silent Prayers & Spiritual Solace",
  "Unspoken Love & Poignant Grief",
  "Love, Grief & The Soul",
  "Solitude, Art & Unspoken Longing",
];

export function getBookBySlug(slug: string): LibraryBook | undefined {
  return LIBRARY_BOOKS.find((book) => book.slug === slug);
}

export function getRelatedBooks(currentSlug: string, limit = 3): LibraryBook[] {
  const current = getBookBySlug(currentSlug);
  if (!current) return LIBRARY_BOOKS.slice(0, limit);

  // Match by category or era first
  const sameCategory = LIBRARY_BOOKS.filter(
    (b) => b.slug !== currentSlug && b.category === current.category
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const others = LIBRARY_BOOKS.filter(
    (b) => b.slug !== currentSlug && b.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function searchBooks(query: string, selectedEra?: string): LibraryBook[] {
  const q = query.toLowerCase().trim();
  let pool = LIBRARY_BOOKS;

  if (selectedEra && selectedEra !== "All Eras") {
    if (selectedEra.includes("Ancient Civilizations")) {
      pool = pool.filter((b) =>
        ["the-epic-of-gilgamesh", "the-maxims-of-ptahhotep", "tao-te-ching", "the-bhagavad-gita"].includes(
          b.slug
        )
      );
    } else if (selectedEra.includes("Greco-Roman")) {
      pool = pool.filter((b) =>
        [
          "the-dhammapada",
          "apology-and-phaedo",
          "on-the-shortness-of-life",
          "the-enchiridion",
          "meditations",
        ].includes(b.slug)
      );
    } else if (selectedEra.includes("Persian & Sufi")) {
      pool = pool.filter((b) =>
        [
          "the-rubaiyat-of-omar-khayyam",
          "the-conference-of-the-birds",
          "the-masnavi-of-rumi",
        ].includes(b.slug)
      );
    } else if (selectedEra.includes("Transcendentalism")) {
      pool = pool.filter((b) =>
        [
          "self-reliance-and-nature",
          "white-nights",
          "walden-life-in-the-woods",
          "a-confession",
          "emily-dickinson-selected-poems",
        ].includes(b.slug)
      );
    } else if (selectedEra.includes("Early 20th-Century")) {
      pool = pool.filter((b) =>
        [
          "gitanjali",
          "the-broken-wings",
          "the-prophet",
          "letters-to-a-young-poet",
        ].includes(b.slug)
      );
    }
  }

  if (!q) return pool;

  return pool.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.quote.toLowerCase().includes(q)
  );
}
