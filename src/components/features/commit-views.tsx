"use client";

import { format, parseISO } from "date-fns";
import {
    type ReactNode,
    type RefObject,
    useEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";

import {
    busiestDay,
    cumulative,
    type Day,
    monthRows,
    streaks,
    weekdayTotals,
} from "@/lib/github/commit-stats";
import { cn } from "@/lib/utils";

const dateLabel = (date: string) => format(parseISO(date), "d MMM yyyy");
const maxCount = (days: Day[]) => Math.max(...days.map((d) => d.count), 1);
const n = (value: number) => value.toLocaleString("en");
const clamp = (v: number, lo: number, hi: number) =>
    Math.min(Math.max(v, lo), hi);

/** Container width in px, so charts draw 1:1 and text stays readable on phones. */
function useWidth(ref: RefObject<HTMLDivElement | null>) {
    const [w, setW] = useState(760);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const update = () => setW(Math.round(el.clientWidth));
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [ref]);
    return w;
}

const AXIS = "fill-muted-foreground font-mono";

type Tip = { x: number; y: number; lines: ReactNode[] };

function TipBox({ tip, width }: { tip: Tip | null; width: number }) {
    if (!tip) return null;
    return (
        <div
            className="z-10 absolute bg-background shadow-lg px-3 py-2 border border-line font-mono text-[11px] whitespace-nowrap pointer-events-none"
            style={{
                left: clamp(tip.x, 64, Math.max(64, width - 64)),
                top: tip.y,
                transform: "translate(-50%, calc(-100% - 14px))",
            }}
        >
            {tip.lines.map((line, i) => (
                <div
                    key={i}
                    className={
                        i === 0 ? "text-muted-foreground" : "text-foreground"
                    }
                >
                    {line}
                </div>
            ))}
        </div>
    );
}

/** Maps a pointer to SVG viewBox units, and to pixels inside the wrapper. */
function locate(
    event: ReactPointerEvent<SVGSVGElement>,
    wrap: RefObject<HTMLDivElement | null>,
    box: { w: number; h: number }
) {
    const svg = event.currentTarget.getBoundingClientRect();
    const outer = wrap.current?.getBoundingClientRect();
    const vx = ((event.clientX - svg.left) / svg.width) * box.w;
    const vy = ((event.clientY - svg.top) / svg.height) * box.h;
    const toPx = (x: number, y: number) => ({
        x: svg.left - (outer?.left ?? 0) + (x / box.w) * svg.width,
        y: svg.top - (outer?.top ?? 0) + (y / box.h) * svg.height,
    });
    return { vx, vy, toPx, width: outer?.width ?? svg.width };
}

export function Terrain({ days }: { days: Day[] }) {
    const rows = monthRows(days);
    const max = maxCount(days);
    const wrap = useRef<HTMLDivElement>(null);
    const W = useWidth(wrap);
    const compact = W < 520;
    const left = compact ? 48 : 64;
    const right = compact ? 34 : 60;
    const amp = compact ? 62 : 70;
    const gap = compact ? 23 : 26;
    const plot = W - left - right;
    const step = plot / 30;
    // Only as much headroom as the tallest ridge actually needs.
    const top =
        Math.max(
            8,
            ...rows.map(
                (r, i) =>
                    (Math.max(...r.days.map((d) => d.count)) / max) * amp -
                    i * gap
            )
        ) + 6;
    const H = top + (rows.length - 1) * gap + 28;
    const x = (day: number) => left + (day - 1) * step;

    const [hover, setHover] = useState<{ row: number; day: number } | null>(
        null
    );
    const [tip, setTip] = useState<Tip | null>(null);
    const [width, setWidth] = useState(0);

    const move = (event: ReactPointerEvent<SVGSVGElement>) => {
        const { vx, vy, toPx, width: w } = locate(event, wrap, { w: W, h: H });
        const row = clamp(Math.round((vy - top) / gap), 0, rows.length - 1);
        const dayNo = clamp(Math.round((vx - left) / step) + 1, 1, 31);
        const days_ = rows[row].days;
        const nearest = days_.reduce((a, b) =>
            Math.abs(b.day - dayNo) < Math.abs(a.day - dayNo) ? b : a
        );
        const base = top + row * gap;
        const point = toPx(x(nearest.day), base - (nearest.count / max) * amp);
        setWidth(w);
        setHover({ row, day: nearest.day });
        setTip({
            ...point,
            lines: [
                dateLabel(nearest.date),
                `${nearest.count} contribution${nearest.count === 1 ? "" : "s"}`,
            ],
        });
    };

    const clear = () => {
        setHover(null);
        setTip(null);
    };

    return (
        <div ref={wrap} className="relative">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                aria-label="Ridgeline chart: daily contributions, one ridge per month. Point at a ridge to read a day."
                className="w-full h-auto cursor-crosshair"
                style={{ touchAction: "pan-y" }}
                onPointerMove={move}
                onPointerDown={move}
                onPointerLeave={clear}
            >
                {rows.map((row, i) => {
                    const active = hover?.row === i;
                    const dim = hover !== null && !active;
                    const base = top + i * gap;
                    const pts = row.days.map((d) => ({
                        ...d,
                        px: x(d.day),
                        py: base - (d.count / max) * amp,
                    }));
                    const line = pts
                        .map((p, j) => `${j ? "L" : "M"}${p.px},${p.py}`)
                        .join(" ");
                    const last = pts[pts.length - 1];
                    const first = pts[0];
                    const area = `${line} L${last.px},${base} L${first.px},${base} Z`;
                    const hit = active
                        ? pts.find((p) => p.day === hover?.day)
                        : undefined;
                    return (
                        <g
                            key={row.key}
                            className="motion-safe:transition-opacity duration-200"
                            opacity={dim ? 0.35 : 1}
                        >
                            <path d={area} className="fill-background" />
                            <path
                                d={area}
                                className="fill-brand"
                                fillOpacity={active ? 0.35 : 0.2}
                            />
                            <line
                                x1={left}
                                x2={W - right}
                                y1={base}
                                y2={base}
                                className="stroke-line"
                                strokeWidth={0.5}
                            />
                            <path
                                d={line}
                                className="fill-none stroke-brand"
                                strokeWidth={active ? 2 : 1.2}
                                strokeLinejoin="round"
                            />
                            {hit ? (
                                <>
                                    <line
                                        x1={hit.px}
                                        x2={hit.px}
                                        y1={hit.py}
                                        y2={base}
                                        className="stroke-brand"
                                        strokeDasharray="2 2"
                                    />
                                    <circle
                                        cx={hit.px}
                                        cy={hit.py}
                                        r={4}
                                        className="fill-background stroke-brand"
                                        strokeWidth={2}
                                    />
                                </>
                            ) : null}
                            <text
                                x={left - 10}
                                y={base}
                                textAnchor="end"
                                dominantBaseline="middle"
                                className={
                                    active ? "fill-foreground font-mono" : AXIS
                                }
                                fontSize={10}
                            >
                                {row.label.toUpperCase()}
                            </text>
                            <text
                                x={W - right + 10}
                                y={base}
                                dominantBaseline="middle"
                                className="fill-foreground font-mono"
                                fontSize={10}
                            >
                                {n(row.count)}
                            </text>
                        </g>
                    );
                })}
            </svg>
            <TipBox tip={tip} width={width} />
        </div>
    );
}

export function Accumulation({ days }: { days: Day[] }) {
    const run = cumulative(days);
    const sum = run[run.length - 1];
    const { longest } = streaks(days);
    const peak = busiestDay(days);
    const wrap = useRef<HTMLDivElement>(null);
    const W = useWidth(wrap);
    const compact = W < 520;
    const H = compact ? 230 : 280;
    const pad = compact
        ? { l: 40, r: 12, t: 16, b: 28 }
        : { l: 52, r: 20, t: 20, b: 30 };
    const pw = W - pad.l - pad.r;
    const ph = H - pad.t - pad.b;
    const nDays = days.length;
    const step = pw / (nDays - 1);
    const px = (i: number) => pad.l + i * step;
    const py = (v: number) => pad.t + ph - (v / sum) * ph;

    const [at, setAt] = useState<number | null>(null);
    const [tip, setTip] = useState<Tip | null>(null);
    const [width, setWidth] = useState(0);

    const move = (event: ReactPointerEvent<SVGSVGElement>) => {
        const { vx, toPx, width: w } = locate(event, wrap, { w: W, h: H });
        const i = clamp(Math.round((vx - pad.l) / step), 0, nDays - 1);
        setWidth(w);
        setAt(i);
        setTip({
            ...toPx(px(i), py(run[i])),
            lines: [
                dateLabel(days[i].date),
                `+${days[i].count} today`,
                `${n(run[i])} so far`,
            ],
        });
    };
    const clear = () => {
        setAt(null);
        setTip(null);
    };

    const line = run
        .map((v, i) => `${i ? "L" : "M"}${px(i)},${py(v)}`)
        .join(" ");
    const area = `${line} L${px(nDays - 1)},${pad.t + ph} L${px(0)},${pad.t + ph} Z`;
    const ticks = [0, 0.25, 0.5, 0.75, 1];
    const months = days
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => d.date.endsWith("-01"))
        .filter((_, k) => !compact || k % 2 === 0);
    const sIdx = days.findIndex((d) => d.date === longest.start);
    const eIdx = days.findIndex((d) => d.date === longest.end);
    const peakIdx = days.findIndex((d) => d.date === peak.date);
    const flip = px(peakIdx) > W - 150;

    return (
        <div ref={wrap} className="relative">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                aria-label="Cumulative contributions over the last year. Move across it to read any day."
                className="w-full h-auto cursor-crosshair"
                style={{ touchAction: "pan-y" }}
                onPointerMove={move}
                onPointerDown={move}
                onPointerLeave={clear}
            >
                {ticks.map((t) => (
                    <g key={t}>
                        <line
                            x1={pad.l}
                            x2={W - pad.r}
                            y1={py(sum * t)}
                            y2={py(sum * t)}
                            className="stroke-line"
                            strokeWidth={0.6}
                            strokeDasharray={t === 0 ? undefined : "2 4"}
                        />
                        <text
                            x={pad.l - 8}
                            y={py(sum * t)}
                            textAnchor="end"
                            dominantBaseline="middle"
                            className={AXIS}
                            fontSize={10}
                        >
                            {n(Math.round(sum * t))}
                        </text>
                    </g>
                ))}

                {sIdx >= 0 && eIdx > sIdx ? (
                    <g>
                        <rect
                            x={px(sIdx)}
                            y={pad.t}
                            width={px(eIdx) - px(sIdx)}
                            height={ph}
                            className="fill-brand"
                            fillOpacity={0.08}
                        />
                        <text
                            x={px(sIdx) + 6}
                            y={pad.t + ph - 8}
                            className="fill-brand font-mono"
                            fontSize={10}
                        >
                            {compact ? "STREAK" : "LONGEST STREAK"} ·{" "}
                            {longest.length} DAYS
                        </text>
                    </g>
                ) : null}

                <path d={area} className="fill-brand" fillOpacity={0.12} />
                <path
                    d={line}
                    className="fill-none stroke-brand"
                    strokeWidth={1.8}
                    strokeLinejoin="round"
                />

                {months.map(({ d, i }) => (
                    <g key={d.date}>
                        <line
                            x1={px(i)}
                            x2={px(i)}
                            y1={pad.t + ph}
                            y2={pad.t + ph + 4}
                            className="stroke-line"
                        />
                        <text
                            x={px(i)}
                            y={H - 10}
                            textAnchor="middle"
                            className={AXIS}
                            fontSize={10}
                        >
                            {format(parseISO(d.date), "MMM").toUpperCase()}
                        </text>
                    </g>
                ))}

                <circle
                    cx={px(peakIdx)}
                    cy={py(run[peakIdx])}
                    r={4.5}
                    className="fill-background stroke-brand"
                    strokeWidth={2}
                />
                <text
                    x={px(peakIdx) + (flip ? -10 : 10)}
                    y={py(run[peakIdx]) - 8}
                    textAnchor={flip ? "end" : "start"}
                    className="fill-foreground font-mono"
                    fontSize={10}
                >
                    PEAK DAY · {peak.count} ·{" "}
                    {format(parseISO(peak.date), "d MMM")}
                </text>

                {at !== null ? (
                    <g>
                        <line
                            x1={px(at)}
                            x2={px(at)}
                            y1={pad.t}
                            y2={pad.t + ph}
                            className="stroke-foreground"
                            strokeOpacity={0.5}
                            strokeDasharray="3 3"
                        />
                        <circle
                            cx={px(at)}
                            cy={py(run[at])}
                            r={5}
                            className="fill-brand stroke-background"
                            strokeWidth={2}
                        />
                    </g>
                ) : null}
            </svg>
            <TipBox tip={tip} width={width} />
        </div>
    );
}

export function Weekdays({ days }: { days: Day[] }) {
    const rows = weekdayTotals(days);
    // Monday first reads more naturally than GitHub's Sunday first.
    const ordered = [...rows.slice(1), rows[0]];
    const max = Math.max(...ordered.map((r) => r.count), 1);
    const sum = ordered.reduce((s, r) => s + r.count, 0);
    const topIndex = ordered.reduce(
        (best, r, i) => (r.count > ordered[best].count ? i : best),
        0
    );
    const [picked, setPicked] = useState(topIndex);
    const r = ordered[picked];
    const index = (picked + 1) % 7;
    const active = days.filter(
        (d) => d.weekday === index && d.count > 0
    ).length;

    return (
        <div>
            <ul className="space-y-1 font-mono text-[12px]">
                {ordered.map((row, i) => (
                    <li key={row.label}>
                        <button
                            type="button"
                            onClick={() => setPicked(i)}
                            onMouseEnter={() => setPicked(i)}
                            onFocus={() => setPicked(i)}
                            aria-pressed={picked === i}
                            className={cn(
                                "items-center gap-3 grid grid-cols-[2.5rem_minmax(0,1fr)_7.5rem] -mx-2 px-2 py-1.5 w-[calc(100%+1rem)] text-left motion-safe:transition-colors cursor-target",
                                picked === i
                                    ? "bg-foreground/8"
                                    : "hover:bg-foreground/5"
                            )}
                        >
                            <span
                                className={cn(
                                    "uppercase tracking-[0.18em]",
                                    picked === i
                                        ? "text-brand"
                                        : "text-muted-foreground"
                                )}
                            >
                                {row.label}
                            </span>
                            <span className="bg-foreground/5 h-3">
                                <span
                                    className="block bg-brand h-full motion-safe:transition-[width,opacity] duration-300"
                                    style={{
                                        width: `${(row.count / max) * 100}%`,
                                        opacity: picked === i ? 1 : 0.5,
                                    }}
                                />
                            </span>
                            <span className="text-right tabular-nums">
                                {n(row.count)}{" "}
                                <span className="text-muted-foreground">
                                    · {Math.round((row.count / sum) * 100)}%
                                </span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
            <p
                className="mt-5 pt-4 border-line border-t text-[15px] text-muted-foreground leading-relaxed"
                aria-live="polite"
            >
                <span className="text-foreground">{r.label}</span>: {n(r.count)}{" "}
                contributions across {r.seen} days, about{" "}
                {Math.round(r.average)} a day, with something shipped on{" "}
                {active} of them
                {picked === topIndex ? ". The busiest day of the week." : "."}
            </p>
        </div>
    );
}

export function Ledger({ days }: { days: Day[] }) {
    const rows = monthRows(days);
    const max = maxCount(days);
    const wrap = useRef<HTMLDivElement>(null);
    const [tip, setTip] = useState<Tip | null>(null);
    const [width, setWidth] = useState(0);
    const [hoverRow, setHoverRow] = useState<string | null>(null);

    const move = (
        event: ReactPointerEvent<SVGSVGElement>,
        row: (typeof rows)[number]
    ) => {
        const svg = event.currentTarget.getBoundingClientRect();
        const outer = wrap.current?.getBoundingClientRect();
        const dayNo = clamp(
            Math.floor((((event.clientX - svg.left) / svg.width) * 124) / 4) +
                1,
            1,
            31
        );
        const d = row.days.find((x) => x.day === dayNo);
        if (!d) {
            setTip(null);
            return;
        }
        setWidth(outer?.width ?? svg.width);
        setHoverRow(row.key);
        setTip({
            x: event.clientX - (outer?.left ?? 0),
            y: svg.top - (outer?.top ?? 0),
            lines: [
                dateLabel(d.date),
                `${d.count} contribution${d.count === 1 ? "" : "s"}`,
            ],
        });
    };

    return (
        <div ref={wrap} className="relative">
            <div className="overflow-x-auto font-mono text-[12px]">
                <table className="w-full sm:min-w-136 border-collapse">
                    <thead>
                        <tr className="border-line border-b text-[10px] text-muted-foreground uppercase tracking-[0.22em]">
                            <th className="px-2 sm:px-4 py-2 font-normal text-left">
                                Month
                            </th>
                            <th className="px-2 sm:px-4 py-2 font-normal text-left">
                                Daily
                            </th>
                            <th className="px-2 sm:px-4 py-2 font-normal text-right">
                                Total
                            </th>
                            <th className="px-2 sm:px-4 py-2 font-normal text-right">
                                vs prev
                            </th>
                            <th className="hidden sm:table-cell px-2 sm:px-4 py-2 font-normal text-right">
                                Active
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => {
                            const prev = rows[i - 1];
                            // A partial month isn't comparable with a full one.
                            const comparable =
                                prev && !prev.partial && !row.partial;
                            const delta =
                                comparable && prev.count > 0
                                    ? Math.round(
                                          ((row.count - prev.count) /
                                              prev.count) *
                                              100
                                      )
                                    : null;
                            return (
                                <tr
                                    key={row.key}
                                    className={cn(
                                        "border-line not-last:border-b motion-safe:transition-colors",
                                        hoverRow === row.key
                                            ? "bg-foreground/8"
                                            : "hover:bg-foreground/5"
                                    )}
                                >
                                    <td className="px-2 sm:px-4 py-2.5 whitespace-nowrap">
                                        {row.label}
                                        {row.partial ? (
                                            <span className="hidden sm:inline ml-2 text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                                                partial
                                            </span>
                                        ) : null}
                                    </td>
                                    <td className="px-2 sm:px-4 py-2.5">
                                        <svg
                                            viewBox="0 0 124 24"
                                            aria-label={`Daily contributions in ${row.label}. Point at a bar to read a day.`}
                                            className="w-24 sm:w-31 h-6 cursor-crosshair"
                                            style={{ touchAction: "pan-y" }}
                                            onPointerMove={(e) => move(e, row)}
                                            onPointerDown={(e) => move(e, row)}
                                            onPointerLeave={() => {
                                                setTip(null);
                                                setHoverRow(null);
                                            }}
                                        >
                                            {row.days.map((d) => {
                                                const h = Math.max(
                                                    1,
                                                    (d.count / max) * 22
                                                );
                                                return (
                                                    <rect
                                                        key={d.date}
                                                        x={(d.day - 1) * 4}
                                                        y={24 - h}
                                                        width={3}
                                                        height={h}
                                                        className="fill-brand"
                                                        fillOpacity={
                                                            d.count ? 0.9 : 0.25
                                                        }
                                                    />
                                                );
                                            })}
                                        </svg>
                                    </td>
                                    <td className="px-2 sm:px-4 py-2.5 text-right tabular-nums">
                                        {n(row.count)}
                                    </td>
                                    <td
                                        className={`px-2 sm:px-4 py-2.5 text-right tabular-nums ${
                                            delta !== null && delta >= 0
                                                ? "text-brand"
                                                : "text-muted-foreground"
                                        }`}
                                    >
                                        {delta === null
                                            ? "–"
                                            : `${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta)}%`}
                                    </td>
                                    <td className="hidden sm:table-cell px-2 sm:px-4 py-2.5 text-muted-foreground text-right tabular-nums">
                                        {row.active}/{row.days.length}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <TipBox tip={tip} width={width} />
        </div>
    );
}

export function Streak({ days }: { days: Day[] }) {
    const { longest } = streaks(days);
    const step = 3;
    const W = days.length * step;
    const [at, setAt] = useState<number | null>(null);

    const move = (event: ReactPointerEvent<SVGSVGElement>) => {
        const svg = event.currentTarget.getBoundingClientRect();
        const vx = ((event.clientX - svg.left) / svg.width) * W;
        setAt(clamp(Math.floor(vx / step), 0, days.length - 1));
    };

    const inLongest = (date: string) =>
        longest.length > 0 && date >= longest.start && date <= longest.end;
    const hovered = at !== null ? days[at] : null;

    return (
        <div>
            <div className="p-4">
                <svg
                    viewBox={`0 0 ${W} 28`}
                    aria-label="Every day of the last year, active days filled, longest streak highlighted. Move across it to read a day."
                    className="w-full h-28 cursor-crosshair"
                    preserveAspectRatio="none"
                    style={{ touchAction: "pan-y" }}
                    onPointerMove={move}
                    onPointerDown={move}
                    onPointerLeave={() => setAt(null)}
                >
                    {days.map((d, i) => (
                        <rect
                            key={d.date}
                            x={i * step}
                            y={0}
                            width={step - 1}
                            height={28}
                            className={
                                inLongest(d.date)
                                    ? "fill-brand"
                                    : d.count > 0
                                      ? "fill-muted-foreground"
                                      : "fill-line"
                            }
                            fillOpacity={
                                at === i
                                    ? 1
                                    : inLongest(d.date)
                                      ? 1
                                      : d.count > 0
                                        ? 0.55
                                        : 0.5
                            }
                        />
                    ))}
                    {at !== null ? (
                        <rect
                            x={at * step - 1}
                            y={-1}
                            width={step + 1}
                            height={30}
                            className="fill-none stroke-foreground"
                            strokeWidth={1}
                        />
                    ) : null}
                </svg>
                <p
                    className="mt-2 min-h-4 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]"
                    aria-live="polite"
                >
                    {hovered ? (
                        <span className="text-foreground">
                            {dateLabel(hovered.date)} · {hovered.count}{" "}
                            contribution{hovered.count === 1 ? "" : "s"}
                            {inLongest(hovered.date)
                                ? " · in the longest streak"
                                : ""}
                        </span>
                    ) : (
                        <>
                            <span className="text-brand">■</span> longest streak
                            · <span className="text-muted-foreground">■</span>{" "}
                            active ·{" "}
                            <span className="text-muted-foreground/40">■</span>{" "}
                            quiet
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
