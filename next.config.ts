import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Static CSP: a nonce-based one would force every page to render dynamically.
// 'unsafe-inline' scripts cover Next's inline RSC payload, the loader-skip
// script and the Clarity bootstrap; everything else is pinned to known origins.
const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.clarity.ms https://scripts.clarity.ms`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    "connect-src 'self' https://*.clarity.ms https://c.bing.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
    productionBrowserSourceMaps: false,
    images: {
        deviceSizes: [420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: csp,
                    },
                    {
                        key: "Cross-Origin-Opener-Policy",
                        value: "same-origin",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
