"use client";

import { Moon, Sun } from "lucide-react";
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
    const [isDark, setIsDark] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        updateTheme();
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return;

        if (!document.startViewTransition) {
            const newTheme = !isDark;
            setIsDark(newTheme);
            document.documentElement.classList.toggle("dark", newTheme);
            localStorage.setItem("theme", newTheme ? "dark" : "light");
            return;
        }

        const css = document.createElement("style");
        css.appendChild(
            document.createTextNode(`* { transition: none !important; }`)
        );
        document.head.appendChild(css);

        await document.startViewTransition(() => {
            flushSync(() => {
                const newTheme = !isDark;
                setIsDark(newTheme);

                document.documentElement.classList.toggle("dark", newTheme);
                localStorage.setItem("theme", newTheme ? "dark" : "light");

                void window.getComputedStyle(document.body).opacity;
            });
        }).ready;

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
                easing: "ease-in-out",
                pseudoElement: "::view-transition-new(root)",
            }
        );
    }, [isDark, duration]);

    return (
        <button
            ref={buttonRef}
            onClick={toggleTheme}
            className={`${className} cursor-pointer`}
            aria-label="Toggle theme"
            {...props}
        >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
    );
};
