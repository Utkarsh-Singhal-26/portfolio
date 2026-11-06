"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

const CORNER = 12;
const PAD = 4;
const REST = [
    { x: -CORNER * 1.5, y: -CORNER * 1.5 },
    { x: CORNER * 0.5, y: -CORNER * 1.5 },
    { x: CORNER * 0.5, y: CORNER * 0.5 },
    { x: -CORNER * 1.5, y: CORNER * 0.5 },
] as const;

export function TargetCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [on, setOn] = useState(false);

    useEffect(() => {
        const fine = window.matchMedia("(pointer: fine)");
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setOn(fine.matches && !reduce.matches);
        update();
        fine.addEventListener("change", update);
        reduce.addEventListener("change", update);
        return () => {
            fine.removeEventListener("change", update);
            reduce.removeEventListener("change", update);
        };
    }, []);

    useEffect(() => {
        if (!on || !cursorRef.current) return;

        const cursor = cursorRef.current;
        const corners = [
            ...cursor.querySelectorAll<HTMLDivElement>(".target-cursor-corner"),
        ];
        const prevCursor = document.body.style.cursor;
        document.body.style.cursor = "none";

        gsap.set(cursor, {
            xPercent: -50,
            yPercent: -50,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        });

        let spin = gsap.timeline({ repeat: -1 }).to(cursor, {
            rotation: "+=360",
            duration: 2,
            ease: "none",
        });
        let active: Element | null = null;

        const snap = (target: Element) => {
            const rect = target.getBoundingClientRect();
            const box = cursor.getBoundingClientRect();
            const ox = box.left + box.width / 2;
            const oy = box.top + box.height / 2;
            const pts = [
                { x: rect.left - ox - PAD, y: rect.top - oy - PAD },
                {
                    x: rect.right - ox + PAD - CORNER,
                    y: rect.top - oy - PAD,
                },
                {
                    x: rect.right - ox + PAD - CORNER,
                    y: rect.bottom - oy + PAD - CORNER,
                },
                {
                    x: rect.left - ox - PAD,
                    y: rect.bottom - oy + PAD - CORNER,
                },
            ];
            corners.forEach((corner, i) => {
                gsap.to(corner, {
                    x: pts[i].x,
                    y: pts[i].y,
                    duration: 0.15,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            });
        };

        const reset = () => {
            active = null;
            gsap.killTweensOf(corners);
            corners.forEach((corner, i) => {
                gsap.to(corner, {
                    ...REST[i],
                    duration: 0.3,
                    ease: "power3.out",
                    overwrite: "auto",
                });
            });
            gsap.set(cursor, { rotation: 0 });
            spin.kill();
            spin = gsap.timeline({ repeat: -1 }).to(cursor, {
                rotation: "+=360",
                duration: 2,
                ease: "none",
            });
        };

        const move = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power3.out",
                overwrite: "auto",
            });
            if (active) snap(active);
        };

        const over = (e: MouseEvent) => {
            const target =
                (e.target as Element | null)?.closest?.(".cursor-target") ??
                null;
            if (target === active) return;
            if (!target) {
                if (active) reset();
                return;
            }
            if (!active) {
                spin.pause();
                gsap.set(cursor, { rotation: 0 });
            }
            active = target;
            snap(target);
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseover", over);

        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseover", over);
            spin.kill();
            document.body.style.cursor = prevCursor;
        };
    }, [on]);

    if (!on) return null;

    return (
        <div
            ref={cursorRef}
            className="top-0 left-0 z-9999 fixed w-0 h-0 pointer-events-none mix-blend-difference"
            style={{ willChange: "transform" }}
        >
            <div className="top-1/2 left-1/2 absolute bg-white rounded-full w-1 h-1 -translate-x-1/2 -translate-y-1/2" />
            <div className="top-1/2 left-1/2 absolute border-[3px] border-white border-r-0 border-b-0 w-2.5 h-2.5 translate-x-[-150%] translate-y-[-150%] target-cursor-corner" />
            <div className="top-1/2 left-1/2 absolute border-[3px] border-white border-b-0 border-l-0 w-2.5 h-2.5 translate-x-1/2 translate-y-[-150%] target-cursor-corner" />
            <div className="top-1/2 left-1/2 absolute border-[3px] border-white border-t-0 border-l-0 w-2.5 h-2.5 translate-x-1/2 translate-y-1/2 target-cursor-corner" />
            <div className="top-1/2 left-1/2 absolute border-[3px] border-white border-t-0 border-r-0 w-2.5 h-2.5 translate-x-[-150%] translate-y-1/2 target-cursor-corner" />
        </div>
    );
}
