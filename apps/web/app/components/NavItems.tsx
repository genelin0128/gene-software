// app/components/NavItems.tsx
// Renders the primary navigation items explicitly (no .map()).
// Each item uses <Rotating3DText> as the visible label.
// - Desktop (>= sm): items inline
// - Mobile (< sm): items stacked
// A11y: each Link includes a sr-only fallback text.

import Link from "next/link";
import Rotating3DText from "@/app/components/Rotating3DText";

type Props = {
    /** "desktop" (top bar >= sm) or "mobile" (sheet below for < sm). */
    variant?: "desktop" | "mobile";
    /** Optional callback to close the mobile panel after navigation. */
    onNavigate?: () => void;
};

const NavItems = ({ variant = "desktop", onNavigate }: Props) => {
    const isDesktop = variant === "desktop";

    return (
        <div
            className={
                isDesktop
                    ? "flex items-center gap-6"
                    : "flex flex-col gap-4 pt-3"
            }
        >
            {/* ABOUT */}
            <Link
                href="/about"
                onClick={onNavigate}
                aria-label="ABOUT"
                className={isDesktop ? "inline-flex items-center" : "block"}
            >
                <Rotating3DText
                    text="ABOUT"
                    backgroundColor="transparent"
                    fontColor="#ffffff"
                    width={54}
                    height={40}
                />
                <span className="sr-only">ABOUT</span>
            </Link>

            {/* WORK */}
            <Link
                href="/work"
                onClick={onNavigate}
                aria-label="WORK"
                className={isDesktop ? "inline-flex items-center" : "block"}
            >
                <Rotating3DText
                    text="WORK"
                    backgroundColor="transparent"
                    fontColor="#ffffff"
                    width={54}
                    height={40}
                />
                <span className="sr-only">WORK</span>
            </Link>

            {/* CONTACT */}
            <Link
                href="/contact"
                onClick={onNavigate}
                aria-label="CONTACT"
                className={isDesktop ? "inline-flex items-center" : "block"}
            >
                <Rotating3DText
                    text="CONTACT"
                    backgroundColor="transparent"
                    fontColor="#ffffff"
                    width={85}
                    height={40}
                />
                <span className="sr-only">CONTACT</span>
            </Link>

            {/* PROJECTS */}
            <Link
                href="/projects"
                onClick={onNavigate}
                aria-label="PROJECTS"
                className={isDesktop ? "inline-flex items-center" : "block"}
            >
                <Rotating3DText
                    text="PROJECTS"
                    backgroundColor="transparent"
                    fontColor="#ffffff"
                    width={85}
                    height={40}
                />
                <span className="sr-only">PROJECTS</span>
            </Link>
        </div>
    );
};

export default NavItems;
