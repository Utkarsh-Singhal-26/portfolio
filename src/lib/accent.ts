import { useSyncExternalStore } from "react";

export const ACCENTS = [
    "teal",
    "byzantium",
    "falu",
    "fulvous",
    "glaucous",
    "xanadu",
] as const;
export const ACCENT_HEX: Record<
    (typeof ACCENTS)[number],
    { light: string; dark: string }
> = {
    teal: { light: "#2F746B", dark: "#49AB9E" },
    byzantium: { light: "#863277", dark: "#C86AB7" },
    falu: { light: "#9D2525", dark: "#D85A5A" },
    fulvous: { light: "#8B5B18", dark: "#DC9738" },
    glaucous: { light: "#3D5D85", dark: "#7395BF" },
    xanadu: { light: "#516757", dark: "#819C89" },
};

export type Accent = (typeof ACCENTS)[number];

const EVENT = "accent-change";

export function setAccent(name: Accent) {
    document.documentElement.dataset.accent = name;
    try {
        localStorage.setItem("accent", name);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
}

export function useAccent(): Accent {
    return useSyncExternalStore(
        (cb) => {
            window.addEventListener(EVENT, cb);
            return () => window.removeEventListener(EVENT, cb);
        },
        () => {
            const v = document.documentElement.dataset.accent as Accent;
            return ACCENTS.includes(v) ? v : ACCENTS[0];
        },
        () => ACCENTS[0]
    );
}

export const accentSwatchStyle = {
    backgroundColor:
        "hsl(var(--hue) calc(var(--sd) * 1%) calc(var(--ld) * 1%))",
};
