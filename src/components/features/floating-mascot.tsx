"use client";

import { useEffect, useRef } from "react";

/**
 * "Commit": a small creature made of contribution-graph cells.
 * Same square blocks, same five-step fill ramp, same hairline crosses and
 * mono readouts as the rest of the page. It walks along the blueprint
 * hairlines (.rule-t), can be picked up and thrown, and falls under gravity.
 */

const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const LEG = 5;
const W = 5 * STEP - GAP; // 62
const H = 4 * STEP + LEG; // 57

// Same classes the contribution graph uses for its levels.
const LEVEL =
    'data-[level="0"]:fill-foreground/8 data-[level="1"]:fill-brand/25 data-[level="2"]:fill-brand/45 data-[level="3"]:fill-brand/70 data-[level="4"]:fill-brand';

// -1 = empty, "e" = eye (an empty day cell with a pupil).
const BODY: (number | "e")[][] = [
    [-1, 2, 3, 2, -1],
    [3, "e", 4, "e", 3],
    [4, 4, 4, 4, 4],
    [2, 3, 4, 3, 2],
];

const CELLS = BODY.flatMap((row, r) =>
    row.flatMap((v, c) =>
        v === -1
            ? []
            : [
                  {
                      x: c * STEP,
                      y: r * STEP,
                      base: v === "e" ? 0 : v,
                      eye: v === "e",
                  },
              ]
    )
);
const EYES = CELLS.filter((c) => c.eye);

const NAV = 72; // sticky navbar height; lines above it are not walkable
const EDGE = 16;
const SEARCH = 84; // keep clear of the bottom-right search button
const GRAVITY = 2200;
const WALK = 38;
const SLEEP_MS = 30_000;

type Mode = "fall" | "idle" | "walk" | "held" | "sleep";

const rand = (a: number, b: number) => a + Math.random() * (b - a);

const TERRAIN_WALK = 70;

// Footer letters register here: `tops` holds each column's glyph top, 0 to 1.
export const letterTerrain = {
    el: null as Element | null,
    tops: null as Float32Array | null,
    feet: null as { x: number; y: number } | null,
};

// Highest letter surface under a span, in viewport pixels.
function terrainTop(x: number, width: number) {
    const { el, tops } = letterTerrain;
    if (!el || !tops) return null;
    const r = el.getBoundingClientRect();
    const scale = tops.length / r.width;
    const from = Math.max(0, Math.floor((x + 8 - r.left) * scale));
    const to = Math.min(
        tops.length - 1,
        Math.ceil((x + width - 8 - r.left) * scale)
    );
    if (from > to) return null;
    let best = 1;
    for (let i = from; i <= to; i++) best = Math.min(best, tops[i]);
    return r.top + best * r.height;
}

export function FloatingMascot() {
    const root = useRef<HTMLDivElement>(null);
    const art = useRef<SVGSVGElement>(null);
    const pupils = useRef<SVGGElement>(null);
    const legs = useRef<(SVGRectElement | null)[]>([]);
    const cells = useRef<(SVGRectElement | null)[]>([]);
    const readout = useRef<HTMLSpanElement>(null);
    const toast = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = root.current;
        const svg = art.current;
        if (!el || !svg) return;

        // phones get a smaller Commit; physics uses the scaled size
        let k = 1;
        let w = W;
        let h = H;
        const fit = () => {
            k = window.innerWidth < 640 ? 0.6 : 1;
            w = W * k;
            h = H * k;
            el.style.width = `${w}px`;
            el.style.height = `${h}px`;
        };
        fit();

        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        let lines = [...document.querySelectorAll<HTMLElement>(".rule-t")];
        const floorY = () => window.innerHeight - 12;

        const s = {
            x: window.innerWidth * 0.7,
            y: reduce ? floorY() - h : -h - 20,
            vx: 0,
            vy: 0,
            on: null as HTMLElement | "floor" | "terrain" | null,
            visited: false, // already jumped onto the letters this visit
            seek: false, // airborne toward the letters: ignore hairlines
            terrainY: 0,
            mode: "fall" as Mode,
            timer: 2,
            dir: -1,
            step: 0,
            lastMove: performance.now(),
            px: -1,
            py: -1,
            blink: rand(2, 5),
            shimmer: 0.6,
            shimmerCell: -1,
            grab: { dx: 0, dy: 0, sx: 0, sy: 0, t: 0, moved: false },
        };

        const setLevel = (i: number, level: number) =>
            cells.current[i]?.setAttribute("data-level", String(level));

        const squash = () => {
            if (reduce) return;
            svg.style.transition = "none";
            svg.style.transform = "scale(1.14, 0.8)";
            requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                    svg.style.transition =
                        "transform 260ms var(--ease-premium)";
                    svg.style.transform = "";
                })
            );
        };

        const commit = () => {
            CELLS.forEach((c, i) => !c.eye && setLevel(i, 4));
            setTimeout(() => CELLS.forEach((c, i) => setLevel(i, c.base)), 320);
            const t = toast.current;
            if (!t || reduce) return;
            t.style.transition = "none";
            t.style.opacity = "1";
            t.style.transform = "translate(-50%, 0)";
            requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                    t.style.transition =
                        "opacity 900ms ease-out, transform 900ms var(--ease-premium)";
                    t.style.opacity = "0";
                    t.style.transform = "translate(-50%, -18px)";
                })
            );
        };

        const setMode = (m: Mode) => {
            s.mode = m;
            el.dataset.mode = m;
        };

        const land = (on: HTMLElement | "floor" | "terrain", top: number) => {
            s.y = top - h;
            if (s.vy > 380 && !reduce) {
                s.vy = -s.vy * 0.35;
                s.vx *= 0.7;
                squash();
                return;
            }
            s.vx = 0;
            s.vy = 0;
            s.on = on;
            squash();
            setMode("idle");
            s.timer = rand(1.2, 3);
        };

        // --- pointer: pick up, drag, throw -------------------------------
        const onDown = (e: PointerEvent) => {
            e.preventDefault();
            el.setPointerCapture(e.pointerId);
            window.getSelection()?.removeAllRanges();
            document.body.style.userSelect = "none";
            s.grab = {
                dx: e.clientX - s.x,
                dy: e.clientY - s.y,
                sx: e.clientX,
                sy: e.clientY,
                t: performance.now(),
                moved: false,
            };
            s.vx = 0;
            s.vy = 0;
            s.on = null;
            setMode("held");
        };
        const onDrag = (e: PointerEvent) => {
            if (s.mode !== "held") return;
            const now = performance.now();
            const dt = Math.max((now - s.grab.t) / 1000, 0.001);
            const nx = e.clientX - s.grab.dx;
            const ny = e.clientY - s.grab.dy;
            // smoothed release velocity
            s.vx = s.vx * 0.6 + ((nx - s.x) / dt) * 0.4;
            s.vy = s.vy * 0.6 + ((ny - s.y) / dt) * 0.4;
            s.x = nx;
            s.y = ny;
            s.grab.t = now;
            if (Math.hypot(e.clientX - s.grab.sx, e.clientY - s.grab.sy) > 4)
                s.grab.moved = true;
        };
        const onUp = (e: PointerEvent) => {
            if (s.mode !== "held") return;
            el.releasePointerCapture(e.pointerId);
            document.body.style.userSelect = "";
            if (!s.grab.moved) {
                s.vx = 0;
                s.vy = reduce ? 0 : -560;
                commit();
            } else if (performance.now() - s.grab.t > 80) {
                s.vx = 0; // held still before letting go: just drop
                s.vy = 0;
            }
            s.vx = Math.max(-2400, Math.min(2400, s.vx));
            s.vy = Math.max(-2400, Math.min(2400, s.vy));
            setMode("fall");
        };

        const onLook = (e: PointerEvent) => {
            s.lastMove = performance.now();
            s.px = e.clientX;
            s.py = e.clientY;
            if (s.mode === "sleep") {
                setMode("idle");
                s.timer = rand(0.5, 1.5);
            }
        };
        const onResize = () => {
            fit();
            lines = [...document.querySelectorAll<HTMLElement>(".rule-t")];
        };

        el.addEventListener("pointerdown", onDown);
        el.addEventListener("pointermove", onDrag);
        el.addEventListener("pointerup", onUp);
        el.addEventListener("pointercancel", onUp);
        window.addEventListener("pointermove", onLook, { passive: true });
        window.addEventListener("resize", onResize);

        // --- frame loop ---------------------------------------------------
        let raf = 0;
        let prev = performance.now();

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame);
            const dt = Math.min((now - prev) / 1000, 0.05);
            prev = now;
            const floor = floorY();
            const vw = window.innerWidth;

            const box = letterTerrain.tops
                ? letterTerrain.el?.getBoundingClientRect()
                : undefined;
            const onScreen =
                !!box &&
                box.top < window.innerHeight - box.height * 0.5 &&
                box.bottom > NAV;
            if (box) {
                // ride the letters through page scroll
                if (s.on === "terrain") s.y += box.top - s.terrainY;
                s.terrainY = box.top;
            }
            if (box && onScreen && !s.visited && !reduce && s.mode !== "held") {
                s.visited = true;
                s.seek = true;
                s.on = null;
                s.x = Math.min(Math.max(s.x, box.left), box.right - w);
                const rise = s.y + h - (terrainTop(s.x, w) ?? floor);
                s.vx = 0;
                s.vy = rise > 0 ? -Math.sqrt(2 * GRAVITY * (rise + 40)) : 0;
                setMode("fall");
            } else if (!onScreen && s.visited) {
                s.visited = false;
                s.seek = false;
                if (s.on === "terrain") {
                    s.on = null;
                    setMode("fall");
                }
            }

            if (s.mode === "fall") {
                if (reduce) {
                    land("floor", floor);
                } else {
                    s.vy += GRAVITY * dt;
                    s.vx *= 1 - 0.8 * dt;
                    const prevFeet = s.y + h;
                    s.x += s.vx * dt;
                    s.y += s.vy * dt;
                    if (s.x < EDGE) {
                        s.x = EDGE;
                        s.vx = Math.abs(s.vx) * 0.5;
                    }
                    if (s.x > vw - w - EDGE) {
                        s.x = vw - w - EDGE;
                        s.vx = -Math.abs(s.vx) * 0.5;
                    }
                    s.y = Math.max(s.y, -400);
                    const feet = s.y + h;
                    if (s.vy > 0) {
                        const mid = s.x + w / 2;
                        let hit: HTMLElement | null = null;
                        let hitTop = Infinity;
                        for (const line of s.seek ? [] : lines) {
                            const r = line.getBoundingClientRect();
                            if (
                                r.top >= NAV &&
                                r.top < floor &&
                                prevFeet <= r.top + 1 &&
                                feet >= r.top &&
                                mid >= r.left &&
                                mid <= r.right &&
                                r.top < hitTop
                            ) {
                                hit = line;
                                hitTop = r.top;
                            }
                        }
                        const ground = onScreen ? terrainTop(s.x, w) : null;
                        if (
                            ground !== null &&
                            feet >= ground &&
                            (s.seek || prevFeet <= ground + 1)
                        ) {
                            land("terrain", ground);
                            if (s.on === "terrain") s.seek = false;
                        } else if (hit) land(hit, hitTop);
                        else if (feet >= floor) land("floor", floor);
                    }
                }
            } else if (s.mode !== "held") {
                // standing: ride whatever we stand on as the page scrolls
                let top = floor;
                if (s.on === "terrain") {
                    const ground = terrainTop(s.x, w);
                    const feet = s.y + h;
                    if (ground === null) {
                        s.on = null;
                        setMode("fall");
                    } else if (ground < feet - 6) {
                        // a taller letter ahead: hop up onto it
                        s.on = null;
                        s.seek = true;
                        s.vx = s.dir * 150;
                        s.vy = -Math.sqrt(2 * GRAVITY * (feet - ground + 18));
                        setMode("fall");
                    } else if (ground > feet + 6) {
                        // walked off an edge
                        s.on = null;
                        s.seek = true;
                        s.vx = s.dir * 60;
                        s.vy = 0;
                        setMode("fall");
                    } else top = ground;
                } else if (s.on && s.on !== "floor") {
                    top = s.on.getBoundingClientRect().top;
                    if (top > floor) {
                        s.on = "floor";
                        top = floor;
                    } else if (top < NAV) {
                        s.on = null;
                        s.vy = 0;
                        setMode("fall");
                    }
                }
                if (s.on) s.y = top - h;

                const right = vw - w - (s.on === "floor" ? SEARCH : EDGE);
                if (!reduce && s.mode !== "sleep") {
                    if (now - s.lastMove > SLEEP_MS) setMode("sleep");
                    s.timer -= dt;
                    if (s.x > right && s.mode === "idle") {
                        s.dir = -1;
                        setMode("walk");
                        s.timer = rand(1.5, 3);
                    }
                    if (s.mode === "idle" && s.timer <= 0) {
                        s.dir =
                            s.x < EDGE + 60
                                ? 1
                                : s.x > right - 60
                                  ? -1
                                  : Math.random() < 0.5
                                    ? -1
                                    : 1;
                        setMode("walk");
                        s.timer = rand(2, 4.5);
                    } else if (s.mode === "walk") {
                        s.x +=
                            s.dir *
                            (s.on === "terrain" ? TERRAIN_WALK : WALK) *
                            dt;
                        s.step += dt;
                        if (s.x < EDGE) {
                            s.x = EDGE;
                            s.dir = 1;
                        }
                        if (s.x > right && s.dir > 0) s.dir = -1;
                        if (s.timer <= 0 && s.x <= right) {
                            setMode("idle");
                            s.timer = rand(2, 5);
                        }
                    }
                }
            }

            if (box && (s.on === "terrain" || s.seek)) {
                if (s.x < box.left) {
                    s.x = box.left;
                    s.dir = 1;
                }
                if (s.x + w > box.right) {
                    s.x = box.right - w;
                    s.dir = -1;
                }
            }

            letterTerrain.feet =
                s.on === "terrain" ? { x: s.x + w / 2, y: s.y + h } : null;

            el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;

            // legs: alternate while walking
            const a =
                s.mode === "walk" ? (Math.floor(s.step * 7) % 2 ? -2 : 0) : 0;
            legs.current[0]?.setAttribute("transform", `translate(0 ${a})`);
            legs.current[1]?.setAttribute(
                "transform",
                `translate(0 ${a ? 0 : s.mode === "walk" ? -2 : 0})`
            );

            // eyes: look at the cursor, else where we walk
            const g = pupils.current;
            if (g) {
                let dx = s.dir;
                let dy = 0;
                if (s.px >= 0 && now - s.lastMove < 4000) {
                    dx = s.px - (s.x + w / 2);
                    dy = s.py - (s.y + STEP * 1.5 * k);
                }
                if (s.mode === "held" || s.mode === "fall") dy = 1;
                const d = Math.hypot(dx, dy) || 1;
                s.blink -= dt;
                if (s.blink < -0.12) s.blink = rand(2.5, 6);
                const closed = s.blink < 0 || s.mode === "sleep";
                g.style.opacity = closed ? "0" : "1";
                g.setAttribute(
                    "transform",
                    `translate(${((dx / d) * 2.5).toFixed(2)} ${((dy / d) * 2.5).toFixed(2)})`
                );
            }

            // idle shimmer: one cell gains or loses a level, like a day changing
            if (!reduce && s.mode !== "sleep") {
                s.shimmer -= dt;
                if (s.shimmer <= 0) {
                    if (s.shimmerCell >= 0)
                        setLevel(s.shimmerCell, CELLS[s.shimmerCell].base);
                    const i = Math.floor(Math.random() * CELLS.length);
                    const c = CELLS[i];
                    if (!c.eye) {
                        setLevel(i, c.base >= 4 ? 3 : c.base + 1);
                        s.shimmerCell = i;
                    }
                    s.shimmer = rand(0.5, 1.1);
                }
            }

            if (s.mode === "held" && readout.current) {
                readout.current.textContent = `${Math.round(w)} × ${Math.round(h)} · x ${Math.round(s.x)} y ${Math.round(s.y)}`;
            }
        };
        el.dataset.mode = s.mode;
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            document.body.style.userSelect = "";
            el.removeEventListener("pointerdown", onDown);
            el.removeEventListener("pointermove", onDrag);
            el.removeEventListener("pointerup", onUp);
            el.removeEventListener("pointercancel", onUp);
            window.removeEventListener("pointermove", onLook);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div
            ref={root}
            aria-hidden="true"
            className="group block fixed top-0 left-0 z-40 touch-none select-none cursor-target"
            style={{
                width: W,
                height: H,
                transform: "translate3d(-200px,-200px,0)",
            }}
        >
            {/* held: registration crosses on the bounding box + mono readout */}
            <span className="absolute inset-[-6px] opacity-0 group-data-[mode=held]:opacity-100 transition-opacity duration-150 pointer-events-none">
                <span className="cross cross-tl" />
                <span className="cross cross-tr" />
                <span className="cross cross-bl" />
                <span className="cross cross-br" />
            </span>
            <span
                ref={readout}
                className="absolute left-1/2 -top-6 -translate-x-1/2 whitespace-nowrap font-mono tabular-nums text-[11px] text-muted-foreground opacity-0 group-data-[mode=held]:opacity-100 transition-opacity duration-150 pointer-events-none"
            />
            <span
                ref={toast}
                className="absolute left-1/2 -top-5 whitespace-nowrap font-mono tabular-nums text-[11px] text-brand opacity-0 pointer-events-none"
            >
                +1 commit
            </span>
            <span className="absolute -top-4 right-0 font-mono text-[11px] text-muted-foreground opacity-0 group-data-[mode=sleep]:opacity-100 transition-opacity duration-500 pointer-events-none">
                zz
            </span>

            <svg
                ref={art}
                width="100%"
                height="100%"
                viewBox={`0 0 ${W} ${H}`}
                className="block overflow-visible"
                style={{ transformOrigin: "50% 100%" }}
            >
                {CELLS.map((c, i) => (
                    <rect
                        key={i}
                        ref={(n) => {
                            cells.current[i] = n;
                        }}
                        x={c.x}
                        y={c.y}
                        width={CELL}
                        height={CELL}
                        data-level={c.base}
                        className={LEVEL}
                    />
                ))}
                <g
                    ref={pupils}
                    className="fill-foreground transition-opacity duration-75"
                >
                    {EYES.map((c) => (
                        <rect
                            key={c.x}
                            x={c.x + 3}
                            y={c.y + 3}
                            width={4}
                            height={4}
                        />
                    ))}
                </g>
                {/* closed eyes while asleep */}
                <g className="fill-foreground opacity-0 group-data-[mode=sleep]:opacity-100">
                    {EYES.map((c) => (
                        <rect
                            key={c.x}
                            x={c.x + 2}
                            y={c.y + 6}
                            width={6}
                            height={1.5}
                        />
                    ))}
                </g>
                {[1, 3].map((col, i) => (
                    <rect
                        key={col}
                        ref={(n) => {
                            legs.current[i] = n;
                        }}
                        x={col * STEP + 2}
                        y={4 * STEP}
                        width={CELL - 4}
                        height={LEG}
                        className="fill-brand/70"
                    />
                ))}
            </svg>
        </div>
    );
}
