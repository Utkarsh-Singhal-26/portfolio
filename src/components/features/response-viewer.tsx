"use client";

import { useState } from "react";

import { CopyButton } from "@/components/features/copy-button";
import { cn } from "@/lib/utils";

export type Token = {
    text: string;
    kind: "key" | "str" | "lit" | "head" | "plain";
};

export type ViewerTab = {
    path: string;
    label: string;
    type: string;
    bytes: number;
    curl: string;
    body: string;
    lines: Token[][];
};

const KIND: Record<Token["kind"], string> = {
    key: "text-foreground",
    str: "text-brand",
    lit: "text-muted-foreground",
    head: "text-foreground font-semibold",
    plain: "text-muted-foreground",
};

const size = (bytes: number) =>
    bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

export function ResponseViewer({ tabs }: { tabs: ViewerTab[] }) {
    const [active, setActive] = useState(0);
    const tab = tabs[active];

    return (
        <div className="relative bg-background border border-line font-mono">
            <div
                role="tablist"
                aria-label="Endpoints"
                className="flex overflow-x-auto border-line border-b"
            >
                {tabs.map((item, index) => (
                    <button
                        key={item.path}
                        type="button"
                        role="tab"
                        id={`resp-tab-${index}`}
                        aria-selected={index === active}
                        aria-controls="resp-panel"
                        onClick={() => setActive(index)}
                        className={cn(
                            "px-4 py-2.5 border-line not-last:border-r text-[12px] whitespace-nowrap motion-safe:transition-colors duration-200 cursor-target",
                            index === active
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div
                id="resp-panel"
                role="tabpanel"
                aria-labelledby={`resp-tab-${active}`}
            >
                <div className="flex justify-between items-center gap-4 px-4 py-2.5 border-line border-b text-[12px]">
                    <code className="min-w-0 break-all">
                        <span className="text-muted-foreground">$ </span>
                        {tab.curl}
                    </code>
                </div>

                <pre className="p-4 max-h-88 overflow-x-hidden overflow-y-auto text-[12.5px] leading-relaxed">
                    {tab.lines.map((line, i) => (
                        <div
                            key={i}
                            className="min-h-[1.5em] break-words whitespace-pre-wrap"
                        >
                            {line.map((token, j) => (
                                <span key={j} className={KIND[token.kind]}>
                                    {token.text}
                                </span>
                            ))}
                        </div>
                    ))}
                </pre>

                <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2 px-4 py-2.5 border-line border-t text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
                    <span>
                        <span className="text-brand">200 OK</span> · {tab.type}{" "}
                        · {size(tab.bytes)}
                    </span>
                    <span className="flex gap-4">
                        <CopyButton
                            text={tab.curl}
                            label="COPY CURL"
                            className="hover:text-foreground"
                        />
                        <CopyButton
                            text={tab.body}
                            label="COPY RESPONSE"
                            className="hover:text-foreground"
                        />
                    </span>
                </div>
            </div>
        </div>
    );
}
