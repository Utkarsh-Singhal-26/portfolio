"use client";

import dynamic from "next/dynamic";

export const TargetCursorLazy = dynamic(
    () =>
        import("@/components/features/target-cursor").then(
            (mod) => mod.TargetCursor
        ),
    { ssr: false }
);
