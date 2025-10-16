import Navbar from "@/app/components/Navbar";
import ThreeScene from "@/app/components/ThreeScene";

export default function Page() {
    return (
        <main className="mx-auto max-w-4xl p-6">
            <Navbar />
            {/*<h1 className="text-3xl font-bold">Gene Software</h1>*/}
            <h1 className="text-3xl font-bold">Gene</h1>
            <p className="mt-4 text-gray-600">Hello! This is the home page. Gene will add About/Links soon.</p>
            <div className="mt-8">
                <ThreeScene />
            </div>
        </main>
    );
}
