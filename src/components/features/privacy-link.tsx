"use client";

import type { ReactNode } from "react";

import { openConsent } from "@/components/features/consent-banner";

/** Button that reopens the consent banner. */
export function PrivacyLink({
    children = "Cookies",
    className = "underline underline-offset-4",
}: {
    children?: ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            data-consent-trigger
            onClick={openConsent}
            className={className}
        >
            {children}
        </button>
    );
}
