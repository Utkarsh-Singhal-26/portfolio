"use client";

import Link from "next/link";
import posthog from "posthog-js";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";

import {
    ANALYTICS_STORAGE,
    ESSENTIAL_STORAGE,
    type StorageItem,
} from "@/content/storage";
import { isTypingTarget } from "@/lib/utils";

export const CONSENT_KEY = "consent";

type Clarity = (...args: unknown[]) => void;

export function applyConsent(granted: boolean) {
    const state = granted ? "granted" : "denied";
    const w = window as unknown as { clarity?: Clarity };
    w.clarity?.("consentv2", {
        ad_Storage: state,
        analytics_Storage: state,
    });
    if (posthog.__loaded) {
        if (granted) posthog.opt_in_capturing();
        else posthog.opt_out_capturing();
    }
}

const OPEN_EVENT = "consent:open";
const CHANGE_EVENT = "consent:change";
const LEAVE_MS = 300;

/** Reopen the banner with its details showing. */
export const openConsent = () => window.dispatchEvent(new Event(OPEN_EVENT));

function subscribe(cb: () => void) {
    window.addEventListener(CHANGE_EVENT, cb);
    return () => window.removeEventListener(CHANGE_EVENT, cb);
}

function readStored() {
    try {
        return localStorage.getItem(CONSENT_KEY);
    } catch {
        return null;
    }
}

/** "granted", "denied", null (no choice yet) or "ssr" before hydration. */
export const useStoredConsent = () =>
    useSyncExternalStore(subscribe, readStored, () => "ssr");

function Rows({ rows }: { rows: StorageItem[] }) {
    return (
        <div className="divide-y divide-line">
            {rows.map(({ key, by, why, ttl }) => (
                <div
                    key={key}
                    className="gap-2 grid grid-cols-[1.2fr_1.8fr_0.7fr] px-3 py-1.5"
                >
                    <span>{key}</span>
                    <span className="text-muted-foreground">
                        {by === "This site" ? why : `${by}: ${why}`}
                    </span>
                    <span className="text-muted-foreground text-right">
                        {ttl}
                    </span>
                </div>
            ))}
        </div>
    );
}

const Label = ({ children }: { children: string }) => (
    <div className="px-3 py-1 border-line border-y text-muted-foreground">
        {children}
    </div>
);

const Hint = ({ k }: { k: string }) => (
    <span className="[@media(hover:none)]:hidden text-muted-foreground">
        {" "}
        · {k}
    </span>
);

export function ConsentBanner() {
    const stored = useStoredConsent();
    const [reopened, setReopened] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [details, setDetails] = useState(false);
    const root = useRef<HTMLDialogElement>(null);
    const returnTo = useRef<HTMLElement | null>(null);

    const visible = stored === null || reopened || leaving;

    const close = useCallback(() => {
        setLeaving(true);
        setTimeout(() => {
            setLeaving(false);
            setReopened(false);
            setDetails(false);
            returnTo.current?.focus({ preventScroll: true });
            returnTo.current = null;
        }, LEAVE_MS);
    }, []);

    const choose = useCallback(
        (granted: boolean) => {
            try {
                localStorage.setItem(
                    CONSENT_KEY,
                    granted ? "granted" : "denied"
                );
            } catch {}
            window.dispatchEvent(new Event(CHANGE_EVENT));
            try {
                applyConsent(granted);
            } catch {}
            // A loaded Clarity keeps recording cookieless when denied; only a
            // fresh page, which never loads it, stops that.
            if (!granted && "clarity" in window) window.location.reload();
            close();
        },
        [close]
    );

    // The footer and policy-page "cookie settings" buttons reopen the banner.
    useEffect(() => {
        const onOpen = () => {
            returnTo.current = document.activeElement as HTMLElement | null;
            setReopened(true);
            setDetails(true);
            requestAnimationFrame(() =>
                root.current?.focus({ preventScroll: true })
            );
        };
        window.addEventListener(OPEN_EVENT, onOpen);
        return () => window.removeEventListener(OPEN_EVENT, onOpen);
    }, []);

    // Y accept, N reject, D details, Esc close. Letters a/c/e/h/o/s/t/w are
    // taken by the command menu, so these avoid them.
    useEffect(() => {
        if (!visible || leaving) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target))
                return;
            const key = e.key.toLowerCase();
            if (key === "y") choose(true);
            else if (key === "n") choose(false);
            else if (key === "d" && !reopened) setDetails((v) => !v);
            else if (key === "escape") {
                if (reopened) close();
                else if (details) setDetails(false);
                else return;
            } else return;
            e.preventDefault();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [visible, leaving, details, reopened, choose, close]);

    // Click outside collapses the details (or closes the reopened view); the
    // reopen buttons are excluded so they do not undo their own click.
    useEffect(() => {
        if (!details) return;
        const onDown = (e: PointerEvent) => {
            const t = e.target as Element | null;
            if (
                root.current?.contains(t) ||
                t?.closest("[data-consent-trigger]")
            )
                return;
            if (reopened) close();
            else setDetails(false);
        };
        document.addEventListener("pointerdown", onDown);
        return () => document.removeEventListener("pointerdown", onDown);
    }, [details, reopened, close]);

    if (!visible) return null;

    const showDetails = details || reopened;
    const status =
        stored === "granted" ? "ON" : stored === "denied" ? "OFF" : "ASK";
    const cell =
        "py-2 motion-safe:transition-colors hover:bg-foreground hover:text-background cursor-target";

    return (
        <dialog
            ref={root}
            open
            aria-label="Cookie consent"
            tabIndex={-1}
            className={`m-0 p-0 max-w-none text-foreground bottom-4 left-4 z-50 fixed bg-background/95 backdrop-blur-xl border border-line font-mono text-[11px] outline-none shadow-[0_8px_30px_hsl(var(--foreground)/0.12)] motion-safe:transition-[width,opacity,transform] motion-safe:duration-300 motion-safe:ease-out ${
                showDetails
                    ? "w-[min(22rem,calc(100vw-2rem))]"
                    : "w-[min(18rem,calc(100vw-2rem))]"
            } ${
                leaving
                    ? "opacity-0 translate-y-2"
                    : "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3"
            }`}
        >
            <div className="flex justify-between px-3 py-1.5 border-line border-b text-muted-foreground">
                <span>FIG. 99 · CONSENT</span>
                {reopened ? (
                    <button
                        type="button"
                        onClick={close}
                        aria-keyshortcuts="Escape"
                        className="hover:text-foreground"
                    >
                        CLOSE ×<Hint k="esc" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setDetails((v) => !v)}
                        aria-expanded={details}
                        aria-controls="consent-details"
                        aria-keyshortcuts="D"
                        className="text-brand hover:underline"
                    >
                        DETAILS {details ? "▾" : "▸"}
                        <Hint k="D" />
                    </button>
                )}
            </div>

            <div
                id="consent-details"
                className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300 motion-safe:ease-out ${
                    showDetails ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="min-h-0 overflow-hidden" inert={!showDetails}>
                    <p className="px-3 py-2 text-muted-foreground leading-snug">
                        Analytics only measures how the site is used: pages,
                        clicks, scrolls and session replays with inputs masked.
                        No ads, nothing sold.
                    </p>
                    <Label>ESSENTIAL · ALWAYS ON</Label>
                    <Rows rows={ESSENTIAL_STORAGE} />
                    <Label>ANALYTICS · ONLY IF YOU ACCEPT</Label>
                    <Rows rows={ANALYTICS_STORAGE} />
                    <p className="px-3 py-2 border-line border-t text-muted-foreground leading-snug">
                        Change anytime via COOKIES in the footer.
                        <br />
                        <Link
                            href="/privacy"
                            onClick={() => setDetails(false)}
                            className="text-brand underline underline-offset-4"
                        >
                            Full privacy policy ↗
                        </Link>
                    </p>
                </div>
            </div>

            {reopened ? (
                <button
                    type="button"
                    onClick={() => choose(stored !== "granted")}
                    aria-keyshortcuts={stored === "granted" ? "N" : "Y"}
                    className={`${cell} w-full border-t border-line`}
                >
                    [ ANALYTICS {status} · TURN{" "}
                    {stored === "granted" ? "OFF" : "ON"}
                    <Hint k={stored === "granted" ? "N" : "Y"} /> ]
                </button>
            ) : (
                <>
                    <div className="space-y-1 px-3 py-2 border-line border-y text-muted-foreground">
                        <div className="flex justify-between">
                            <span>ESSENTIAL</span>
                            <span className="text-foreground">ALWAYS</span>
                        </div>
                        <div className="flex justify-between">
                            <span>ANALYTICS</span>
                            <span className="text-foreground">{status}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2">
                        <button
                            type="button"
                            onClick={() => choose(false)}
                            aria-keyshortcuts="N"
                            className={`${cell} border-r border-line`}
                        >
                            [ REJECT
                            <Hint k="N" /> ]
                        </button>
                        <button
                            type="button"
                            onClick={() => choose(true)}
                            aria-keyshortcuts="Y"
                            className={cell}
                        >
                            [ ACCEPT
                            <Hint k="Y" /> ]
                        </button>
                    </div>
                </>
            )}
        </dialog>
    );
}
