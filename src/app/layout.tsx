import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist_Mono, Outfit } from "next/font/google";

import { AgentLens } from "@/components/features/agent-lens";
import { BlueprintLoader } from "@/components/features/blueprint-loader";
import { Clarity } from "@/components/features/clarity";
import { CommandMenu } from "@/components/features/command-menu";
import { ConsentBanner } from "@/components/features/consent-banner";
import { GlobalMascot } from "@/components/features/floating-mascot";
import { PostHog } from "@/components/features/posthog";
import { RouteBand } from "@/components/features/route-band";
import { SiteControls } from "@/components/features/site-controls";
import { TargetCursorLazy } from "@/components/features/target-cursor-lazy";
import { AudienceToggle } from "@/components/ui/audience-toggle";
import { FrameMarks } from "@/components/ui/blueprint";
import { DATA, SITE, SITE_URL } from "@/content/data";
import { bootScript } from "@/lib/boot-script";
import { CONSENT_ENABLED } from "@/lib/consent-enabled";
import { jsonLd } from "@/lib/json-ld";

const outfit = Outfit({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-outfit",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geist-mono",
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: SITE.title,
    description: SITE.description,
    alternates: {
        canonical: "/",
        types: { "text/markdown": "/index.md" },
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: SITE.title,
        description: SITE.description,
        url: SITE_URL,
        type: "website",
        locale: "en_US",
        siteName: "Utkarsh Singhal",
    },
    twitter: {
        card: "summary_large_image",
        creator: SITE.twitterCreator,
        title: SITE.title,
        description: SITE.description,
    },
    authors: [{ name: DATA.header.name, url: `${SITE_URL}/` }],
    keywords: [
        "Utkarsh Singhal",
        "Software Developer",
        "Open Source",
        "Full-Stack Developer",
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "AWS",
        "GCP",
        "MongoDB",
        "Firebase",
        "Tailwind CSS",
        "Web Development",
    ],
    creator: "Utkarsh Singhal",
    publisher: "Utkarsh Singhal",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${outfit.variable} ${geistMono.variable}`}
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: bootScript }} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                    }}
                />
            </head>
            <body
                className={`${outfit.className} min-h-dvh w-full bg-background text-foreground antialiased`}
            >
                <a href="#content" className="skip-link">
                    Skip to content
                </a>
                <div className="grain" aria-hidden="true" />
                <BlueprintLoader />
                <RouteBand />

                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <CommandMenu consent={CONSENT_ENABLED}>
                        <div className="w-full overflow-x-clip">
                            <div className="relative mx-auto border-line border-x w-full max-w-280">
                                <FrameMarks />
                                {children}
                                <AgentLens />
                            </div>
                        </div>
                        <GlobalMascot />
                        <SiteControls />
                        <AudienceToggle />
                        <TargetCursorLazy />
                    </CommandMenu>
                </ThemeProvider>

                {process.env.VERCEL_ENV &&
                    process.env.NEXT_PUBLIC_CLARITY_ID && (
                        <Clarity id={process.env.NEXT_PUBLIC_CLARITY_ID} />
                    )}
                {process.env.VERCEL_ENV &&
                    process.env.NEXT_PUBLIC_POSTHOG_KEY && (
                        <PostHog apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY} />
                    )}
                {CONSENT_ENABLED && <ConsentBanner />}
                {process.env.VERCEL_ENV && <Analytics />}
                {process.env.VERCEL_ENV && <SpeedInsights />}
            </body>
        </html>
    );
}
