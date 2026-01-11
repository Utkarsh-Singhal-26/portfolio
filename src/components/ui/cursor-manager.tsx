"use client";

import TargetCursor from "@/components/ui/target-cursor";
import useMobileDetection from "@/hooks/use-mobile";

export function CursorManager() {
    const checkMobile = useMobileDetection();

    if (checkMobile) {
        return null;
    }

    return <TargetCursor spinDuration={2} hideDefaultCursor />;
}
