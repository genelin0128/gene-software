"use client";

import Link from "next/link";
import { useState } from "react";
import Menu3DButton from "@/app/components/Menu3DButton";
import NavItems from "@/app/components/NavItems";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center py-5 mx-auto px-4 sm:px-0">
                    <Link
                        href="/"
                        className="text-neutral-400 font-bold text-xl hover:text-white transition-colors"
                    >
                        Gene
                    </Link>

                    {/* Mobile trigger: only <sm> */}
                    <div
                        className="flex sm:hidden"
                        onClick={() => setMobileOpen((v) => !v)}
                    >
                        <Menu3DButton />
                    </div>

                    {/* Desktop nav: >=sm */}
                    <nav className="hidden sm:flex items-center gap-6">
                        <NavItems variant="desktop" />
                    </nav>
                </div>

                {/* Mobile sheet/panel: <sm> */}
                {mobileOpen && (
                    <div className="sm:hidden border-t border-white/10 bg-black/95">
                        <nav className="sticky px-4 pb-4">
                            <NavItems
                                variant="mobile"
                                onNavigate={() => setMobileOpen(false)}
                            />
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
