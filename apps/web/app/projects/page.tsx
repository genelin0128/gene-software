import Link from "next/link";
import Image from "next/image";
import { readAllProjects } from "@/lib/projects";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
    const projects = readAllProjects();
    return (
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="text-2xl font-semibold mb-4">Projects</h1>
            <ul className="space-y-6">
                {projects.map(p => (
                    <li key={p.slug} className="border rounded-lg p-4 hover:shadow-sm transition">
                        <Link href={`/projects/${p.slug}`} className="block">
                            <div className="flex items-center gap-4">
                                {p.heroImage ? (
                                    <Image src={p.heroImage} alt={p.title} width={64} height={64} />
                                ) : null}
                                <div>
                                    <h2 className="text-lg font-medium">{p.title}</h2>
                                    <p className="text-sm text-gray-600">{p.summary}</p>
                                    <p className="mt-1 text-xs text-gray-500">{p.publishedAt}</p>
                                </div>
                            </div>
                            {p.tags?.length ? (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {p.tags.map(t => (
                                        <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>
                                    ))}
                                </div>
                            ) : null}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
