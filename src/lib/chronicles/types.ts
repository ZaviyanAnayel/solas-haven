export interface ChronicleArticle {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  category: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  sections: {
    heading?: string;
    paragraphs: string[];
  }[];
}
