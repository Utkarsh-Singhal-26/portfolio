"use client";

import { RobotIcon, UserIcon } from "@phosphor-icons/react";
import { useState, useSyncExternalStore } from "react";

import { cover } from "@/components/features/route-band";
import DecryptedText from "@/components/ui/decrypted-text";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const KEY = "viewer";
const AGENT_UA = /bot|crawl|spider|gpt|claude|perplexity|headless|curl|python/i;
const listeners = new Set<() => void>();

// An explicit choice wins; otherwise a request that looks like an agent starts in agent view.
const read = () => {
    try {
        const saved = localStorage.getItem(KEY);
        if (saved) return saved === "agent";
    } catch {}
    return AGENT_UA.test(navigator.userAgent);
};

const subscribe = (fn: () => void) => {
    listeners.add(fn);
    return () => void listeners.delete(fn);
};

export const useAgentView = () =>
    useSyncExternalStore(subscribe, read, () => false);

function commit(on: boolean) {
    track("view_changed", { view: on ? "agent" : "human" });
    try {
        localStorage.setItem(KEY, on ? "agent" : "human");
    } catch {}
    // Same tick as the lens render, so the page never shows both or neither.
    document.documentElement.dataset.viewer = on ? "agent" : "human";
    listeners.forEach((fn) => fn());
}

export const setAgentView = (on: boolean) =>
    cover(on ? "agent" : "human", () => commit(on));

/** Floating viewer switch: a knob that slides between a person and a robot. */
export function AudienceToggle() {
    const actual = useAgentView();
    // Show the new side at once; the page itself swaps later, under the band.
    // Ignored once the real value has caught up with it (derived, no effect).
    const [pending, setPending] = useState<{
        from: boolean;
        to: boolean;
    } | null>(null);
    const agent = pending && pending.from === actual ? pending.to : actual;

    return (
        <div className="bottom-5 left-1/2 z-95 fixed flex items-stretch bg-background/90 backdrop-blur-xl border border-line font-mono text-[11px] tracking-[0.18em] -translate-x-1/2">
            <span className="hidden sm:flex items-center px-3 border-r border-line text-muted-foreground">
                VIEW
            </span>
            <button
                type="button"
                role="switch"
                aria-checked={agent}
                aria-label="Agent view"
                onClick={() => {
                    setPending({ from: actual, to: !agent });
                    setAgentView(!agent);
                }}
                className="group relative flex items-center gap-2 p-1 cursor-target"
            >
                <span className="relative grid grid-cols-2 w-20 h-8">
                    <span
                        aria-hidden
                        className="top-0 left-0 absolute bg-brand w-1/2 h-full motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out"
                        style={{
                            transform: agent ? "translateX(100%)" : "none",
                        }}
                    />
                    <UserIcon
                        size={16}
                        weight="light"
                        aria-hidden
                        className={cn(
                            "z-10 place-self-center",
                            agent
                                ? "text-muted-foreground"
                                : "text-brand-foreground"
                        )}
                    />
                    <RobotIcon
                        size={16}
                        weight="light"
                        aria-hidden
                        className={cn(
                            "z-10 place-self-center",
                            agent
                                ? "text-brand-foreground"
                                : "text-muted-foreground"
                        )}
                    />
                </span>
                <span className="w-14 text-left uppercase">
                    <DecryptedText
                        key={agent ? "agent" : "human"}
                        text={agent ? "agent" : "human"}
                        animateOn="view"
                        sequential
                        speed={45}
                        maxIterations={8}
                        encryptedClassName="text-brand"
                    />
                </span>
            </button>
        </div>
    );
}
