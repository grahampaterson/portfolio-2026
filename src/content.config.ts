import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    year: z.number(),
    cover: z.string(),
    url: z.string().url().optional(),
    featured: z.boolean().default(false),
    protected: z.boolean().default(false),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/glossary' }),
  schema: z
    .object({
      term: z.string(),
      // Filename within public/glossary-emoji/.
      emoji: z.string().optional(),
      emojiAlt: z.string().optional(),
    })
    .refine((data) => !data.emoji || Boolean(data.emojiAlt), {
      message: 'emojiAlt is required when emoji is set',
      path: ['emojiAlt'],
    }),
});

export const collections = { projects, glossary };
