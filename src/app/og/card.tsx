import { DATA } from "@/app/data";

const BG = "#0e0e11";
const FG = "#f4f4f6";
const MUTED = "#9f9fa8";
const LINE = "#3f3f46";
const CROSS = "rgba(244, 244, 246, 0.55)";
const BRAND = "#49ab9e";

const LEVEL = [
    "rgba(244, 244, 246, 0.08)",
    "rgba(73, 171, 158, 0.28)",
    "rgba(73, 171, 158, 0.48)",
    "rgba(73, 171, 158, 0.72)",
    BRAND,
] as const;

const SCALE = 2;
const s = (value: number) => value * SCALE;

const DISPLAY_SIZE = { width: 1200, height: 630 } as const;
const SIZE = {
    width: DISPLAY_SIZE.width * SCALE,
    height: DISPLAY_SIZE.height * SCALE,
} as const;
const FRAME = s(20);
const NAV_H = s(52);
const STRIPE_H = s(24);
const FOOTER_H = s(52);
const HERO_H = s(268);
const PAD_X = s(36);
const GRAPH_WEEKS = 52;
const BLOCK = s(17);
const BLOCK_GAP = s(4);
const CROSS_SIZE = s(11);
const LINE_W = s(1);
const LEFT_X = FRAME;
const RIGHT_X = SIZE.width - FRAME;

const NAV = ["work", "experience", "open source"] as const;
const { NAME, AGE, PRONOUN, HEADLINE, FOCUS } = DATA.HEADER;

function Cross({ x, y }: { x: number; y: number }) {
    const half = (CROSS_SIZE - 1) / 2;
    return (
        <div
            style={{
                position: "absolute",
                left: x - half,
                top: y - half,
                width: CROSS_SIZE,
                height: CROSS_SIZE,
                display: "flex",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: half,
                    left: 0,
                    width: CROSS_SIZE,
                    height: LINE_W,
                    backgroundColor: CROSS,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: half,
                    width: LINE_W,
                    height: CROSS_SIZE,
                    backgroundColor: CROSS,
                }}
            />
        </div>
    );
}

function Rule({ y }: { y: number }) {
    return (
        <div
            style={{
                position: "absolute",
                top: y,
                left: FRAME,
                width: SIZE.width - FRAME * 2,
                height: LINE_W,
                backgroundColor: LINE,
            }}
        />
    );
}

function Graph({ weeks }: { weeks: number[][] }) {
    return (
        <div style={{ display: "flex", flexDirection: "row", gap: BLOCK_GAP }}>
            {weeks.map((week, weekIndex) => (
                <div
                    key={weekIndex}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: BLOCK_GAP,
                    }}
                >
                    {week.map((level, dayIndex) => (
                        <div
                            key={dayIndex}
                            style={{
                                width: BLOCK,
                                height: BLOCK,
                                backgroundColor: LEVEL[level] ?? LEVEL[0],
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function OgCard({ weeks }: { weeks: number[][] }) {
    const [firstName, ...lastParts] = NAME.split(" ");
    const lastName = lastParts.join(" ");
    const graphWeeks = weeks.slice(-GRAPH_WEEKS);

    const topY = FRAME;
    const navY = FRAME + NAV_H;
    const graphY = FRAME + NAV_H + HERO_H;
    const stripeY = SIZE.height - FRAME - FOOTER_H - STRIPE_H;
    const footerY = SIZE.height - FRAME - FOOTER_H;
    const bottomY = SIZE.height - FRAME;
    const frameH = SIZE.height - FRAME * 2;
    const marks = [topY, navY, graphY, stripeY, footerY, bottomY];

    return (
        <div
            style={{
                width: SIZE.width,
                height: SIZE.height,
                display: "flex",
                flexDirection: "column",
                backgroundColor: BG,
                color: FG,
                fontFamily: "Outfit",
                position: "relative",
                padding: FRAME,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: FRAME,
                    left: LEFT_X,
                    width: LINE_W,
                    height: frameH,
                    backgroundColor: LINE,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: FRAME,
                    left: RIGHT_X,
                    width: LINE_W,
                    height: frameH,
                    backgroundColor: LINE,
                }}
            />

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: NAV_H,
                    paddingLeft: PAD_X,
                    paddingRight: PAD_X,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: s(20),
                        fontWeight: 600,
                        letterSpacing: s(-0.4),
                    }}
                >
                    utkarsh.
                </div>
                <div style={{ display: "flex", gap: s(28) }}>
                    {NAV.map((item) => (
                        <div
                            key={item}
                            style={{
                                display: "flex",
                                fontSize: s(14),
                                color: MUTED,
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: HERO_H,
                    paddingLeft: PAD_X,
                    paddingRight: PAD_X,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontFamily: "Geist Mono",
                        fontSize: s(13),
                        color: MUTED,
                    }}
                >
                    {AGE}, {PRONOUN}
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: s(8),
                        fontSize: s(56),
                        fontWeight: 600,
                        letterSpacing: s(-2),
                        lineHeight: 1.05,
                    }}
                >
                    <div style={{ display: "flex" }}>{firstName}</div>
                    <div style={{ display: "flex" }}>{lastName}</div>
                </div>
                <div
                    style={{
                        display: "flex",
                        marginTop: s(12),
                        maxWidth: s(620),
                        fontSize: s(20),
                        lineHeight: 1.35,
                        color: MUTED,
                    }}
                >
                    {HEADLINE}
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "center",
                    paddingLeft: PAD_X,
                    paddingRight: PAD_X,
                }}
            >
                <Graph weeks={graphWeeks} />
            </div>

            <div
                style={{
                    display: "flex",
                    height: STRIPE_H,
                    backgroundImage: `repeating-linear-gradient(315deg, rgba(73, 171, 158, 0.42) 0px, rgba(73, 171, 158, 0.42) ${LINE_W}px, transparent ${LINE_W}px, transparent ${s(10)}px)`,
                }}
            />

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: FOOTER_H,
                    paddingLeft: PAD_X,
                    paddingRight: PAD_X,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontFamily: "Geist Mono",
                        fontSize: s(13),
                        color: MUTED,
                    }}
                >
                    {FOCUS}
                </div>
                <div
                    style={{
                        display: "flex",
                        fontFamily: "Geist Mono",
                        fontSize: s(13),
                        color: MUTED,
                    }}
                >
                    utkarsh-singhal.is-a.dev
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: SIZE.width,
                    height: SIZE.height,
                    display: "flex",
                }}
            >
                {marks.map((y) => (
                    <Rule key={`rule-${y}`} y={y} />
                ))}
                {marks.flatMap((y) => [
                    <Cross key={`l-${y}`} x={LEFT_X} y={y} />,
                    <Cross key={`r-${y}`} x={RIGHT_X} y={y} />,
                ])}
            </div>
        </div>
    );
}

export { DISPLAY_SIZE, SIZE };
