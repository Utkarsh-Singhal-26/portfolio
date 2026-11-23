import type { CSSProperties, ReactNode } from "react";
import { Fragment } from "react";

import { DATA, getAge, SITE_URL } from "@/content/data";

// Laid out at 1200x630, rendered at 2x so the JPEG stays sharp.
const W = 1200;
const H = 630;
const SCALE = 2;
const DISPLAY_SIZE = { width: W, height: H } as const;
const SIZE = { width: W * SCALE, height: H * SCALE } as const;

const BG = "#0e0e11";
const FG = "#f4f4f6";
const MUTED = "#9f9fa8";
const LINE = "#3f3f46";
const BRAND = "#49ab9e";
const DIM = "rgba(73, 171, 158, 0.85)";
const LEVEL = [
    "rgba(244, 244, 246, 0.08)",
    "rgba(73, 171, 158, 0.28)",
    "rgba(73, 171, 158, 0.48)",
    "rgba(73, 171, 158, 0.72)",
    BRAND,
];

const { name, pronoun } = DATA.header;
const company = DATA.experience[0];
const role = company.roles[0].title.replace(/\s-\s/, "-");
const mono: CSSProperties = {
    display: "flex",
    fontFamily: "Geist Mono",
    color: MUTED,
};
const dashed = (color: string, deg = 90) =>
    `repeating-linear-gradient(${deg}deg, ${color} 0 6px, transparent 6px 11px)`;

// Same creature as floating-mascot.tsx: -1 empty, "e" eye, 0-4 fill level.
const BODY: (number | "e")[][] = [
    [-1, 2, 3, 2, -1],
    [3, "e", 4, "e", 3],
    [4, 4, 4, 4, 4],
    [2, 3, 4, 3, 2],
];
const CELLS = BODY.flat()
    .map((v, i) => ({ v, i }))
    .filter((c) => c.v !== -1);
const level = (v: number | "e") => (v === "e" ? 0 : v);

const AXIS_Y = 236;
const CELL = 46;
const MINI = 26;

function box(
    x: number,
    y: number,
    w: number,
    h: number,
    bg: string,
    extra: CSSProperties = {}
): CSSProperties {
    return {
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        display: "flex",
        backgroundColor: bg,
        ...extra,
    };
}

function Mono({
    x,
    y,
    size = 13,
    right,
    color = MUTED,
    children,
}: {
    x?: number;
    y: number;
    size?: number;
    right?: number;
    color?: string;
    children: ReactNode;
}) {
    return (
        <div
            style={{
                ...mono,
                color,
                position: "absolute",
                top: y,
                fontSize: size,
                letterSpacing: size === 13 ? 1.5 : 0,
                ...(right === undefined ? { left: x } : { right }),
            }}
        >
            {children}
        </div>
    );
}

function Eye({ size }: { size: number }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                backgroundColor: BRAND,
                display: "flex",
            }}
        />
    );
}

function Frame() {
    const m = 22;
    const cross = "rgba(244, 244, 246, 0.55)";
    return (
        <>
            <div
                style={{
                    ...box(m, m, W - m * 2, H - m * 2, "transparent"),
                    border: `1px solid ${LINE}`,
                }}
            />
            {[m, W - m].flatMap((x) =>
                [m, H - m].map((y) => (
                    <Fragment key={`${x}${y}`}>
                        <div style={box(x - 6, y, 13, 1, cross)} />
                        <div style={box(x, y - 6, 1, 13, cross)} />
                    </Fragment>
                ))
            )}
            {["1", "2", "3", "4", "5", "6"].map((c, i) => (
                <Mono
                    key={c}
                    x={m + ((W - m * 2) / 6) * (i + 0.5) - 4}
                    y={3}
                    size={12}
                >
                    {c}
                </Mono>
            ))}
            {["D", "C", "B", "A"].map((r, i) => (
                <Mono
                    key={r}
                    x={7}
                    y={m + ((H - m * 2) / 4) * (i + 0.5) - 8}
                    size={12}
                >
                    {r}
                </Mono>
            ))}
        </>
    );
}

function Mascot() {
    const gap = Math.round(MINI * 0.3);
    const leg = { width: MINI, height: MINI / 2, backgroundColor: BRAND };
    return (
        <div
            style={{
                position: "absolute",
                left: 960,
                top: 380,
                display: "flex",
                flexDirection: "column",
                gap,
            }}
        >
            {BODY.map((row, r) => (
                <div key={r} style={{ display: "flex", gap }}>
                    {row.map((v, c) => (
                        <div
                            key={c}
                            style={{
                                width: MINI,
                                height: MINI,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                    v === -1 ? "transparent" : LEVEL[level(v)],
                            }}
                        >
                            {v === "e" && <Eye size={MINI * 0.42} />}
                        </div>
                    ))}
                </div>
            ))}
            <div
                style={{
                    display: "flex",
                    gap: MINI + gap,
                    marginLeft: MINI + gap,
                }}
            >
                <div style={leg} />
                <div style={leg} />
            </div>
        </div>
    );
}

function Exploded() {
    return (
        <>
            <div
                style={box(64, AXIS_Y, 1072, 1, "transparent", {
                    backgroundImage: dashed("rgba(244, 244, 246, 0.3)"),
                })}
            />
            {CELLS.map((c, k) => {
                const x = 78 + k * 58;
                const row = Math.floor(c.i / 5);
                const rise = (3 - row) * 18;
                const top = AXIS_Y - 18 - rise;
                return (
                    <Fragment key={k}>
                        <div
                            style={box(
                                x + CELL / 2,
                                top,
                                1,
                                24 + rise,
                                "rgba(73, 171, 158, 0.45)"
                            )}
                        />
                        <div
                            style={box(
                                x + CELL / 2 - 3,
                                AXIS_Y - 2,
                                7,
                                7,
                                DIM,
                                {
                                    borderRadius: 99,
                                }
                            )}
                        />
                        <div
                            style={box(
                                x,
                                top - CELL,
                                CELL,
                                CELL,
                                LEVEL[level(c.v)],
                                {
                                    alignItems: "center",
                                    justifyContent: "center",
                                }
                            )}
                        >
                            {c.v === "e" && <Eye size={CELL * 0.4} />}
                        </div>
                        <Mono x={x + CELL / 2 - 9} y={AXIS_Y + 14}>
                            {`${row}${c.i % 5}`}
                        </Mono>
                    </Fragment>
                );
            })}
        </>
    );
}

function Dimension() {
    const tick = {
        width: 1,
        height: 16,
        backgroundColor: DIM,
        display: "flex",
    };
    const rule = {
        height: 1,
        flexGrow: 1,
        backgroundColor: DIM,
        display: "flex",
    };
    return (
        <div
            style={{
                position: "absolute",
                left: 78,
                top: 282,
                width: 1044,
                height: 16,
                display: "flex",
                alignItems: "center",
            }}
        >
            <div style={tick} />
            <div style={rule} />
            <div
                style={{
                    ...mono,
                    color: DIM,
                    fontSize: 13,
                    padding: "0 12px",
                    letterSpacing: 1.5,
                }}
            >
                5 × 4 GRID · 18 CELLS
            </div>
            <div style={rule} />
            <div style={tick} />
        </div>
    );
}

export function OgCard() {
    return (
        <div
            style={{
                width: SIZE.width,
                height: SIZE.height,
                display: "flex",
                backgroundColor: BG,
            }}
        >
            <div
                style={{
                    width: W,
                    height: H,
                    display: "flex",
                    position: "relative",
                    color: FG,
                    fontFamily: "Outfit",
                    transform: `scale(${SCALE})`,
                    transformOrigin: "top left",
                }}
            >
                <Frame />
                <Mono x={64} y={50}>
                    FIG. 05 · EXPLODED VIEW · 18 CELLS
                </Mono>
                <Mono right={64} y={50}>
                    {new URL(SITE_URL).host}
                </Mono>
                <Exploded />
                <Dimension />

                <Mono x={64} y={336} size={18}>
                    {getAge()}, {pronoun} · 28.7172°N 77.1579°E
                </Mono>
                <div
                    style={{
                        position: "absolute",
                        left: 64,
                        top: 366,
                        display: "flex",
                        fontSize: 116,
                        fontWeight: 600,
                        letterSpacing: -4.5,
                        lineHeight: 1,
                    }}
                >
                    {name}
                </div>
                <Mono x={64} y={496} size={22}>
                    {role} at {company.name}
                </Mono>

                <div
                    style={box(1038, 306, 1, 66, "transparent", {
                        backgroundImage: dashed("rgba(73, 171, 158, 0.6)", 0),
                    })}
                />
                <Mascot />
                <Mono x={960} y={530} color={DIM}>
                    COMMIT · ASSEMBLED
                </Mono>

                <div
                    style={box(64, 548, 820, 22, "transparent", {
                        border: `1px solid ${LINE}`,
                        backgroundImage:
                            "repeating-linear-gradient(315deg, rgba(73, 171, 158, 0.45) 0 1px, transparent 1px 9px)",
                    })}
                />
            </div>
        </div>
    );
}

export { DISPLAY_SIZE, SIZE };
