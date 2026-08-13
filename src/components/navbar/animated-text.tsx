import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const DURATION = 0.28;
const STAGGER = 0.018;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function AnimatedText({
    children,
    href,
}: {
    children: string;
    href: string;
}) {
    const reduce = useReducedMotion();

    return (
        <Link
            href={href}
            aria-label={children}
            className="cursor-target relative block w-fit rounded-full px-2 py-1 text-[13px] leading-5 tracking-tight text-foreground/70 sm:px-3 sm:text-sm"
        >
            {reduce ? (
                <span>{children}</span>
            ) : (
                <motion.span
                    initial="initial"
                    whileHover="hovered"
                    className="block"
                    aria-hidden="true"
                >
                    <motion.span
                        className="absolute right-2 bottom-0.5 left-2 h-px bg-brand"
                        variants={{
                            initial: { scaleX: 0 },
                            hovered: { scaleX: 1 },
                        }}
                        style={{ originX: 0 }}
                        transition={{ duration: DURATION, ease: EASE }}
                    />

                    <span className="relative inline-block">
                        {children.split("").map((l, i) => (
                            <span
                                key={`${href}-${i}`}
                                className={
                                    l === " "
                                        ? "relative inline-block w-[0.28em] overflow-hidden"
                                        : "relative inline-block overflow-hidden"
                                }
                            >
                                <motion.span
                                    variants={{
                                        initial: { y: 0 },
                                        hovered: { y: "-100%" },
                                    }}
                                    transition={{
                                        duration: DURATION,
                                        ease: EASE,
                                        delay: i * STAGGER,
                                    }}
                                    className="block"
                                >
                                    {l === " " ? "\u00A0" : l}
                                </motion.span>
                                <motion.span
                                    variants={{
                                        initial: { y: "100%" },
                                        hovered: { y: "0%" },
                                    }}
                                    transition={{
                                        duration: DURATION,
                                        ease: EASE,
                                        delay: i * STAGGER,
                                    }}
                                    className="absolute top-0 left-0 block"
                                >
                                    {l === " " ? "\u00A0" : l}
                                </motion.span>
                            </span>
                        ))}
                    </span>
                </motion.span>
            )}
        </Link>
    );
}
