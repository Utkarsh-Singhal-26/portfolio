"use client";

import { Children, type ReactNode, useState } from "react";

// Render inside a grid: the toggle spans every column.
export function ShowMore({
    children,
    limit,
    noun,
}: {
    children: ReactNode;
    limit: number;
    noun: string;
}) {
    const items = Children.toArray(children);
    const [open, setOpen] = useState(false);
    const hidden = items.length - limit;

    return (
        <>
            {open ? items : items.slice(0, limit)}
            {hidden > 0 ? (
                <div className="flex justify-center border-line border-b col-span-full">
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        aria-expanded={open}
                        className="hover:bg-foreground/5 px-6 py-4 w-full font-mono text-[12px] text-muted-foreground hover:text-foreground uppercase tracking-[0.18em] motion-safe:transition-colors cursor-target"
                    >
                        {open
                            ? "[ Show fewer ]"
                            : `[ Show ${hidden} more ${noun} ]`}
                    </button>
                </div>
            ) : null}
        </>
    );
}
