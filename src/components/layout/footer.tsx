"use client";

import {
    ArrowUpIcon,
    FileTextIcon,
    GithubLogoIcon,
    LinkedinLogoIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef } from "react";

import { letterTerrain } from "@/components/features/floating-mascot";
import { AccentSwitcher } from "@/components/ui/accent-switcher";
import { MovingElement } from "@/components/ui/moving-element";
import { DATA } from "@/content/data";

const currentYear = () => new Date().getFullYear();

const WORD = "utkarsh.";
const WORD_SIZE = 295;
const WORD_WIDTH = 1112;
const WORD_X = 8;
const WORD_BASELINE = 292;
const WORD_HEIGHT = 232; // above the baseline: the page edge hides about 34%

const HEAT_DECAY = 1.5;

type Cell = { x: number; y: number };

// Same five steps as the contribution graph; level 0 is the empty day.
const levelColor = (level: number, brand: string, ink: string) =>
    level === 0
        ? `hsl(${ink} / 0.1)`
        : `hsl(${brand} / ${[0, 0.25, 0.45, 0.7, 1][level]})`;

// An even grid over the glyphs. Edge squares are trimmed by the letter mask.
function cellsFrom(data: Uint8ClampedArray, step: number) {
    const size = step * 0.75;
    const inside = (x: number, y: number) =>
        data[(Math.round(y) * WORD_WIDTH + Math.round(x)) * 4 + 3] > 128;
    const cells: Cell[] = [];
    for (let y = 0; y + size < WORD_HEIGHT; y += step) {
        for (let x = 0; x + size < WORD_WIDTH; x += step) {
            if (
                inside(x, y) ||
                inside(x + size, y) ||
                inside(x, y + size) ||
                inside(x + size, y + size)
            )
                cells.push({ x, y });
        }
    }
    return cells;
}

// Letters Commit walks on. Column tops are read from the real glyph pixels.
function LetterTerrain() {
    const ref = useRef<SVGSVGElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const svg = ref.current;
        const canvas = canvasRef.current;
        const out = canvas?.getContext("2d");
        if (!svg || !canvas || !out) return undefined;

        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        const pointer = { x: -9999, y: -9999 };
        let cells: Cell[] = [];
        let heat = new Float32Array(0);
        let glyphs: Uint8ClampedArray | null = null;
        let font = "";
        let step = 0;
        let alive = true;
        let visible = false;
        let raf = 0;
        let last = performance.now();

        const warm = (
            box: DOMRect,
            clientX: number,
            clientY: number,
            scale: number
        ) => {
            const px = (clientX - box.left) * scale;
            const py = (clientY - box.top) * scale;
            cells.forEach((cell, i) => {
                const d = Math.hypot(cell.x - px, cell.y - py);
                if (d < step * 8)
                    heat[i] = Math.max(heat[i], (1 - d / (step * 8)) * 4.4);
            });
        };

        const draw = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            const box = svg.getBoundingClientRect();
            const scale = WORD_WIDTH / box.width;
            // phones scale the word down: keep the squares visibly square
            const nextStep = box.width < 640 ? 20 : 8;
            if (glyphs && nextStep !== step) {
                step = nextStep;
                cells = cellsFrom(glyphs, step);
                heat = new Float32Array(cells.length);
            }
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const width = Math.round(box.width * dpr);
            const height = Math.round(box.height * dpr);
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }
            const decay = Math.exp(-dt * HEAT_DECAY);
            for (let i = 0; i < heat.length; i++) heat[i] *= decay;
            if (!reduce) {
                warm(box, pointer.x, pointer.y, scale);
                const { feet } = letterTerrain;
                if (feet) warm(box, feet.x, feet.y, scale);
            }

            const styles = getComputedStyle(svg);
            const brand = styles.getPropertyValue("--brand").trim();
            const ink = styles.getPropertyValue("--foreground").trim();
            out.setTransform(1, 0, 0, 1, 0, 0);
            out.clearRect(0, 0, width, height);
            out.setTransform(
                width / WORD_WIDTH,
                0,
                0,
                height / WORD_HEIGHT,
                0,
                0
            );
            for (let level = 0; level <= 4; level++) {
                out.fillStyle = levelColor(level, brand, ink);
                out.beginPath();
                cells.forEach((cell, i) => {
                    if (Math.min(4, Math.round(heat[i])) === level)
                        out.rect(cell.x, cell.y, step * 0.75, step * 0.75);
                });
                out.fill();
            }
            out.globalCompositeOperation = "destination-in";
            out.font = font;
            out.fillStyle = "#000";
            out.fillText(WORD, WORD_X, WORD_BASELINE);
            out.globalCompositeOperation = "source-over";
        };

        const tick = (now: number) => {
            draw(now);
            raf = visible && alive && !reduce ? requestAnimationFrame(tick) : 0;
        };
        const start = () => {
            if (raf || !visible || !alive || cells.length === 0) return;
            last = performance.now();
            raf = requestAnimationFrame(tick);
        };
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            start();
        });
        observer.observe(svg);
        const onPointer = (e: PointerEvent) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
        };
        window.addEventListener("pointermove", onPointer, { passive: true });

        void document.fonts.ready.then(() => {
            const ctx = document
                .createElement("canvas")
                .getContext("2d", { willReadFrequently: true });
            if (!ctx || !alive) return;
            ctx.canvas.width = WORD_WIDTH;
            ctx.canvas.height = WORD_HEIGHT;
            font = `600 ${WORD_SIZE}px ${getComputedStyle(svg).fontFamily}`;
            ctx.font = font;
            ctx.fillText(WORD, WORD_X, WORD_BASELINE);
            const { data } = ctx.getImageData(0, 0, WORD_WIDTH, WORD_HEIGHT);
            const tops = new Float32Array(WORD_WIDTH).fill(1);
            for (let x = 0; x < WORD_WIDTH; x++) {
                for (let y = 0; y < WORD_HEIGHT; y++) {
                    if (data[(y * WORD_WIDTH + x) * 4 + 3] > 128) {
                        tops[x] = y / WORD_HEIGHT;
                        break;
                    }
                }
            }
            // Columns with no ink are gaps the crop opened: bridge them at the
            // lower neighbour's height so Commit stays on top of the word.
            for (let x = 0; x < WORD_WIDTH; x++) {
                if (tops[x] < 1) continue;
                let end = x;
                while (end < WORD_WIDTH && tops[end] === 1) end++;
                const level = Math.max(
                    x > 0 ? tops[x - 1] : 0,
                    end < WORD_WIDTH ? tops[end] : 0
                );
                tops.fill(level, x, end);
                x = end;
            }
            letterTerrain.el = svg;
            letterTerrain.tops = tops;
            glyphs = data;
            step = window.innerWidth < 640 ? 20 : 8;
            cells = cellsFrom(data, step);
            heat = new Float32Array(cells.length);
            start();
        });

        return () => {
            alive = false;
            cancelAnimationFrame(raf);
            observer.disconnect();
            window.removeEventListener("pointermove", onPointer);
            letterTerrain.el = null;
            letterTerrain.tops = null;
        };
    }, []);

    return (
        <div
            aria-hidden="true"
            className="relative pointer-events-none select-none"
        >
            <svg
                ref={ref}
                className="block w-full h-auto"
                viewBox={`0 0 ${WORD_WIDTH} ${WORD_HEIGHT}`}
            >
                <text
                    className="stroke-foreground/30 font-semibold"
                    fontSize={WORD_SIZE}
                    strokeWidth={2}
                    style={{
                        fill: "var(--color-background)",
                        paintOrder: "stroke",
                    }}
                    x={WORD_X}
                    y={WORD_BASELINE}
                >
                    {WORD}
                </text>
            </svg>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
}

export function Footer() {
    const { github, linkedin, resume } = DATA.header;

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <footer className="relative w-full">
            <div className="flex flex-row justify-between items-center gap-4 px-5 sm:px-6 py-4 rule-b">
                <span className="cross cross-bl" />
                <span className="cross cross-br" />
                <p className="font-mono tabular-nums text-[12px] text-muted-foreground whitespace-nowrap cursor-target p-2">
                    © {currentYear()}
                    <span className="mx-2 text-foreground/25">/</span>
                    <a
                        className="hover:text-foreground underline underline-offset-4"
                        href={`${github}/portfolio`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Source
                    </a>
                </p>
                <div className="flex items-center gap-1">
                    <MovingElement href={github} ariaLabel="GitHub">
                        <GithubLogoIcon
                            size={18}
                            weight="light"
                            aria-hidden="true"
                        />
                    </MovingElement>
                    <MovingElement href={linkedin} ariaLabel="LinkedIn">
                        <LinkedinLogoIcon
                            size={18}
                            weight="light"
                            aria-hidden="true"
                        />
                    </MovingElement>
                    <MovingElement href={resume} ariaLabel="Resume">
                        <FileTextIcon
                            size={18}
                            weight="light"
                            aria-hidden="true"
                        />
                    </MovingElement>
                    <span className="bg-line mx-2 w-px h-4" />
                    <button
                        type="button"
                        aria-label="Back to top"
                        className="inline-flex items-center gap-2 px-2 py-2 text-muted-foreground hover:text-foreground text-sm cursor-target"
                        onClick={scrollToTop}
                    >
                        <span className="hidden sm:inline">Back to top</span>
                        <ArrowUpIcon size={14} weight="light" />
                    </button>
                </div>
            </div>
            <AccentSwitcher />
            <LetterTerrain />
        </footer>
    );
}
