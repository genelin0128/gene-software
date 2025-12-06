/**
 * ContactForm.tsx
 *
 * Animated contact form with validation and submission states
 * Features: Glassmorphism design, animated button states, form validation
 *
 */

"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Send, Loader2, CheckCircle, Sparkles } from "lucide-react";

interface ContactFormProps {
    isDark: boolean;
}

type FormStatus = "idle" | "sending" | "sent" | "error";

interface FormData {
    name: string;
    email: string;
    message: string;
    company: string; // Honeypot field
}

export default function ContactForm({ isDark }: ContactFormProps) {
    const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "", company: "" });
    const [status, setStatus] = useState<FormStatus>("idle");
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        const trimmed = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
            company: formData.company.trim(),
        };

        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!trimmed.name || !trimmed.email || !trimmed.message) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        if (!emailRegex.test(trimmed.email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_CONTACT_API;
        if (!apiUrl) {
            setErrorMessage("Contact service not configured.");
            return;
        }

        setStatus("sending");

        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(trimmed),
            });

            const data = (await res.json().catch(() => null)) as { success?: boolean; error?: string } | null;

            if (!res.ok || !data?.success) {
                throw new Error(data?.error || "Failed to send message.");
            }

            setStatus("sent");
            setFormData({ name: "", email: "", message: "", company: "" });

            setTimeout(() => {
                setStatus("idle");
            }, 3000);
        } catch (err) {
            setStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const inputClasses = `
    h-12 transition-all duration-300
    ${isDark
        ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:bg-white/10"
        : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500/50"
    }
  `;

    return (
        <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="relative"
        >
            {/* Honeypot field for bots */}
            <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
            />

            {/* Background glow */}
            <div
                className={`absolute inset-0 rounded-2xl blur-2xl ${isDark ? "bg-gradient-to-r from-cyan-500/5 to-emerald-500/5" : "bg-gradient-to-r from-emerald-500/5 to-cyan-500/5"}`} />

            <div
                className={`relative p-8 rounded-2xl space-y-6 ${isDark ? "bg-white/5 backdrop-blur-sm border border-white/10" : "bg-white border border-slate-200 shadow-lg"}`}>
                {/* Decorative corner sparkles */}
                <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <Sparkles className={`w-6 h-6 ${isDark ? "text-cyan-400/50" : "text-emerald-400/50"}`} />
                </motion.div>

                {/* Form fields */}
                <div className="grid sm:grid-cols-2 gap-6">
                    <motion.div
                        className="space-y-2"
                        animate={{ scale: focusedField === "name" ? 1.02 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <label className={`text-sm font-medium ${isDark ? "text-white/70" : "text-slate-600"}`}>
                            Name
                        </label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Your name"
                            className={inputClasses}
                            required
                        />
                    </motion.div>

                    <motion.div
                        className="space-y-2"
                        animate={{ scale: focusedField === "email" ? 1.02 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <label className={`text-sm font-medium ${isDark ? "text-white/70" : "text-slate-600"}`}>
                            Email
                        </label>
                        <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="you@example.com"
                            className={inputClasses}
                            required
                        />
                    </motion.div>
                </div>

                <motion.div
                    className="space-y-2"
                    animate={{ scale: focusedField === "message" ? 1.01 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <label className={`text-sm font-medium ${isDark ? "text-white/70" : "text-slate-600"}`}>
                        Message
                    </label>
                    <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Tell me about your project..."
                        className={`min-h-[150px] resize-none transition-all duration-300 ${isDark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:bg-white/10" : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500/50"}`}
                        required
                    />
                </motion.div>

                {errorMessage && (
                    <div className="text-sm text-red-500">
                        {errorMessage}
                    </div>
                )}

                {/* Submit button with animated states */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        type="submit"
                        disabled={status !== "idle"}
                        className={`w-full h-12 font-medium transition-all duration-500 relative overflow-hidden ${status === "sent" ? "bg-green-500 hover:bg-green-500" : "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400"} text-white disabled:opacity-80`}
                    >
                        {/* Button content based on status */}
                        <motion.span
                            className="flex items-center justify-center gap-2"
                            initial={false}
                            animate={{ y: status === "idle" ? 0 : -40, opacity: status === "idle" ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Send className="w-4 h-4" />
                            Send Message
                        </motion.span>

                        <motion.span
                            className="absolute inset-0 flex items-center justify-center gap-2"
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: status === "sending" ? 0 : 40, opacity: status === "sending" ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                        </motion.span>

                        <motion.span
                            className="absolute inset-0 flex items-center justify-center gap-2"
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: status === "sent" ? 0 : 40, opacity: status === "sent" ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CheckCircle className="w-4 h-4" />
                            Message Sent!
                        </motion.span>

                        {/* Success ripple effect */}
                        {status === "sent" && (
                            <motion.div
                                className="absolute inset-0 bg-white/20 rounded-lg"
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.6 }}
                            />
                        )}
                    </Button>
                </motion.div>
            </div>
        </motion.form>
    );
}
