"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Route change as an opaque title-block sheet: it wipes in from the left, the
// destination flips in on a split-flap board with a live counter, then it wipes
// off to the right once the new route is in place. Opaque, so the two pages are
// never visible together.

type Router = ReturnType<typeof useRouter>;
type State = {
    phase: "idle" | "in" | "out";
    target: string;
    href: string;
    router: Router | null;
    action?: () => void; // runs under the cover instead of a route change
};

const COVER_MS = 450;
const OPEN_MS = 550;
const HOLD_MS = 700; // long enough for the flaps to settle
const COUNT_MS = COVER_MS + HOLD_MS;
const FAILSAFE_MS = 6000;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const SHEETS: Record<string, string> = {
    "/": "HOME · FIG. 01",
    "/privacy": "PRIVACY · FIG. 99",
    "/activity": "ACTIVITY · FIG. 10",
    "/resume": "RESUME · FIG. 11",
    "/developers": "DEVELOPERS · FIG. 05",
    "/agent-view": "AGENT VIEW · FIG. 97",
    "/human-view": "HUMAN VIEW · FIG. 01",
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

const sweep = (el: HTMLElement | null, duration: number, easing: string) =>
    el?.animate(
        [
            { transform: "translateX(0)" },
            { transform: "translateX(calc(100vw + 4px))" },
        ],
        { duration, easing, fill: "forwards" }
    );

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

/** Run `action` under the band (same cover/hold/open as a route change). */
export function cover(label: "agent" | "human", action: () => void) {
    if (
        state.phase !== "idle" ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        action();
        return;
    }
    set({
        phase: "in",
        target: `/${label}-view`,
        href: "",
        router: null,
        action,
    });
}

/** Blueprint sheet: a giant live counter, with the command typed out beneath it. */
function Sheet({ label }: { label: string }) {
    const [word, fig = ""] = label.split(" · ");
    const [pct, setPct] = useState(0);

    useEffect(() => {
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const x = Math.min(1, (now - start) / COUNT_MS);
            setPct(Math.round(x * 100));
            if (x < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    const command = `> open ${word.toLowerCase().replace(/ /g, "-")}`;
    const typed = command.slice(
        0,
        Math.round(Math.min(1, pct / 70) * command.length)
    );

    return (
        <>
            <div className="top-5 right-5 left-5 absolute font-mono text-[11px] text-muted-foreground tabular-nums">
                <div className="bg-line mb-2 h-px">
                    <div
                        className="bg-brand h-full"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <span>SHEET · {fig}</span>
            </div>
            <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                    <div className="font-semibold text-[clamp(4rem,18vw,9rem)] tabular-nums leading-none tracking-tight">
                        {String(pct).padStart(3, "0")}
                        <span className="text-brand">%</span>
                    </div>
                    <div className="mt-4 h-[1.5em] font-mono text-[clamp(0.85rem,2.4vw,1.15rem)] text-muted-foreground">
                        {typed}
                        <span className="inline-block bg-brand ml-0.5 w-[0.55em] h-[1em] translate-y-[0.15em] animate-pulse" />
                    </div>
                </div>
            </div>
        </>
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
    const edge = useRef<HTMLSpanElement>(null);
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
        if (phase !== "in" || !box.current) return;
        let cancelled = false;
        const arrived = new Promise<void>((r) => (routed.current = r));

        sweep(edge.current, COVER_MS, "ease-in-out");
        const covered = box.current.animate(
            [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
            { duration: COVER_MS, easing: "ease-in-out", fill: "forwards" }
        ).finished;
        // Only change the page once the sheet fully covers it: pushing earlier
        // swaps (and scrolls) the page while it is still visible.
        void covered.then(() => {
            if (cancelled) return;
            if (state.router) state.router.push(state.href);
            else {
                state.action?.();
                routed.current?.();
            }
        });

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

    // Open: the sheet wipes off to the right, then the overlay is removed.
    useEffect(() => {
        if (phase !== "out") return;
        sweep(edge.current, OPEN_MS, EASE);
        void box.current
            ?.animate(
                [
                    { clipPath: "inset(0 0 0 0)" },
                    { clipPath: "inset(0 0 0 100%)" },
                ],
                { duration: OPEN_MS, easing: EASE, fill: "forwards" }
            )
            .finished.then(() => set({ phase: "idle", target: "" }));
    }, [phase]);

    // Lock scroll while the band is up.
    useEffect(() => {
        if (phase === "idle") return;
        const root = document.documentElement;
        const prev = root.style.overflow;
        const prevGutter = root.style.scrollbarGutter;
        // Hiding overflow drops a classic scrollbar and shifts the page sideways; keep its space.
        if (innerWidth > root.clientWidth)
            root.style.scrollbarGutter = "stable";
        root.style.overflow = "hidden";
        return () => {
            root.style.overflow = prev;
            root.style.scrollbarGutter = prevGutter;
        };
    }, [phase]);

    if (phase === "idle") return null;

    const label = SHEETS[target] ?? target.slice(1).toUpperCase();
    return (
        <>
            <div
                ref={box}
                aria-hidden="true"
                className="z-90 fixed inset-0 bg-background select-none"
                style={{ clipPath: "inset(0 100% 0 0)" }}
            >
                <Sheet label={label} />
            </div>
            <span
                ref={edge}
                aria-hidden="true"
                className="top-0 bottom-0 left-0 z-90 fixed bg-brand w-0.5 -translate-x-full"
            />
        </>
    );
}
