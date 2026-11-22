"use client";

import { usePathname, useRouter } from "next/navigation";
import { type Ref, useEffect, useRef, useSyncExternalStore } from "react";

// Route change as an opaque ticker band: it grows from the middle scrolling the
// destination's name, covers the screen, then splits open once the new route is
// in place. Opaque, so the two pages are never visible together.

type Router = ReturnType<typeof useRouter>;
type State = {
    phase: "idle" | "in" | "out";
    target: string;
    href: string;
    router: Router | null;
};

const COVER_MS = 450;
const OPEN_MS = 550;
const HOLD_MS = 350; // long enough to read the name
const FAILSAFE_MS = 6000;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const SHEETS: Record<string, string> = {
    "/": "HOME · FIG. 01",
    "/privacy": "PRIVACY · FIG. 99",
    "/developers": "DEVELOPERS · FIG. 05",
};

let state: State = { phase: "idle", target: "", href: "", router: null };
const listeners = new Set<() => void>();
const set = (next: Partial<State>) => {
    state = { ...state, ...next };
    listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Only a real page change gets the band: not a hash jump, a file, or reduced motion.
const bands = (url: URL) =>
    url.pathname !== location.pathname &&
    !url.pathname.includes(".") &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Navigate with the band, or a plain push where it does not apply. */
export function go(router: Router, href: string) {
    const url = new URL(href, location.href);
    if (state.phase !== "idle" || !bands(url)) {
        router.push(href);
        return;
    }
    set({
        phase: "in",
        target: url.pathname,
        href: url.pathname + url.search + url.hash,
        router,
    });
}

const strip = (label: string) => `${label} · `.repeat(5);

function Half({
    label,
    bottom,
    ref,
}: {
    label: string;
    bottom?: boolean;
    ref: Ref<HTMLDivElement>;
}) {
    return (
        <div
            ref={ref}
            className={`absolute inset-x-0 h-1/2 overflow-hidden bg-brand ${bottom ? "bottom-0" : "top-0"}`}
        >
            <div
                className="absolute inset-x-0 h-[200%]"
                style={{ top: bottom ? "-100%" : 0 }}
            >
                <div
                    className="top-1/2 left-0 absolute flex font-mono font-semibold text-[clamp(2rem,9vw,6rem)] text-brand-foreground leading-none tracking-tight whitespace-nowrap -translate-y-1/2"
                    style={{ animation: "route-ticker 26s linear infinite" }}
                >
                    <span>{strip(label)}</span>
                    <span aria-hidden="true">{strip(label)}</span>
                </div>
            </div>
        </div>
    );
}

export function RouteBand() {
    const router = useRouter();
    const pathname = usePathname();
    const { phase, target } = useSyncExternalStore(
        subscribe,
        () => state,
        () => state
    );
    const box = useRef<HTMLDivElement>(null);
    const top = useRef<HTMLDivElement>(null);
    const bottom = useRef<HTMLDivElement>(null);
    const routed = useRef<(() => void) | null>(null);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (
                e.defaultPrevented ||
                e.button !== 0 ||
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey
            )
                return;
            const a = (e.target as Element | null)?.closest?.("a[href]");
            if (!(a instanceof HTMLAnchorElement)) return;
            if (
                (a.target && a.target !== "_self") ||
                a.hasAttribute("download")
            )
                return;
            const url = new URL(a.href, location.href);
            if (url.origin !== location.origin || !bands(url)) return;
            e.preventDefault();
            go(router, url.pathname + url.search + url.hash);
        };
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, [router]);

    // Cover while the route changes, then hold briefly and open.
    useEffect(() => {
        if (phase !== "in" || !box.current || !state.router) return;
        let cancelled = false;
        const arrived = new Promise<void>((r) => (routed.current = r));
        state.router.push(state.href);

        const covered = box.current.animate(
            [
                { clipPath: "inset(50% 0 50% 0)" },
                { clipPath: "inset(41% 0 41% 0)", offset: 0.3 },
                { clipPath: "inset(0% 0 0% 0)" },
            ],
            { duration: COVER_MS, easing: "ease-in-out", fill: "forwards" }
        ).finished;

        void Promise.race([Promise.all([covered, arrived]), sleep(FAILSAFE_MS)])
            .then(() => sleep(HOLD_MS))
            .then(() => !cancelled && set({ phase: "out" }));
        return () => {
            cancelled = true;
        };
    }, [phase]);

    useEffect(() => {
        if (phase === "in" && pathname === target) routed.current?.();
    }, [pathname, phase, target]);

    // Open: the halves split away, then the overlay is removed.
    useEffect(() => {
        if (phase !== "out") return;
        const run = (el: HTMLElement | null, to: string) =>
            el?.animate(
                [
                    { transform: "translateY(0)" },
                    { transform: `translateY(${to})` },
                ],
                { duration: OPEN_MS, easing: EASE, fill: "forwards" }
            ).finished;
        void Promise.all([
            run(top.current, "-101%"),
            run(bottom.current, "101%"),
        ]).then(() => set({ phase: "idle", target: "" }));
    }, [phase]);

    // Lock scroll while the band is up.
    useEffect(() => {
        if (phase === "idle") return;
        const root = document.documentElement;
        const prev = root.style.overflow;
        root.style.overflow = "hidden";
        return () => {
            root.style.overflow = prev;
        };
    }, [phase]);

    if (phase === "idle") return null;

    const label = SHEETS[target] ?? target.slice(1).toUpperCase();
    return (
        <div
            ref={box}
            aria-hidden="true"
            className="z-90 fixed inset-0 select-none"
            style={{ clipPath: "inset(50% 0 50% 0)" }}
        >
            <Half label={label} ref={top} />
            <Half label={label} bottom ref={bottom} />
        </div>
    );
}
