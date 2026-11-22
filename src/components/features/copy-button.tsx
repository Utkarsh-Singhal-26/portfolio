"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function CopyButton({
    text,
    label = "COPY",
    className,
}: {
    text: string;
    label?: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => void (timer.current && clearTimeout(timer.current)),
        []
    );

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            return;
        }
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1600);
    };

    return (
        <button
            type="button"
            onClick={copy}
            aria-label={`Copy: ${text}`}
            className={cn(
                "font-mono text-[11px] tracking-[0.18em] whitespace-nowrap cursor-target",
                copied && "text-brand",
                className
            )}
        >
            [ {copied ? "COPIED" : label} ]
            <span className="sr-only" aria-live="polite">
                {copied ? "Copied" : ""}
            </span>
        </button>
    );
}
