"use client";

import dynamic from "next/dynamic";

export const TargetCursorLazy = dynamic(
    () =>
        import("@/components/ui/target-cursor").then((mod) => mod.TargetCursor),
    { ssr: false }
);
