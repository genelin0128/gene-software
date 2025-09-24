import { Project, ProjectSchema } from "./types";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "projects");

export function readAllProjectSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function readProject(slug: string): Project | null {
  const file = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const json = JSON.parse(raw);
  const parsed = ProjectSchema.safeParse(json);
  if (!parsed.success) {
    console.error("Invalid project json:", slug, parsed.error.format());
    return null;
  }
  return parsed.data;
}

export function readAllProjects(): Project[] {
  return readAllProjectSlugs()
    .map((s) => readProject(s))
    .filter((p): p is Project => Boolean(p));
}
