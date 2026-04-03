import { motion } from "framer-motion";
import Link from "next/link";
import type React from "react";

const DURATION = 0.25;
const STAGGER = 0.025;

interface AnimatedTextProps {
    children: string;
    href: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
    children,
    href,
}) => {
    return (
        <Link
            href={href}
            className="block relative p-0 sm:px-2 sm:py-1 rounded-lg w-fit text-primary/90 text-base leading-[1.2rem] whitespace-nowrap"
        >
            <motion.span
                initial="initial"
                whileHover="hovered"
                className="block"
            >
                <motion.span
                    className="right-0 bottom-0 left-0 absolute bg-accent h-px"
                    variants={{
                        initial: { width: "0%" },
                        hovered: { width: "100%" },
                    }}
                    transition={{ duration: DURATION, ease: "easeInOut" }}
                />

                <span className="inline-block relative cursor-pointer">
                    {children.split("").map((l, i) => (
                        <span
                            key={i}
                            className="inline-block relative overflow-hidden"
                        >
                            <motion.span
                                variants={{
                                    initial: { y: 0 },
                                    hovered: { y: "-100%" },
                                }}
                                transition={{
                                    duration: DURATION,
                                    ease: "easeInOut",
                                    delay: i * STAGGER,
                                }}
                                className="block"
                            >
                                {l}
                            </motion.span>
                            <motion.span
                                variants={{
                                    initial: { y: "100%" },
                                    hovered: { y: "0%" },
                                }}
                                transition={{
                                    duration: DURATION,
                                    ease: "easeInOut",
                                    delay: i * STAGGER,
                                }}
                                className="block top-0 left-0 absolute"
                            >
                                {l}
                            </motion.span>
                        </span>
                    ))}
                </span>
            </motion.span>
        </Link>
    );
};
