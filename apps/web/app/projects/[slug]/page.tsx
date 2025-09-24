import { notFound } from "next/navigation";
import Image from "next/image";
import { readAllProjectSlugs, readProject } from "@/lib/projects";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return readAllProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = await params;                 // ← 重要：await params
  const project = readProject(slug);
  if (!project) return notFound();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">{project.title}</h1>
      <p className="text-sm text-gray-500">{project.publishedAt}</p>
      {project.heroImage ? (
        <div className="my-4">
          <Image src={project.heroImage} alt={project.title} width={960} height={540} />
        </div>
      ) : null}
      <article className="prose max-w-none">
        {project.sections?.map((sec, i) => {
          if (sec.type === "paragraph") return <p key={i}>{sec.content}</p>;
          if (sec.type === "list")
            return (
              <ul key={i} className="list-disc ml-6">
                {sec.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          if (sec.type === "code")
            return (
              <pre key={i}>
                <code>{sec.code}</code>
              </pre>
            );
          return null;
        })}
      </article>
    </main>
  );
}
