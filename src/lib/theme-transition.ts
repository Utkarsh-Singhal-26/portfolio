import { flushSync } from "react-dom";

const pointer = { x: 0, y: 0 };
let hasPointer = false;
let tracking = false;

function trackPointer() {
    if (tracking || typeof window === "undefined") return;
    tracking = true;
    const sync = (event: MouseEvent) => {
        hasPointer = true;
        pointer.x = event.clientX;
        pointer.y = event.clientY;
    };
    window.addEventListener("mousemove", sync, { passive: true });
    window.addEventListener("mousedown", sync, { passive: true });
}

export function themeTransitionOrigin(): { x: number; y: number } {
    trackPointer();
    if (!hasPointer) {
        return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        };
    }
    return { x: pointer.x, y: pointer.y };
}

export async function setThemeAtPointer(
    next: "light" | "dark",
    setTheme: (theme: string) => void,
    duration = 800
) {
    await setThemeWithTransition(
        next,
        themeTransitionOrigin(),
        setTheme,
        duration
    );
}

export async function setThemeWithTransition(
    next: "light" | "dark",
    origin: { x: number; y: number },
    setTheme: (theme: string) => void,
    duration = 800
) {
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

    const { x, y } = origin;
    const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
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
}
