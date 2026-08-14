"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Reveal({
    children,
    className,
    delay = 0,
    eager = false,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
    /** Skip initial hidden state for above-the-fold / LCP-critical content */
    eager?: boolean;
}) {
    const reduce = useReducedMotion();
    const skipHide = reduce || eager;

    return (
        <motion.div
            className={cn(className)}
            initial={skipHide ? false : { opacity: 0, y: 20 }}
            whileInView={skipHide ? undefined : { opacity: 1, y: 0 }}
            viewport={skipHide ? undefined : { once: true, amount: 0.2 }}
            transition={
                skipHide
                    ? undefined
                    : {
                          duration: 0.7,
                          delay,
                          ease: [0.16, 1, 0.3, 1],
                      }
            }
        >
            {children}
        </motion.div>
    );
}
