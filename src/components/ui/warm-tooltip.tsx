"use client";

import {
    animate,
    motion,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from "framer-motion";
import {
    type ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const GAP = 8;
const MARGIN = 8;
const POP_MS = 0.16;
const GRACE = 80;
const TRAVEL = { type: "spring", duration: 0.32, bounce: 0.1 } as const;

const now = () => performance.now();

const viewportWidth = () =>
    typeof window === "undefined"
        ? Number.POSITIVE_INFINITY
        : window.innerWidth;

type Tip = { el: Element; label: string };

export function WarmTooltipField({
    children,
    selector,
    getLabel,
    delay = 300,
    warmWindow = 300,
    className,
}: {
    children: ReactNode;
    selector: string;
    getLabel: (el: Element) => string;
    delay?: number;
    warmWindow?: number;
    className?: string;
}) {
    const reduce = useReducedMotion();
    const [tip, setTip] = useState<Tip | null>(null);
    const s = useRef({
        open: false,
        warmUntil: 0,
        openTimer: 0 as number | undefined,
        closeTimer: 0 as number | undefined,
        target: null as Element | null,
        fresh: true,
    });
    const textRef = useRef<HTMLSpanElement>(null);

    const ax = useMotionValue(0);
    const ay = useMotionValue(0);
    const w = useMotionValue(0);
    const h = useMotionValue(0);
    const presence = useMotionValue(0);

    const left = useTransform([ax, w], ([x, width]: number[]) =>
        Math.min(
            Math.max(x - width / 2, MARGIN),
            Math.max(MARGIN, viewportWidth() - MARGIN - width)
        )
    );
    const place = useTransform(
        [left, ay, h],
        ([x, y, height]: number[]) => `translate(${x}px, ${y - height}px)`
    );
    const arrowX = useTransform([ax, left, w], ([x, l, width]: number[]) =>
        Math.min(Math.max(x - l, 10), width - 10)
    );
    const scale = useTransform(presence, (p) => (reduce ? 1 : 0.94 + 0.06 * p));
    const blur = useTransform(presence, (p) =>
        reduce ? "none" : `blur(${4 * (1 - p)}px)`
    );

    const anchor = (el: Element): [number, number] => {
        const r = el.getBoundingClientRect();
        return [r.left + r.width / 2, r.top - GAP];
    };

    const close = useCallback(
        (instant = false) => {
            const c = s.current;
            clearTimeout(c.openTimer);
            clearTimeout(c.closeTimer);
            c.target = null;
            if (!c.open) return;
            c.open = false;
            c.warmUntil = now() + warmWindow;
            const finish = () => {
                if (!c.open) setTip(null);
            };
            if (instant || reduce) {
                presence.jump(0);
                finish();
                return;
            }
            animate(presence, 0, { duration: POP_MS * 0.8, ease: EASE_OUT });
            c.closeTimer = window.setTimeout(finish, POP_MS * 800);
        },
        [presence, reduce, warmWindow]
    );

    const show = (el: Element) => {
        const c = s.current;
        clearTimeout(c.closeTimer);
        c.fresh = !c.open;
        c.open = true;
        c.target = el;
        setTip({ el, label: getLabel(el) });
    };

    useLayoutEffect(() => {
        const c = s.current;
        const text = textRef.current;
        if (!tip || !text) return;
        const [x, y] = anchor(tip.el);
        const tw = text.offsetWidth + 20;
        const th = text.offsetHeight + 12;
        if (!c.fresh && !reduce) {
            animate(ax, x, TRAVEL);
            animate(ay, y, TRAVEL);
            animate(w, tw, TRAVEL);
            animate(h, th, TRAVEL);
            animate(presence, 1, { duration: 0.12, ease: EASE_OUT });
            return;
        }
        ax.jump(x);
        ay.jump(y);
        w.jump(tw);
        h.jump(th);
        presence.jump(0);
        if (reduce) presence.jump(1);
        else animate(presence, 1, { duration: POP_MS, ease: EASE_OUT });
    }, [tip, ax, ay, w, h, presence, reduce]);

    useEffect(() => {
        if (!tip) return;
        const hide = () => close(true);
        window.addEventListener("scroll", hide, {
            capture: true,
            passive: true,
        });
        window.addEventListener("resize", hide);
        return () => {
            window.removeEventListener("scroll", hide, { capture: true });
            window.removeEventListener("resize", hide);
        };
    }, [tip, close]);

    useEffect(
        () => () => {
            clearTimeout(s.current.openTimer);
            clearTimeout(s.current.closeTimer);
        },
        []
    );

    const onOver = (e: React.PointerEvent) => {
        const c = s.current;
        const el = (e.target as Element).closest?.(selector) ?? null;
        if (!el) return leave();
        if (el === c.target) {
            clearTimeout(c.closeTimer);
            return;
        }
        clearTimeout(c.openTimer);
        clearTimeout(c.closeTimer);
        const warm = c.open || now() < c.warmUntil;
        if (warm || e.pointerType === "touch") {
            show(el);
            return;
        }
        c.target = el;
        c.openTimer = window.setTimeout(() => show(el), delay);
    };

    const leave = () => {
        const c = s.current;
        clearTimeout(c.openTimer);
        if (!c.open) {
            c.target = null;
            return;
        }
        clearTimeout(c.closeTimer);
        c.closeTimer = window.setTimeout(() => close(), GRACE);
    };

    return (
        <div
            className={className}
            onPointerOver={onOver}
            onPointerLeave={leave}
        >
            {children}
            {tip && typeof document !== "undefined"
                ? createPortal(
                      <motion.span
                          role="tooltip"
                          aria-hidden="true"
                          className="top-0 left-0 z-9999 fixed pointer-events-none"
                          style={{ transform: place, width: w, height: h }}
                      >
                          <motion.span
                              className="absolute inset-0 bg-foreground shadow-[0_1px_2px_rgb(0_0_0/0.12),0_8px_24px_-8px_rgb(0_0_0/0.45)] rounded-lg text-background origin-bottom"
                              style={{ opacity: presence, scale, filter: blur }}
                          >
                              <span className="absolute inset-0 flex justify-center items-center">
                                  <span
                                      ref={textRef}
                                      className="font-sans font-medium text-xs tracking-tight whitespace-nowrap"
                                  >
                                      {tip.label}
                                  </span>
                              </span>
                              <motion.span
                                  className="bottom-px absolute bg-foreground -m-1 rounded-[2px] size-2 rotate-45"
                                  style={{ left: arrowX }}
                              />
                          </motion.span>
                      </motion.span>,
                      document.body
                  )
                : null}
        </div>
    );
}
