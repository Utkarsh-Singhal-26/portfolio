"use client";

import { AnimatedText } from "@/components/layout/animated-text";
import { MovingElement } from "@/components/ui/moving-element";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const LINKS = [
    { href: "/#work", label: "work" },
    { href: "/#experience", label: "experience" },
    { href: "/#open-source", label: "open-source" },
] as const;

export function Navbar() {
    return (
        <header className="top-0 z-40 sticky flex justify-between items-center bg-background/80 backdrop-blur-xl px-5 sm:px-6 h-14 rule-b">
            <MovingElement
                href="/"
                ariaLabel="utkarsh. - Navigate to home"
                className="px-2 font-semibold text-[17px] tracking-tight"
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
                <ThemeToggle className="hover:bg-foreground/5 ml-1 p-2 rounded-full" />
            </nav>
        </header>
    );
}
