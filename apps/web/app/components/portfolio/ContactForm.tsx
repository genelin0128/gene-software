/**
 * ContactForm.tsx
 *
 * Animated contact form with validation and submission states
 * Features: Glassmorphism design, animated button states, form validation
 *
 */

"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Send, Loader2, CheckCircle, Sparkles } from "lucide-react";

interface ContactFormProps {
    isDark: boolean;
}

type FormStatus = "idle" | "sending" | "sent" | "error" | "cooldown";

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
    const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
    const [isCooldownError, setIsCooldownError] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const apiUrl = process.env.NEXT_PUBLIC_CONTACT_API;

    // Cooldown countdown timer (for rate limiting feedback)
    useEffect(() => {
        if (cooldownSeconds <= 0) return;
        const timer = setInterval(() => {
            setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldownSeconds]);

    // Clear the rate-limit message when cooldown finishes
    useEffect(() => {
        if (cooldownSeconds === 0 && isCooldownError) {
            setErrorMessage(null);
            setIsCooldownError(false);
            setStatus((prev) => (prev === "cooldown" ? "idle" : prev));
        }
    }, [cooldownSeconds, isCooldownError]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsCooldownError(false);

        const trimmed = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
            company: formData.company.trim(),
        };

        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!trimmed.name || !trimmed.email || !trimmed.message) {
            setErrorMessage("Please fill in all required fields.");
            setIsCooldownError(false);
            return;
        }

        if (!emailRegex.test(trimmed.email)) {
            setErrorMessage("Please enter a valid email address.");
            setIsCooldownError(false);
            return;
        }

        if (!apiUrl) {
            setErrorMessage("Contact service not configured.");
            setIsCooldownError(false);
            return;
        }

        if (cooldownSeconds > 0) {
            setErrorMessage("You're sending messages too quickly.");
            setIsCooldownError(true);
            setStatus("cooldown");
            return;
        }

        setStatus("sending");

        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(trimmed),
            });

            const data = (await res.json().catch(() => null)) as { success?: boolean; error?: string; retryAfter?: number } | null;

            if (!res.ok || !data?.success) {
                if (res.status === 429 && typeof data?.retryAfter === "number") {
                    const wait = Math.max(0, Math.round(data.retryAfter));
                    setCooldownSeconds(wait);
                    setStatus("cooldown");
                    setErrorMessage("You're sending messages too quickly.");
                    setIsCooldownError(true);
                    return;
                }
                throw new Error(data?.error || "Failed to send message.");
            }

            setStatus("sent");
            setFormData({ name: "", email: "", message: "", company: "" });
            setIsCooldownError(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);

            setTimeout(() => {
                setStatus("idle");
            }, 3000);
        } catch (err) {
            setStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setIsCooldownError(false);
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
        <>
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
                    disabled={status === "sending" || status === "sent" || status === "cooldown" || cooldownSeconds > 0}
                    className={`w-full h-12 font-medium transition-all duration-500 relative overflow-hidden ${status === "sent" ? "bg-green-500 hover:bg-green-500" : "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400"} text-white disabled:opacity-80`}
                >
                    {/* Button content based on status */}
                    <motion.span
                        className="flex items-center justify-center gap-2"
                        initial={false}
                        animate={{
                            y: status === "idle" && cooldownSeconds === 0 ? 0 : -40,
                            opacity: status === "idle" && cooldownSeconds === 0 ? 1 : 0
                        }}
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

                    <motion.span
                        className="absolute inset-0 flex items-center justify-center gap-2"
                        initial={{ y: 40, opacity: 0 }}
                        animate={{
                            y: status === "cooldown" || cooldownSeconds > 0 ? 0 : 40,
                            opacity: status === "cooldown" || cooldownSeconds > 0 ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Retry in {cooldownSeconds}s
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

            {/* Success toast (bottom-right) */}
            <div className="pointer-events-none fixed bottom-6 right-6 z-50">
                <motion.div
                    initial={{ x: 200, opacity: 0 }}
                    animate={showToast ? { x: 0, opacity: 1 } : { x: 200, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className={`pointer-events-auto w-80 rounded-2xl px-4 py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.4)] backdrop-blur-sm border ${
                        isDark
                            ? "bg-gradient-to-r from-cyan-600/20 via-emerald-500/15 to-cyan-500/20 border-white/10 text-white"
                            : "bg-gradient-to-r from-white via-emerald-50 to-cyan-50 border-emerald-100 text-slate-900"
                    }`}
                >
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <div
                                className={`h-2.5 w-2.5 rounded-full ${
                                    isDark ? "bg-emerald-300 shadow-[0_0_0_6px_rgba(52,211,153,0.15)]" : "bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]"
                                }`}
                            />
                            <div className="font-semibold tracking-tight leading-tight">Message received</div>
                        </div>
                        <div className={`text-sm ${isDark ? "text-white/80" : "text-slate-600"}`}>
                            Thanks! Gene got your message and will reply soon.
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
