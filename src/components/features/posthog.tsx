"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

import { CONSENT_KEY } from "@/components/features/consent-banner";
import { trackHref } from "@/lib/analytics";

// One delegated listener covers every anchor; see lib/analytics for the events.
function onClick(e: MouseEvent) {
    const a = (e.target as Element | null)?.closest?.("a[href]");
    if (a instanceof HTMLAnchorElement) trackHref(a.href, "link");
}

// Capturing is opted out until the visitor accepts (or accepted earlier);
// applyConsent() flips it afterwards.
export function PostHog({ apiKey }: { apiKey: string }) {
    useEffect(() => {
        let granted = false;
        try {
            granted = localStorage.getItem(CONSENT_KEY) === "granted";
        } catch {}
        posthog.init(apiKey, {
            api_host: "/ingest", // proxied in next.config.ts, dodges ad blockers
            ui_host: "https://us.posthog.com",
            defaults: "2026-08-30", // latest snapshot; page views on history change (App Router)
            opt_out_capturing_by_default: !granted,
            person_profiles: "identified_only",
            capture_exceptions: true, // error tracking
        });
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, [apiKey]);
    return null;
}
