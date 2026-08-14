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
            className="inline-flex relative items-center px-2 sm:px-3 py-1 rounded-full w-fit text-[13px] text-foreground/70 sm:text-sm leading-none tracking-tight cursor-target"
        >
            {reduce ? (
                <span>{children}</span>
            ) : (
                <motion.span
                    initial="initial"
                    whileHover="hovered"
                    className="inline-flex items-center"
                    aria-hidden="true"
                >
                    <motion.span
                        className="right-2 bottom-0.5 left-2 absolute bg-brand h-px"
                        variants={{
                            initial: { scaleX: 0 },
                            hovered: { scaleX: 1 },
                        }}
                        style={{ originX: 0 }}
                        transition={{ duration: DURATION, ease: EASE }}
                    />

                    <span className="inline-block relative">
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
                                    className="block top-0 left-0 absolute"
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
