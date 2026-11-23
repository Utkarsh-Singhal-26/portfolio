"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CopyButton } from "@/components/features/copy-button";
import { setAgentView, useAgentView } from "@/components/ui/audience-toggle";
import { ENDPOINTS } from "@/content/api";
import { SITE_URL } from "@/content/data";

const MD = ["/resume", "/activity", "/privacy", "/developers"];
const mdPath = (p: string) =>
    p === "/" ? "/index.md" : MD.includes(p) ? `${p}.md` : "/llms.txt";

const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;

type Doc = { path: string; text: string; bytes: number; html: number };

/** Replaces the rendered page with the text an agent actually receives. */
export function AgentLens() {
    const agent = useAgentView();
    const pathname = usePathname();
    const path = mdPath(pathname);
    const [doc, setDoc] = useState<Doc | null>(null);

    useEffect(() => {
        document.documentElement.dataset.viewer = agent ? "agent" : "human";
        if (!agent) return;
        const html = new TextEncoder().encode(
            document.documentElement.outerHTML
        ).length;
        let live = true;
        fetch(path)
            .then((r) => r.text())
            .then((text) => {
                if (live)
                    setDoc({
                        path,
                        text,
                        html,
                        bytes: new TextEncoder().encode(text).length,
                    });
            })
            .catch(() => {});
        return () => {
            live = false;
        };
    }, [agent, path]);

    if (!agent) return null;

    const ready = doc?.path === path ? doc : null;
    const brief = `Read ${SITE_URL}${path}, then answer questions about Utkarsh Singhal using only what it links to.`;
    const lines = ready?.text.split("\n") ?? [];

    return (
        <section aria-label="Agent view" className="relative pb-24">
            <div className="flex justify-between px-5 py-2 font-mono text-[11px] text-muted-foreground uppercase tracking-[0.14em] rule-b">
                <span>FIG. 97 · AGENT VIEW</span>
                <span>
                    GET {path} · {ready ? "200" : "…"}
                </span>
            </div>

            <div className="gap-px grid grid-cols-2 sm:grid-cols-4 bg-line rule-b">
                {[
                    ["HUMAN PAGE", ready ? kb(ready.html) : "…"],
                    ["AGENT GETS", ready ? kb(ready.bytes) : "…"],
                    ["TOKENS", ready ? `~${Math.round(ready.bytes / 4)}` : "…"],
                    [
                        "LESS",
                        ready
                            ? `${Math.round((1 - ready.bytes / ready.html) * 100)}%`
                            : "…",
                    ],
                ].map(([k, v]) => (
                    <div key={k} className="bg-background px-5 py-3">
                        <div className="font-mono text-[10px] text-muted-foreground tracking-[0.18em]">
                            {k}
                        </div>
                        <div className="font-mono tabular-nums text-lg">
                            {v}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex sm:flex-row flex-col sm:items-center gap-3 px-5 py-3 font-mono text-[12px] rule-b">
                <code className="flex-1 break-all">{brief}</code>
                <CopyButton text={brief} label="COPY PROMPT" />
            </div>

            <pre className="px-5 py-5 overflow-x-auto font-mono text-[12px] leading-relaxed">
                {lines.map((line, i) => (
                    <div
                        key={i}
                        className="flex gap-4 motion-safe:animate-[lens-line_.35s_ease-out_both]"
                        style={{ animationDelay: `${Math.min(i, 40) * 25}ms` }}
                    >
                        <span className="w-8 text-muted-foreground text-right select-none shrink-0">
                            {i + 1}
                        </span>
                        <span
                            className={`whitespace-pre-wrap wrap-break-word min-w-0 ${
                                line.startsWith("#") ? "text-brand" : ""
                            }`}
                        >
                            {line || " "}
                        </span>
                    </div>
                ))}
            </pre>

            <p className="px-5 py-4 font-mono text-[12px] text-muted-foreground leading-loose rule-t">
                <span className="uppercase tracking-[0.22em]">Also </span>
                {ENDPOINTS.map((e, i) => (
                    <span key={e.path}>
                        {i > 0 ? " · " : ""}
                        <a
                            href={e.path}
                            className="text-foreground hover:underline underline-offset-4"
                        >
                            {e.path}
                        </a>
                    </span>
                ))}
                {" · "}
                <button
                    type="button"
                    onClick={() => setAgentView(false)}
                    className="text-brand hover:underline underline-offset-4 cursor-target"
                >
                    back to human view
                </button>
            </p>
        </section>
    );
}
