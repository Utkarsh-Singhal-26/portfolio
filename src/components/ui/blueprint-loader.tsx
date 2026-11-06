"use client";

import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

/**
 * Engineering-drawing loader. The name is drafted on guide lines with a
 * live dimension line, and a title block fills in as the page actually
 * loads (DOM, fonts, window load). At 100% the sheet is stamped APPROVED
 * and wipes away. Plays once per session.
 *
 * sm+: landscape sheet, name on one line.
 * phones: the same sheet turned 90deg, the name running up the screen.
 */

const MIN_MS = 2200;
const MAX_MS = 6000;
const SEEN_KEY = "drawn";

const GUIDES = [
    { k: -0.7, label: "cap height" },
    { k: -0.5, label: "x-height" },
    { k: 0, label: "baseline" },
    { k: 0.22, label: "descender" },
];

type Layout = {
    w: number;
    h: number;
    fs: number;
    x0: number;
    lineX: [number, number];
    base: number;
    text: string;
    labelSize: number;
    dimY: number;
    rotate?: boolean;
    className: string;
};

const DESKTOP: Layout = {
    w: 1000,
    h: 300,
    fs: 120,
    x0: 60,
    lineX: [20, 900],
    base: 200,
    text: "Utkarsh Singhal",
    labelSize: 13,
    dimY: 66,
    className: "hidden sm:block w-[min(88vw,1000px)]",
};

// Same sheet, turned 90deg to run up a portrait screen.
const VERTICAL: Layout = {
    w: 860,
    h: 150,
    fs: 100,
    x0: 30,
    lineX: [10, 768],
    base: 120,
    text: "Utkarsh Singhal",
    labelSize: 12,
    dimY: 22,
    rotate: true,
    className: "h-[74dvh] w-auto",
};

const ROWS = [
    { k: "DRAWN", v: "U. SINGHAL", at: 8 },
    { k: "PROJECT", v: "utkarsh.", at: 24 },
    { k: "SCALE", v: "1:1", at: 40 },
    { k: "REV", v: "2.0", at: 56 },
];

// Same fill ramp as the contribution graph.
const LEVEL =
    'data-[level="0"]:fill-foreground/8 data-[level="1"]:fill-brand/25 data-[level="2"]:fill-brand/45 data-[level="3"]:fill-brand/70 data-[level="4"]:fill-brand';

type Phase = "draw" | "approved" | "exit" | "gone";

export function BlueprintLoader() {
    const [phase, setPhase] = useState<Phase>("draw");
    const [drawn, setDrawn] = useState(false);
    const [p, setP] = useState(0);
    const [date, setDate] = useState("");
    const [scales, setScales] = useState({ desktop: 0, vertical: 0 });
    const [widths, setWidths] = useState({ desktop: 0, vertical: 0 });
    const deskSvg = useRef<SVGSVGElement>(null);
    const deskText = useRef<SVGTextElement>(null);
    const vertSvg = useRef<SVGSVGElement>(null);
    const vertText = useRef<SVGTextElement>(null);

    useEffect(() => {
        if (document.documentElement.dataset.loader === "skip") {
            setPhase("gone");
            return;
        }

        setDate(format(new Date(), "dd.MM.yyyy"));

        const start = performance.now();
        let target = 0.2;
        let shown = 0;
        let raf = 0;
        let done = false;
        const timers: ReturnType<typeof setTimeout>[] = [];
        const bump = (n: number) => {
            target = Math.max(target, n);
        };

        raf = requestAnimationFrame(() => setDrawn(true));

        const measure = () => {
            const d = deskSvg.current?.getBoundingClientRect();
            const r = vertSvg.current?.getBoundingClientRect();
            setScales({
                desktop: d ? d.width / DESKTOP.w : 0,
                vertical: r ? r.height / VERTICAL.w : 0,
            });
            setWidths({
                desktop: deskText.current?.getComputedTextLength() ?? 0,
                vertical: vertText.current?.getComputedTextLength() ?? 0,
            });
        };

        if (document.readyState === "loading")
            document.addEventListener("DOMContentLoaded", () => bump(0.5), {
                once: true,
            });
        else bump(0.5);
        void document.fonts.ready.then(() => {
            bump(0.75);
            requestAnimationFrame(measure);
        });
        const onLoad = () => bump(1);
        if (document.readyState === "complete") bump(1);
        else window.addEventListener("load", onLoad, { once: true });
        timers.push(setTimeout(() => bump(1), MAX_MS));

        const tick = (now: number) => {
            const cap = Math.min(1, (now - start) / MIN_MS);
            shown += (Math.min(target, cap) - shown) * 0.08;
            if (target >= 1 && cap >= 1 && shown > 0.995) shown = 1;
            setP(Math.round(shown * 100));
            if (shown === 1 && !done) {
                done = true;
                setPhase("approved");
                timers.push(
                    setTimeout(() => setPhase("exit"), 700),
                    setTimeout(() => {
                        setPhase("gone");
                        try {
                            sessionStorage.setItem(SEEN_KEY, "1");
                        } catch {}
                    }, 1500)
                );
                return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            timers.forEach(clearTimeout);
            window.removeEventListener("load", onLoad);
        };
    }, []);

    if (phase === "gone") return null;

    return (
        <div
            aria-hidden="true"
            data-phase={phase}
            className="blueprint-loader fixed inset-0 z-[100] flex items-center justify-center bg-background text-foreground select-none"
            style={{
                clipPath:
                    phase === "exit" ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
                transition: "clip-path 750ms var(--ease-premium)",
            }}
        >
            {/* sheet frame */}
            <div className="absolute inset-4 sm:inset-8 border border-line">
                <span className="cross cross-tl" />
                <span className="cross cross-tr" />
                <span className="cross cross-bl" />
                <span className="cross cross-br" />
                <span className="absolute top-3 left-4 font-mono text-[11px] text-muted-foreground tracking-wide">
                    FIG. 01 · HEADER
                </span>
            </div>

            {/* ---- sm+: landscape sheet ---- */}
            <Sheet
                layout={DESKTOP}
                drawn={drawn}
                p={p}
                scale={scales.desktop}
                width={widths.desktop}
                svgRef={deskSvg}
                textRef={deskText}
            />
            <TitleBlock
                p={p}
                date={date}
                phase={phase}
                className="hidden sm:block absolute right-8 bottom-8 w-[192px]"
            />

            {/* ---- phones ---- */}
            <div className="sm:hidden absolute inset-4">
                <div className="absolute top-10 bottom-6 left-5 flex items-center">
                    <Sheet
                        layout={VERTICAL}
                        drawn={drawn}
                        p={p}
                        scale={scales.vertical}
                        width={widths.vertical}
                        svgRef={vertSvg}
                        textRef={vertText}
                    />
                </div>
                <TitleBlock
                    p={p}
                    date={date}
                    phase={phase}
                    keyWidth={64}
                    className="absolute right-0 bottom-0 w-[200px]"
                />
            </div>
        </div>
    );
}

function TitleBlock({
    p,
    date,
    phase,
    keyWidth = 72,
    className = "",
}: {
    p: number;
    date: string;
    phase: Phase;
    keyWidth?: number;
    className?: string;
}) {
    const cols = { gridTemplateColumns: `${keyWidth}px 1fr` };
    return (
        <div
            className={`${className || "relative"} border-line border-t border-l bg-background font-mono text-[11px] tabular-nums`}
        >
            {[...ROWS, { k: "DATE", v: date, at: 70 }].map((r) => (
                <div
                    key={r.k}
                    className="grid border-line border-r border-b"
                    style={cols}
                >
                    <span className="px-3 py-1.5 border-line border-r text-muted-foreground">
                        {r.k}
                    </span>
                    <span
                        className="px-3 py-1.5 truncate transition-opacity duration-300"
                        style={{ opacity: p >= r.at ? 1 : 0 }}
                    >
                        {r.v}
                    </span>
                </div>
            ))}
            <div className="grid border-line border-r border-b" style={cols}>
                <span className="px-3 py-1.5 border-line border-r text-muted-foreground">
                    STATUS
                </span>
                <span className="flex items-center justify-between gap-2 px-3 py-1.5">
                    <svg width={69} height={6}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <rect
                                key={i}
                                x={i * 7}
                                width={6}
                                height={6}
                                data-level={Math.max(
                                    0,
                                    Math.min(4, Math.floor((p / 10 - i) * 4))
                                )}
                                className={LEVEL}
                            />
                        ))}
                    </svg>
                    <span className="w-8 text-right">{p}%</span>
                </span>
            </div>

            {/* approval stamp */}
            <span
                className="absolute -top-9 right-3 border border-brand bg-background px-2 py-1 text-brand text-xs tracking-[0.2em]"
                style={{
                    opacity: phase === "draw" ? 0 : 1,
                    transform:
                        phase === "draw"
                            ? "rotate(-6deg) scale(1.6)"
                            : "rotate(-6deg) scale(1)",
                    transition:
                        "opacity 160ms ease-out, transform 260ms cubic-bezier(.2,1.6,.4,1)",
                }}
            >
                APPROVED
            </span>
        </div>
    );
}

const outline = (drawn: boolean, p: number, delay: number) => ({
    fill: "hsl(var(--foreground))",
    fillOpacity: p >= 82 ? 1 : 0,
    stroke: "hsl(var(--foreground))",
    strokeWidth: 1.2,
    strokeDasharray: 1000,
    strokeDashoffset: drawn ? 0 : 1000,
    transition: `stroke-dashoffset 1600ms cubic-bezier(.45,.05,.3,1) ${delay}ms, fill-opacity 500ms ease-out`,
});

function Sheet({
    layout: l,
    drawn,
    p,
    scale,
    width,
    svgRef,
    textRef,
}: {
    layout: Layout;
    drawn: boolean;
    p: number;
    scale: number;
    width: number;
    svgRef: React.Ref<SVGSVGElement>;
    textRef: React.Ref<SVGTextElement>;
}) {
    const cap = l.base - 0.7 * l.fs;
    const measure = {
        stroke: "hsl(var(--muted-foreground))",
        strokeWidth: 1,
        opacity: width && p >= 45 ? 1 : 0,
        transition: "opacity 400ms",
    };
    const label = { fill: "hsl(var(--muted-foreground))", stroke: "none" };
    const x1 = l.x0 + width;
    const mid = l.x0 + width / 2;

    return (
        <svg
            ref={svgRef}
            viewBox={l.rotate ? `0 0 ${l.h} ${l.w}` : `0 0 ${l.w} ${l.h}`}
            className={`overflow-visible ${l.className}`}
        >
            <g
                transform={
                    l.rotate ? `translate(0 ${l.w}) rotate(-90)` : undefined
                }
            >
                {GUIDES.map((g, i) => {
                    const y = l.base + g.k * l.fs;
                    return (
                        <g key={g.label}>
                            <line
                                x1={l.lineX[0]}
                                x2={l.lineX[1]}
                                y1={y}
                                y2={y}
                                pathLength={1}
                                strokeDasharray={1}
                                strokeDashoffset={drawn ? 0 : 1}
                                style={{
                                    stroke: "hsl(var(--brand) / 0.55)",
                                    strokeWidth: 1,
                                    transition: `stroke-dashoffset 700ms var(--ease-premium) ${i * 90}ms`,
                                }}
                            />
                            <text
                                x={l.lineX[1] + 10}
                                y={y + l.labelSize * 0.32}
                                fontSize={l.labelSize}
                                className="font-mono"
                                style={{
                                    fill: "hsl(var(--brand))",
                                    opacity: drawn ? 1 : 0,
                                    transition: `opacity 400ms ${300 + i * 90}ms`,
                                }}
                            >
                                {g.label}
                            </text>
                        </g>
                    );
                })}

                <text
                    ref={textRef}
                    x={l.x0}
                    y={l.base}
                    fontSize={l.fs}
                    fontWeight={600}
                    letterSpacing="-0.04em"
                    style={outline(drawn, p, 250)}
                >
                    {l.text}
                </text>

                {/* dimension line, measured from the rendered name */}
                <g style={measure}>
                    <line
                        x1={l.x0}
                        x2={l.x0}
                        y1={l.dimY - 10}
                        y2={cap - 6}
                        strokeDasharray="2 3"
                    />
                    <line
                        x1={x1}
                        x2={x1}
                        y1={l.dimY - 10}
                        y2={cap - 6}
                        strokeDasharray="2 3"
                    />
                    <line x1={l.x0} x2={mid - 32} y1={l.dimY} y2={l.dimY} />
                    <line x1={mid + 32} x2={x1} y1={l.dimY} y2={l.dimY} />
                    <path
                        d={`M${l.x0 + 7} ${l.dimY - 4} L${l.x0} ${l.dimY} L${l.x0 + 7} ${l.dimY + 4}`}
                        fill="none"
                    />
                    <path
                        d={`M${x1 - 7} ${l.dimY - 4} L${x1} ${l.dimY} L${x1 - 7} ${l.dimY + 4}`}
                        fill="none"
                    />
                    <text
                        x={mid}
                        y={l.dimY + 4}
                        fontSize={l.labelSize}
                        textAnchor="middle"
                        className="font-mono"
                        style={label}
                    >
                        {Math.round((width * scale * p) / 100)}px
                    </text>
                </g>
            </g>
        </svg>
    );
}
