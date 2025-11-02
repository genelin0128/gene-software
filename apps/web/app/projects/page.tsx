import Link from "next/link";

export default function ProjectsPage() {
    return (
        <main className="mx-auto max-w-[1680] p-6">
            <h1 className="text-3xl font-bold mb-6">Projects</h1>
            <ul className="space-y-3">
                <li className="border p-4 rounded-lg">
                    <h2 className="font-semibold">Cardz</h2>
                    <Link href="https://cardz.surge.sh/" className="text-blue-600 underline">View →</Link>
                </li>
            </ul>
        </main>
    );
}