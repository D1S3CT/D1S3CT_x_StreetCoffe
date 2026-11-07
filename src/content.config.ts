import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({
    base: "./src/content/articles",
    pattern: "**/*.md",
  }),

  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    category: z.string(),
    description: z.string(),
    date: z.string().optional(),
    readingTime: z.string().optional(),
    heroImage: z.string().optional(),
    promoImage: z.string().optional(),
  }),
});

export const collections = {
  articles,
};