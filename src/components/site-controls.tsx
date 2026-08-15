"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";

import { useCommandMenu } from "@/components/command-menu";

export function SiteControls() {
    const { setOpen } = useCommandMenu();

    return (
        <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open command menu"
            aria-keyshortcuts="Meta+K /"
            title="Search · ⌘K · / · ?"
            className="right-5 bottom-5 z-45 fixed grid place-items-center bg-background/90 backdrop-blur-xl border border-line size-10 text-foreground/80 hover:text-foreground shadow-[0_10px_40px_hsl(var(--foreground)/0.12)] motion-safe:transition-colors cursor-target"
        >
            <MagnifyingGlassIcon size={18} weight="light" />
        </button>
    );
}
