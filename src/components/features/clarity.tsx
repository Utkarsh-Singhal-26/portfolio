"use client";

import Script from "next/script";

import {
    applyConsent,
    CONSENT_KEY,
} from "@/components/features/consent-banner";

export function Clarity({ id }: { id: string }) {
    return (
        <Script
            id="ms-clarity"
            src={`https://www.clarity.ms/tag/${id}`}
            strategy="afterInteractive"
            onReady={() => {
                try {
                    applyConsent(
                        localStorage.getItem(CONSENT_KEY) === "granted"
                    );
                } catch {}
            }}
        />
    );
}
