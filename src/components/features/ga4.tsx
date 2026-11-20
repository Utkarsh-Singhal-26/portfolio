"use client";

import Script from "next/script";

import { CONSENT_KEY } from "@/components/features/consent-banner";

// Consent Mode v2: storage denied until the visitor accepts (or accepted earlier).
export function Ga4({ id }: { id: string }) {
    return (
        <>
            <Script id="ga4-init" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
var g=false;try{g=localStorage.getItem(${JSON.stringify(CONSENT_KEY)})==="granted"}catch(e){}
var s=g?"granted":"denied";
gtag("consent","default",{ad_storage:s,analytics_storage:s,ad_user_data:s,ad_personalization:s});
gtag("js",new Date());gtag("config",${JSON.stringify(id)});`}
            </Script>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
                strategy="afterInteractive"
            />
        </>
    );
}
