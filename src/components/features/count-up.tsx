"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Renders the real value on the server, then counts up once it scrolls into view.
export function CountUp({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-10%" });
    const reduce = useReducedMotion();
    const [shown, setShown] = useState(value);

    useEffect(() => {
        if (!inView || reduce) return;
        const controls = animate(0, value, {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => setShown(Math.round(latest)),
        });
        return () => controls.stop();
    }, [inView, reduce, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {shown.toLocaleString("en")}
        </span>
    );
}
