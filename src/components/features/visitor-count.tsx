"use client";

import { useEffect, useState } from "react";

// Module scope: one hit per page load even when StrictMode runs the effect twice.
let counted = false;
const MIN_DIGITS = 5;

// 1 -> st, 12 -> th, 13,229 -> th
function suffix(n: number) {
    const t = n % 100;
    return t >= 11 && t <= 13
        ? "th"
        : (["th", "st", "nd", "rd"][n % 10] ?? "th");
}

// One drawing-sheet digit box: a 0-9 reel that rolls to its value.
function Digit({ value, index }: { value: number; index: number }) {
    return (
        <span className="relative border-line not-last:border-r w-6 h-8 overflow-hidden">
            <span
                className="flex flex-col font-mono tabular-nums text-foreground text-lg text-center transition-transform motion-reduce:transition-none duration-1200 ease-out"
                style={{
                    transform: `translateY(-${value * 10}%)`,
                    transitionDelay: `${index * 90}ms`,
                }}
            >
                {Array.from({ length: 10 }, (_, d) => (
                    <span
                        key={d}
                        className="flex justify-center items-center h-8"
                    >
                        {d}
                    </span>
                ))}
            </span>
        </span>
    );
}

export function VisitorCount() {
    const [count, setCount] = useState<number | null>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const post = !counted;
        counted = true;
        fetch("/api/visitors", { method: post ? "POST" : "GET" })
            .then((r) => r.json())
            .then(({ count: n }: { count: number | null }) => {
                if (!n) return;
                setCount(n);
                // next frame so the reels roll from 0 instead of mounting at n
                requestAnimationFrame(() => setShown(true));
            })
            .catch(() => {});
    }, []);

    if (count === null) return null;

    const digits = String(count)
        .padStart(MIN_DIGITS, "0")
        .split("")
        .map(Number);

    return (
        <div
            title={`You are the ${count.toLocaleString("en-US")}${suffix(count)} visitor`}
            className="flex flex-col justify-center gap-1 ml-auto px-4"
        >
            <span className="sr-only">
                You are visitor number {count.toLocaleString("en-US")}
                {suffix(count)}
            </span>
            <span
                aria-hidden="true"
                className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]"
            >
                Visitor No.
            </span>
            <div
                aria-hidden="true"
                className="flex bg-[hsl(var(--brand)/0.08)] border border-line"
            >
                {digits.map((d, i) => (
                    <Digit key={i} value={shown ? d : 0} index={i} />
                ))}
            </div>
        </div>
    );
}
