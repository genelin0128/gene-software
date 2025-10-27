"use client";

import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Projects from "@/app/components/Projects";

export default function Page() {
    return (
        <main className="mx-auto max-w-[1680] p-6">
            <Hero />
            <About />
            <Projects />
        </main>
    );
}
