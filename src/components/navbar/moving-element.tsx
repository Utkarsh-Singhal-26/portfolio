"use client";

import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "framer-motion";
import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

const SPRING = { stiffness: 180, damping: 22, mass: 0.35 };

export function MovingElement({
    children,
    className,
    href,
    ariaLabel,
}: {
    children: ReactNode;
    className?: string;
    href: string;
    ariaLabel: string;
}) {
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, SPRING);
    const springY = useSpring(y, SPRING);
    const external = href.startsWith("http");

    const pull = (event: PointerEvent<HTMLElement>) => {
        const b = event.currentTarget.getBoundingClientRect();
        x.set(((event.clientX - b.left) / b.width - 0.5) * 6);
        y.set(((event.clientY - b.top) / b.height - 0.5) * 6);
    };

    const classNames = cn(
        "inline-flex justify-center items-center px-2 rounded-full h-9",
        className
    );

    const link = external ? (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={classNames}
        >
            {children}
        </a>
    ) : (
        <Link href={href} aria-label={ariaLabel} className={classNames}>
            {children}
        </Link>
    );

    if (reduce) return <div className="cursor-target">{link}</div>;

    return (
        <div className="cursor-target">
            <motion.div
                onPointerMove={pull}
                onPointerLeave={() => {
                    x.set(0);
                    y.set(0);
                }}
                style={{ x: springX, y: springY }}
            >
                {link}
            </motion.div>
        </div>
    );
}
