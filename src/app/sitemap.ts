import { MetadataRoute } from "next";
import { INITIAL_LETTERS } from "../lib/initialStars";
import { CHRONICLES } from "../lib/chroniclesData";
import { LIBRARY_BOOKS } from "../lib/library/libraryData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.solashaven.com";

  // Core Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/chronicles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Master Chronicles Articles
  const chronicleRoutes: MetadataRoute.Sitemap = CHRONICLES.map((article) => ({
    url: `${baseUrl}/chronicles/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Master Sanctuary Library Books
  const libraryRoutes: MetadataRoute.Sitemap = LIBRARY_BOOKS.map((book) => ({
    url: `${baseUrl}/library/${book.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // Individual Star Permalinks
  const starRoutes: MetadataRoute.Sitemap = INITIAL_LETTERS.map((star) => ({
    url: `${baseUrl}/letter/${star.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...chronicleRoutes, ...libraryRoutes, ...starRoutes];
}
