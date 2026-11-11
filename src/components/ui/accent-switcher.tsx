"use client";

import { useTheme } from "next-themes";

import {
    ACCENT_HEX,
    ACCENTS,
    accentSwatchStyle,
    setAccent,
    useAccent,
} from "@/lib/accent";

export function AccentSwitcher() {
    const current = useAccent();
    const { resolvedTheme } = useTheme();
    const hex =
        ACCENT_HEX[current][resolvedTheme === "light" ? "light" : "dark"];

    return (
        <div className="flex justify-between items-center gap-4 px-5 sm:px-6 py-4 rule-b">
            <p className="p-2 font-mono text-[12px] text-muted-foreground uppercase tracking-[0.22em]">
                Accent<span className="mx-2 text-foreground/25">/</span>
                <span className="text-foreground">{current}</span>
                <span className="mx-2 text-foreground/25">/</span>
                <span className="text-foreground normal-case tracking-normal">
                    {hex}
                </span>
            </p>
            <fieldset className="flex flex-wrap justify-end gap-2 m-0 p-0 border-0 min-w-0">
                <legend className="sr-only">Accent color</legend>
                {ACCENTS.map((name) => (
                    <button
                        key={name}
                        type="button"
                        data-accent={name}
                        onClick={() => setAccent(name)}
                        aria-label={name}
                        aria-pressed={current === name}
                        style={accentSwatchStyle}
                        className="border border-line size-7 aria-pressed:outline-2 aria-pressed:outline-foreground aria-pressed:outline-offset-2 cursor-target"
                    />
                ))}
            </fieldset>
        </div>
    );
}
