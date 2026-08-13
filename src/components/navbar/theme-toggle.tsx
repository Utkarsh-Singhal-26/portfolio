"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number;
}

export const ThemeToggle = ({
    className,
    duration = 600,
    ...props
}: ThemeToggleProps) => {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = resolvedTheme === "dark";

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return;

        const next = isDark ? "light" : "dark";
        const apply = () => {
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(next);
            document.documentElement.style.colorScheme = next;
            flushSync(() => {
                setTheme(next);
            });
        };

        if (
            !document.startViewTransition ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            apply();
            return;
        }

        const css = document.createElement("style");
        css.appendChild(
            document.createTextNode(`* { transition: none !important; }`)
        );
        document.head.appendChild(css);

        await document.startViewTransition(apply).ready;

        document.head.removeChild(css);

        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
        );

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration,
                easing: "cubic-bezier(0.32, 0.72, 0, 1)",
                pseudoElement: "::view-transition-new(root)",
            }
        );
    }, [isDark, setTheme, duration]);

    return (
        <button
            ref={buttonRef}
            type="button"
            onClick={toggleTheme}
            className={`${className} cursor-target`}
            aria-label="Toggle theme"
            {...props}
        >
            {mounted && isDark ? (
                <Sun size={20} weight="light" />
            ) : (
                <Moon size={20} weight="light" />
            )}
        </button>
    );
};
