"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function CtaLink({
    href,
    children,
    external,
    className,
}: {
    href: string;
    children: ReactNode;
    external?: boolean;
    className?: string;
}) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 160, damping: 18 });
    const springY = useSpring(y, { stiffness: 160, damping: 18 });

    const pull = (event: PointerEvent<HTMLAnchorElement>) => {
        const b = event.currentTarget.getBoundingClientRect();
        x.set(((event.clientX - b.left) / b.width - 0.5) * 12);
        y.set(((event.clientY - b.top) / b.height - 0.5) * 12);
    };

    return (
        <motion.a
            href={href}
            style={{ x: springX, y: springY }}
            onPointerMove={pull}
            onPointerLeave={() => {
                x.set(0);
                y.set(0);
            }}
            className={cn(
                "cursor-target group inline-flex items-center gap-3 rounded-full bg-foreground py-1.5 pr-1.5 pl-5 text-sm font-medium tracking-tight text-background whitespace-nowrap active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                className
            )}
            {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
        >
            {children}
            <span className="flex size-8 items-center justify-center rounded-full bg-background/15 transition-transform duration-300 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <ArrowUpRight size={16} weight="light" />
            </span>
        </motion.a>
    );
}
