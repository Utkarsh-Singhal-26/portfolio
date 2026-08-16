"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useCallback, useRef, useSyncExternalStore } from "react";

import { setThemeAtPointer, setThemeWithTransition } from "@/lib/theme-transition";

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number;
}

export const ThemeToggle = ({
    className,
    duration = 600,
    ...props
}: ThemeToggleProps) => {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );
    const buttonRef = useRef<HTMLButtonElement>(null);

    const isDark = resolvedTheme === "dark";

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return;

        const next = isDark ? "light" : "dark";
        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect();
        await setThemeWithTransition(
            next,
            { x: left + width / 2, y: top + height / 2 },
            setTheme,
            duration
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
                <SunIcon size={20} weight="light" />
            ) : (
                <MoonIcon size={20} weight="light" />
            )}
        </button>
    );
};

export async function toggleThemeFromPointer(
    isDark: boolean,
    setTheme: (theme: string) => void
) {
    await setThemeAtPointer(isDark ? "light" : "dark", setTheme);
}
