export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { readAllProjectSlugs } from "@/lib/projects";

const BASE = "https://gene-software.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = readAllProjectSlugs();
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now },
    { url: `${BASE}/projects`, lastModified: now },
    ...slugs.map((s) => ({ url: `${BASE}/projects/${s}`, lastModified: now }))
  ];
}
