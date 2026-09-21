"use client";

import { useState, useSyncExternalStore } from "react";

const KEY = "consent";

type Clarity = (...args: unknown[]) => void;

function apply(granted: boolean) {
    const state = granted ? "granted" : "denied";
    (window as unknown as { clarity?: Clarity }).clarity?.("consentv2", {
        ad_Storage: state,
        analytics_Storage: state,
    });
}

export function ConsentBanner() {
    const [done, setDone] = useState(false);
    const stored = useSyncExternalStore(
        () => () => {},
        () => {
            try {
                return localStorage.getItem(KEY);
            } catch {
                return null;
            }
        },
        () => "ssr"
    );

    if (stored || done) return null;

    const choose = (granted: boolean) => {
        try {
            localStorage.setItem(KEY, granted ? "granted" : "denied");
        } catch {}
        setDone(true);
        try {
            apply(granted);
        } catch {}
    };

    const btn =
        "border border-line px-3 py-1.5 text-sm motion-safe:transition-colors cursor-target";

    return (
        <div
            role="region"
            aria-label="Cookie consent"
            className="bottom-5 left-5 z-50 fixed bg-background/90 shadow-[0_10px_40px_hsl(var(--foreground)/0.12)] backdrop-blur-xl p-4 border border-line max-w-xs text-sm"
        >
            <p className="text-muted-foreground">
                I use Microsoft Clarity to see how visitors use this site
                (clicks, scrolls, session replays). Allow cookies?
            </p>
            <div className="flex gap-2 mt-3">
                <button
                    type="button"
                    onClick={() => choose(true)}
                    className={`${btn} bg-foreground text-background`}
                >
                    Accept
                </button>
                <button
                    type="button"
                    onClick={() => choose(false)}
                    className={`${btn} hover:bg-muted`}
                >
                    Decline
                </button>
            </div>
        </div>
    );
}
