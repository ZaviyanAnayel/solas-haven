export interface LibraryChapter {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];
}

export interface LibraryBook {
  slug: string;
  title: string;
  author: string;
  year: string;
  translator?: string;
  category: string;
  readTime: string;
  coverGradient: string;
  accentColor: string;
  description: string;
  quote: string;
  publicDomainNotice: string;
  chapters: LibraryChapter[];
}
