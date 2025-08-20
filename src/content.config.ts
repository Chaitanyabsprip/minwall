import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

const websites = defineCollection({
  loader: file("src/websites/websites.json"),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    url: z.string().url(),
    icon: z.string(),
  }),
});

export const collections = { websites };
