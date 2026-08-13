"use client";

import { AnimatedText, MovingElement, ThemeToggle } from "@/components/navbar";

const LINKS = [
    { href: "/#work", label: "work" },
    { href: "/#experience", label: "experience" },
    { href: "/#open-source", label: "source" },
] as const;

export function Navbar() {
    return (
        <header className="rule-b sticky top-0 z-40 flex h-14 items-center justify-between bg-background/80 px-5 backdrop-blur-xl sm:px-6">
            <MovingElement
                href="/"
                ariaLabel="Navigate to home"
                className="px-1 font-semibold text-[17px] tracking-tight"
            >
                utkarsh.
            </MovingElement>

            <nav className="flex items-center gap-1 sm:gap-2">
                <ul className="flex items-center">
                    {LINKS.map((link) => (
                        <li key={link.href}>
                            <AnimatedText href={link.href}>
                                {link.label}
                            </AnimatedText>
                        </li>
                    ))}
                </ul>
                <ThemeToggle className="ml-1 rounded-full p-2 hover:bg-foreground/5" />
            </nav>
        </header>
    );
}
