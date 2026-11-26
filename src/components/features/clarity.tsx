"use client";

import { useEffect } from "react";

import {
    applyConsent,
    useStoredConsent,
} from "@/components/features/consent-banner";

type Queue = { (...args: unknown[]): void; q?: unknown[][] };

// Loaded only after the visitor accepts: with consent denied Clarity still
// records, just without cookies.
export function Clarity({ id }: { id: string }) {
    const granted = useStoredConsent() === "granted";

    useEffect(() => {
        const w = window as unknown as { clarity?: Queue };
        if (!granted || w.clarity) return;

        // Microsoft's tag throws unless this queue exists before it runs.
        const clarity: Queue = (...args) => {
            (clarity.q ||= []).push(args);
        };
        w.clarity = clarity;
        applyConsent(true);

        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.clarity.ms/tag/${id}`;
        document.head.append(script);
    }, [granted, id]);

    return null;
}
