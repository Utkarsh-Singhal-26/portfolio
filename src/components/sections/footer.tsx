"use client";

import { ArrowUpIcon } from "@phosphor-icons/react";

export function Footer() {
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <footer className="relative flex flex-row justify-between items-center gap-4 w-full cell">
            <span className="cross cross-bl" />
            <span className="cross cross-br" />
            <p className="font-mono tabular-nums text-[12px] text-muted-foreground">
                {new Date().getFullYear()} Utkarsh Singhal
            </p>
            <button
                type="button"
                className="inline-flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground text-sm cursor-target"
                onClick={scrollToTop}
            >
                Back to top
                <ArrowUpIcon size={14} weight="light" />
            </button>
        </footer>
    );
}
