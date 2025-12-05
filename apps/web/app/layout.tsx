import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ===============================
// Google Fonts (Geist / Geist Mono)
// ===============================
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// ===============================
// Metadata (SEO + OpenGraph)
// ===============================
export const metadata: Metadata = {
    title: "Gene Lin | Portfolio",
    description:
        "Portfolio of Gene Lin — showcasing software engineering projects, frontend development skills, and interactive UI/UX work built with React, Next.js, TypeScript, and WebGL.",

    keywords: [
        "Gene Lin",
        "Ching Yao Lin",
        "Frontend Engineer",
        "Software Engineer",
        "React Developer",
        "Next.js Developer",
        "TypeScript",
        "Web Developer Portfolio",
        "Three.js",
        "WebGL",
        "UI/UX",
        "Interactive Web",
    ],

    metadataBase: new URL("https://www.gene-software.com"),
    alternates: {
        canonical: "/",
    },

    openGraph: {
        title: "Gene Lin | Portfolio",
        description:
            "Frontend engineer portfolio showcasing React, Next.js, WebGL, and immersive UI/UX projects.",
        url: "https://www.gene-software.com",
        siteName: "Gene Lin Portfolio",
        images: [
            {
                url: "/images/avatar.jpeg",
                width: 1200,
                height: 630,
                alt: "Gene Lin Portfolio Preview",
            },
        ],
        locale: "en_US",
        type: "website",
    },
};

// ===============================
// Root Layout
// ===============================
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <head>
            {/* Dynamically update <meta name="theme-color"> based on user's saved theme */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              (function() {
                const savedTheme = localStorage.getItem('portfolio-theme');
                const isDark = savedTheme === 'dark';

                // Theme colors matching your site palette
                const darkColor = '#0a0a0f';  // Background for dark mode
                const lightColor = '#f8fafc'; // Background for light mode (Tailwind slate-50)

                const themeColor = isDark ? darkColor : lightColor;

                let meta = document.querySelector('meta[name="theme-color"]');
                if (!meta) {
                  meta = document.createElement('meta');
                  meta.name = 'theme-color';
                  document.head.appendChild(meta);
                }
                meta.setAttribute('content', themeColor);
              })();
            `,
                }}
            />
        </head>

        {/* Apply Geist fonts globally */}
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        </body>
        </html>
    );
}
