import { LibraryBook } from "./types";
import { THE_PROPHET } from "./books/theProphet";
import { MEDITATIONS } from "./books/meditations";
import { LETTERS_TO_A_YOUNG_POET } from "./books/lettersToAYoungPoet";
import { ON_THE_SHORTNESS_OF_LIFE } from "./books/onTheShortnessOfLife";
import { A_CONFESSION } from "./books/aConfession";
import { GITANJALI } from "./books/gitanjali";
import { TAO_TE_CHING } from "./books/taoTeChing";
import { WHITE_NIGHTS } from "./books/whiteNights";

export type { LibraryBook, LibraryChapter } from "./types";

export const LIBRARY_BOOKS: LibraryBook[] = [
  THE_PROPHET,
  MEDITATIONS,
  LETTERS_TO_A_YOUNG_POET,
  ON_THE_SHORTNESS_OF_LIFE,
  A_CONFESSION,
  GITANJALI,
  TAO_TE_CHING,
  WHITE_NIGHTS,
];

export const LIBRARY_CATEGORIES = [
  "All",
  "Love, Grief & The Soul",
  "Stoic Calm & Resilience",
  "Solitude, Art & Unspoken Longing",
  "Grief, Time & Mortality",
  "Existential Despair & Confession",
  "Silent Prayers & Spiritual Solace",
  "Stillness, Harmony & Letting Go",
  "Unrequited Love & Midnight Loneliness",
];

export function getBookBySlug(slug: string): LibraryBook | undefined {
  return LIBRARY_BOOKS.find((book) => book.slug === slug);
}

export function getRelatedBooks(currentSlug: string, limit = 3): LibraryBook[] {
  const current = getBookBySlug(currentSlug);
  if (!current) return LIBRARY_BOOKS.slice(0, limit);

  const others = LIBRARY_BOOKS.filter((b) => b.slug !== currentSlug);
  return others.slice(0, limit);
}

export function searchBooks(query: string): LibraryBook[] {
  const q = query.toLowerCase().trim();
  if (!q) return LIBRARY_BOOKS;

  return LIBRARY_BOOKS.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.quote.toLowerCase().includes(q)
  );
}
