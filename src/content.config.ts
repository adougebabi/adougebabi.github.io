import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      // 支持本地图片或外部 URL
      heroImage: z.union([image(), z.string()]).optional(),
      tags: z.array(z.string()).optional(),
      category: z.union([z.string(), z.array(z.string())]).optional(),
      draft: z.boolean().optional(),
    }),
});

export const collections = { blog };
