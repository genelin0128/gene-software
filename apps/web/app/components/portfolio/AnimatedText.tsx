/**
 * AnimatedText.tsx
 *
 * Text animation components for hero section and headings
 * Features: Character-by-character animation, gradient text, typewriter effect
 *
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  isDark: boolean;
}

/**
 * Typewriter effect component that cycles through multiple texts
 */
export function TypewriterText({ texts, className = '', isDark }: TypewriterTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];
    if (!currentText) return;

    const typeSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts]);

  return (
    <span className={className}>
      <span className={isDark ? 'text-[#9acdc4]' : 'text-[#28544b]'}>
        {displayText}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className={isDark ? 'text-[#9acdc4]' : 'text-[#28544b]'}
      >
        │
      </motion.span>
    </span>
  );
}

interface SectionHeadingProps {
  title: string;
  highlightColor: string;
  isDark: boolean;
}

/**
 * Section heading with animated underline
 */
export function SectionHeading({ title, highlightColor, isDark }: SectionHeadingProps) {
  const words = title.split(' ');
  const lastWord = words.pop();
  const firstWords = words.join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-10 sm:mb-14"
    >
      <h2 className="text-3xl sm:text-5xl font-bold mb-4">
        <span className={isDark ? 'text-white' : 'text-slate-800'}>
          {firstWords}{' '}
        </span>
        <span className={highlightColor}>{lastWord}</span>
      </h2>

      {/* Animated underline */}
      <motion.div
        className="flex justify-center mt-4"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className={`h-1 w-20 rounded-full ${isDark ? 'bg-[#6fa79b]' : 'bg-[#2f7f74]'}`} />
      </motion.div>
    </motion.div>
  );
}
