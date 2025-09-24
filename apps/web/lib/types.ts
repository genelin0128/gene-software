import { z } from "zod";

export const ProjectSectionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), content: z.string().min(1) }),
  z.object({ type: z.literal("list"), items: z.array(z.string().min(1)).min(1) }),
  z.object({
    type: z.literal("code"),
    language: z.string().default("text"),
    code: z.string().min(1),
  }),
]);

export const ProjectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().datetime().or(z.string().min(1)),
  heroImage: z.string().optional(),
  sections: z.array(ProjectSectionSchema).default([]),
});

export type Project = z.infer<typeof ProjectSchema>;
