"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import type { WakaItem, WakaStats } from "@/lib/wakatime";

const LABEL =
    "font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]";

function Breakdown({ title, items }: { title: string; items: WakaItem[] }) {
    const [picked, setPicked] = useState(0);
    const max = Math.max(...items.map((i) => i.percent), 1);
    const row = items[picked];

    return (
        <div>
            <p className={LABEL}>{title}</p>
            <ul className="space-y-0.5 mt-3 font-mono text-[12px]">
                {items.map((item, i) => (
                    <li key={item.name}>
                        <button
                            type="button"
                            onClick={() => setPicked(i)}
                            onMouseEnter={() => setPicked(i)}
                            onFocus={() => setPicked(i)}
                            aria-pressed={picked === i}
                            className={cn(
                                "items-center gap-3 grid grid-cols-[7.5rem_minmax(0,1fr)_3.25rem] -mx-2 px-2 py-1.5 w-[calc(100%+1rem)] text-left motion-safe:transition-colors cursor-target",
                                picked === i
                                    ? "bg-foreground/8"
                                    : "hover:bg-foreground/5"
                            )}
                        >
                            <span
                                className={cn(
                                    "truncate",
                                    picked === i
                                        ? "text-brand"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </span>
                            <span className="bg-foreground/5 h-2.5">
                                <span
                                    className="block bg-brand h-full motion-safe:transition-[width,opacity] duration-300"
                                    style={{
                                        width: `${(item.percent / max) * 100}%`,
                                        opacity: picked === i ? 1 : 0.5,
                                    }}
                                />
                            </span>
                            <span className="text-right tabular-nums">
                                {item.percent.toFixed(1)}%
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
            <p
                className="mt-3 text-[13px] text-muted-foreground leading-relaxed"
                aria-live="polite"
            >
                <span className="text-foreground">{row.name}</span>
                {row.text ? `: ${row.text}` : ""}, {row.percent.toFixed(1)}% of
                all coding time.
            </p>
        </div>
    );
}

/** Languages and editors only, never project names. */
export function WakaPanel({ stats }: { stats: WakaStats }) {
    return (
        <div className="space-y-8">
            <Breakdown title="Languages" items={stats.languages} />
            {stats.editors.length > 0 ? (
                <Breakdown title="Editors" items={stats.editors} />
            ) : null}
        </div>
    );
}
