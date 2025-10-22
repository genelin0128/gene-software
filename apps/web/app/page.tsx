"use client";

import ThreeScene from "@/app/components/ThreeScene";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";

export default function Page() {
    return (
        <main className="mx-auto max-w-[1680] p-6">
            {/*<h1 className="text-3xl font-bold">Gene Software</h1>*/}
            {/*<h1 className="text-3xl font-bold">Gene</h1>*/}
            <Hero />
            <About />
            {/*<p className="mt-4 text-gray-600">Hello! This is the home page. Gene will add About/Links soon.</p>*/}
            {/*<div className="mt-8">*/}
            {/*    <ThreeScene />*/}
            {/*</div>*/}
        </main>
    );
}
