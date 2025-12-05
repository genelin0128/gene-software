/**
 * SocialLinks.tsx
 *
 * Animated social media links component
 * Features: Hover animations, tooltip labels, icon bounce effects
 *
 */

"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Mail, LucideIcon } from "lucide-react";

interface SocialLink {
    icon: LucideIcon;
    href: string;
    label: string;
    hoverColor: string;
}

const socialLinks: SocialLink[] = [
    {
        icon: Github,
        href: "https://github.com/genelin0128",
        label: "GitHub",
        hoverColor: "hover:bg-gray-700 hover:border-gray-600",
    },
    {
        icon: Linkedin,
        href: "https://www.linkedin.com/in/gene0128/",
        label: "LinkedIn",
        hoverColor: "hover:bg-blue-600 hover:border-blue-500",
    },
    {
        icon: Instagram,
        href: "https://www.instagram.com/geneeeeeelin/",
        label: "Instagram",
        hoverColor: "hover:bg-pink-500 hover:border-pink-400",
    },
    {
        icon: Mail,
        href: "mailto:genelin@gene-software.com",
        label: "Email",
        hoverColor: "hover:bg-red-500 hover:border-red-400",
    },
];

const sizeClasses: Record<string, string> = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
};

const iconSizes: Record<string, string> = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
};

interface SocialLinksProps {
    isDark: boolean;
    size?: "sm" | "md" | "lg";
    showLabels?: boolean;
}

export default function SocialLinks({ isDark, size = "md", showLabels = false }: SocialLinksProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1] as const,
            },
        },
    };

    return (
        <motion.div
            className="flex items-center justify-center gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                    <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={itemVariants}
                        whileHover={{ y: -4, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`group relative ${sizeClasses[size]} rounded-full transition-all duration-300 ${isDark ? `bg-white/5 border border-white/10 ${social.hoverColor}` : `bg-white border border-slate-200 shadow-sm ${social.hoverColor}`}`}
                        aria-label={social.label}
                    >
                        {/* Icon */}
                        <IconComponent
                            className={`${iconSizes[size]} transition-colors duration-300 ${isDark ? "text-white/70 group-hover:text-white" : "text-slate-600 group-hover:text-white"}`} />

                        {/* Tooltip */}
                        {showLabels && (
                            <span
                                className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "bg-white/10 text-white backdrop-blur-sm" : "bg-slate-800 text-white"}`}>
                {social.label}
              </span>
                        )}

                        {/* Ripple effect on hover */}
                        <motion.span
                            className="absolute inset-0 rounded-full bg-white/20"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />
                    </motion.a>
                );
            })}
        </motion.div>
    );
}
