"use client";

import { RotateCcw } from "lucide-react";
import Matter from "matter-js";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { CHIPS, type Chip } from "@/app/data";

const CHIP_RADIUS = 14;
const ICON_RADIUS = 10;
const WALL_PAD = 16;

type ChipState = {
    chip: Chip;
    body: Matter.Body;
    width: number;
    height: number;
};

export function Stack(): ReactNode {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const measureRef = useRef<HTMLDivElement | null>(null);
    const chipRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        const measure = measureRef.current;
        if (!container || !measure) return;

        let cancelled = false;
        let cleanup: (() => void) | undefined;

        void (async () => {
            if (cancelled) return;

            const {
                Engine,
                Runner,
                World,
                Bodies,
                Body,
                Mouse,
                MouseConstraint,
                Events,
            } = Matter;

            const measureChildren = Array.from(
                measure.children
            ) as HTMLElement[];
            const dims = measureChildren.map((el) => {
                const r = el.getBoundingClientRect();
                return { w: Math.max(80, r.width), h: Math.max(28, r.height) };
            });

            let width = container.clientWidth;
            let height = container.clientHeight;

            const engine = Engine.create();
            engine.gravity.y = 1;
            const world = engine.world;

            const wallThickness = 400;
            const floor = Bodies.rectangle(
                width / 2,
                height - WALL_PAD + wallThickness / 2,
                width * 3,
                wallThickness,
                { isStatic: true }
            );
            const leftWall = Bodies.rectangle(
                WALL_PAD - wallThickness / 2,
                height / 2,
                wallThickness,
                height * 4,
                { isStatic: true }
            );
            const rightWall = Bodies.rectangle(
                width - WALL_PAD + wallThickness / 2,
                height / 2,
                wallThickness,
                height * 4,
                { isStatic: true }
            );
            World.add(world, [floor, leftWall, rightWall]);

            const states: ChipState[] = CHIPS.map((chip, i) => {
                const dim = dims[i] ?? { w: 120, h: 36 };
                const { w, h } = dim;
                const halfW = w / 2;
                const minX = WALL_PAD + halfW + 4;
                const maxX = width - WALL_PAD - halfW - 4;
                const x = minX + Math.random() * Math.max(1, maxX - minX);
                const y = -80 - i * 60 - Math.random() * 120;
                const body = Bodies.rectangle(x, y, w, h, {
                    chamfer: { radius: CHIP_RADIUS },
                    restitution: 0.35,
                    friction: 0.5,
                    frictionAir: 0.025,
                    density: 0.0018,
                    angle: (Math.random() - 0.5) * 0.4,
                });
                World.add(world, body);
                return { chip, body, width: w, height: h };
            });

            const mouse = Mouse.create(container);

            const wheelTarget = mouse.element as HTMLElement & {
                mousewheel?: EventListener;
            };
            if (wheelTarget.mousewheel) {
                wheelTarget.removeEventListener(
                    "wheel",
                    wheelTarget.mousewheel
                );
                wheelTarget.removeEventListener(
                    "DOMMouseScroll",
                    wheelTarget.mousewheel
                );
            }

            const mouseConstraint = MouseConstraint.create(engine, {
                mouse,
                constraint: {
                    stiffness: 0.2,
                    damping: 0.2,
                    render: { visible: false },
                },
            });
            World.add(world, mouseConstraint);

            Events.on(mouseConstraint, "startdrag", () => {
                container.style.cursor = "grabbing";
            });
            Events.on(mouseConstraint, "enddrag", () => {
                container.style.cursor = "grab";
            });

            const runner = Runner.create();
            Runner.run(runner, engine);

            let raf = 0;
            const tick = (): void => {
                for (let i = 0; i < states.length; i++) {
                    const s = states[i];
                    const el = chipRefs.current[i];
                    if (!s || !el) continue;
                    const { x, y } = s.body.position;
                    el.style.transform = `translate3d(${x - s.width / 2}px, ${y - s.height / 2}px, 0) rotate(${s.body.angle}rad)`;
                }
                raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);

            const onResize = (): void => {
                const newW = container.clientWidth;
                const newH = container.clientHeight;
                if (newW === width && newH === height) return;
                Body.setPosition(floor, {
                    x: newW / 2,
                    y: newH - WALL_PAD + wallThickness / 2,
                });
                Body.setPosition(leftWall, {
                    x: WALL_PAD - wallThickness / 2,
                    y: newH / 2,
                });
                Body.setPosition(rightWall, {
                    x: newW - WALL_PAD + wallThickness / 2,
                    y: newH / 2,
                });
                width = newW;
                height = newH;
            };
            const ro = new ResizeObserver(onResize);
            ro.observe(container);

            cleanup = () => {
                cancelAnimationFrame(raf);
                ro.disconnect();
                Runner.stop(runner);
                World.clear(world, false);
                Engine.clear(engine);
            };
        })();

        return () => {
            cancelled = true;
            cleanup?.();
        };
    }, [resetKey]);

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-3">
                <h2 className="font-medium text-primary/90 text-base">
                    technical stack.
                </h2>
            </div>

            <div className="relative bg-foreground/2 dark:bg-foreground/5 border border-foreground/5 rounded-4xl h-80 sm:h-92 overflow-hidden">
                <button
                    type="button"
                    onClick={() => setResetKey((k) => k + 1)}
                    aria-label="Reset stack"
                    className="inline-flex top-3 right-3 z-20 absolute justify-center items-center bg-background border border-foreground/8 rounded-xl focus-ring w-9 h-9 text-foreground/70 hover:text-foreground transition-colors"
                >
                    <RotateCcw
                        className="w-4 h-4"
                        strokeWidth={2.25}
                        aria-hidden="true"
                    />
                </button>

                <div
                    ref={measureRef}
                    aria-hidden="true"
                    className="invisible top-0 left-0 absolute flex flex-wrap gap-2 pointer-events-none"
                >
                    {CHIPS.map((chip) => (
                        <ChipPill key={`m-${chip.label}`} chip={chip} />
                    ))}
                </div>

                <div
                    ref={containerRef}
                    className="absolute inset-0 cursor-grab select-none"
                    style={{ touchAction: "none" }}
                >
                    {CHIPS.map((chip, i) => (
                        <div
                            key={`${resetKey}-${chip.label}`}
                            ref={(el) => {
                                chipRefs.current[i] = el;
                            }}
                            data-stack-chip
                            className="top-0 left-0 absolute pointer-events-none will-change-transform"
                            style={{
                                transform: "translate3d(-9999px, -9999px, 0)",
                            }}
                        >
                            <ChipPill chip={chip} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ChipPill({ chip }: { chip: Chip }): ReactNode {
    return (
        <div
            className="inline-flex items-center gap-2 p-1 pr-2 dark:ring-1 dark:ring-white/15 font-medium text-[15px] sm:text-[16px] tracking-tight"
            style={{
                backgroundColor: chip.bg,
                color: chip.fg,
                borderRadius: `${CHIP_RADIUS}px`,
            }}
        >
            <span
                className={`inline-flex justify-center items-center w-8 h-8 ${chip.darkBg ? "bg-black/95" : "bg-white/95"}`}
                style={{ borderRadius: `${ICON_RADIUS}px` }}
                aria-hidden="true"
            >
                <img
                    src={
                        chip.iconUrl ??
                        `https://cdn.simpleicons.org/${chip.slug}`
                    }
                    alt=""
                    width={18}
                    height={18}
                    className="w-5 h-5"
                    draggable={false}
                />
            </span>
            <span>{chip.label}</span>
        </div>
    );
}
