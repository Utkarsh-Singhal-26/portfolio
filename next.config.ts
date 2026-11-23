import { execSync } from "node:child_process";

import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

function buildCommit() {
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
        return process.env.VERCEL_GIT_COMMIT_SHA;
    }
    try {
        return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
    } catch {
        return "";
    }
}

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
    poweredByHeader: false,
    skipTrailingSlashRedirect: true, // PostHog API paths need their trailing slash
    env: {
        BUILD_COMMIT: buildCommit(),
        BUILD_DATE: new Date().toISOString(),
    },
    images: {
        deviceSizes: [420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    async rewrites() {
        const has = [
            {
                type: "header" as const,
                key: "accept",
                value: ".*text/markdown.*",
            },
        ];
        return {
            beforeFiles: [
                // PostHog reverse proxy (US cloud): first-party path, fewer blocked events.
                {
                    source: "/ingest/static/:path*",
                    destination:
                        "https://us-assets.i.posthog.com/static/:path*",
                },
                {
                    source: "/ingest/array/:path*",
                    destination: "https://us-assets.i.posthog.com/array/:path*",
                },
                {
                    source: "/ingest/:path*",
                    destination: "https://us.i.posthog.com/:path*",
                },
                { source: "/", has, destination: "/index.md" },
                { source: "/privacy", has, destination: "/privacy.md" },
                { source: "/developers", has, destination: "/developers.md" },
                { source: "/resume", has, destination: "/resume.md" },
                { source: "/activity", has, destination: "/activity.md" },
            ],
        };
    },
    async headers() {
        return [
            // The same URL can answer HTML or Markdown, so caches must key on Accept.
            { source: "/", headers: [{ key: "Vary", value: "Accept" }] },
            { source: "/privacy", headers: [{ key: "Vary", value: "Accept" }] },
            {
                source: "/developers",
                headers: [{ key: "Vary", value: "Accept" }],
            },
            { source: "/resume", headers: [{ key: "Vary", value: "Accept" }] },
            {
                source: "/activity",
                headers: [{ key: "Vary", value: "Accept" }],
            },
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
                        // same-site: other sites can't hot-link this site's files in a
                        // browser. Not COEP: it would block Clarity and the logo CDNs.
                        key: "Cross-Origin-Resource-Policy",
                        value: "same-site",
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
