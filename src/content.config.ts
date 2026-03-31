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

export const collections = { projects };
