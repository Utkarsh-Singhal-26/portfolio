"use client";

import { ArrowUp } from "@phosphor-icons/react";

export function Footer() {
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <footer className="cell relative flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <span className="cross cross-bl" />
            <span className="cross cross-br" />
            <p className="font-mono text-[12px] text-muted-foreground tabular-nums">
                {new Date().getFullYear()} Utkarsh Singhal
            </p>
            <button
                type="button"
                className="cursor-target inline-flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={scrollToTop}
            >
                Back to top
                <ArrowUp size={14} weight="light" />
            </button>
        </footer>
    );
}
