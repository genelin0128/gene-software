"use client";
import { useMediaQuery } from "react-responsive";

export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
} as const;

export function useBreakpoint() {
    const sm = useMediaQuery({ maxWidth: BREAKPOINTS.sm });
    const mdUp = useMediaQuery({ minWidth: BREAKPOINTS.md });
    const lgUp = useMediaQuery({ minWidth: BREAKPOINTS.lg });
    const xlUp = useMediaQuery({ minWidth: BREAKPOINTS.xl });
    return { sm, mdUp, lgUp, xlUp };
}
