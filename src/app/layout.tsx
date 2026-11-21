import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist_Mono, Outfit } from "next/font/google";

import { BlueprintLoader } from "@/components/features/blueprint-loader";
import { Clarity } from "@/components/features/clarity";
import { CommandMenu } from "@/components/features/command-menu";
import { ConsentBanner } from "@/components/features/consent-banner";
import { Ga4 } from "@/components/features/ga4";
import { SiteControls } from "@/components/features/site-controls";
import { TargetCursorLazy } from "@/components/features/target-cursor-lazy";
import { FrameMarks } from "@/components/ui/blueprint";
import { DATA, SITE, SITE_URL } from "@/content/data";
import { bootScript } from "@/lib/boot-script";
import { CONSENT_ENABLED } from "@/lib/consent-enabled";

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

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: DATA.header.name,
            url: SITE_URL,
            jobTitle: "Software Developer",
            description: SITE.description,
            worksFor: {
                "@type": "Organization",
                name: DATA.experience[0].name,
                url: DATA.experience[0].website,
            },
            knowsAbout: [
                "TypeScript",
                "Node.js",
                "Python",
                "Django",
                "React",
                "Next.js",
                "Open source software",
            ],
            sameAs: [
                DATA.header.github,
                DATA.header.linkedin,
                `https://x.com/${SITE.twitterCreator.slice(1)}`,
            ],
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: SITE.title,
            description: SITE.description,
            publisher: { "@id": `${SITE_URL}/#person` },
        },
        {
            "@type": "ProfilePage",
            "@id": `${SITE_URL}/#profilepage`,
            url: SITE_URL,
            name: SITE.title,
            isPartOf: { "@id": `${SITE_URL}/#website` },
            mainEntity: { "@id": `${SITE_URL}/#person` },
        },
    ],
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
                            </div>
                        </div>
                        <SiteControls />
                        <TargetCursorLazy />
                    </CommandMenu>
                </ThemeProvider>

                {process.env.VERCEL_ENV &&
                    process.env.NEXT_PUBLIC_CLARITY_ID && (
                        <Clarity id={process.env.NEXT_PUBLIC_CLARITY_ID} />
                    )}
                {process.env.VERCEL_ENV && process.env.NEXT_PUBLIC_GA_ID && (
                    <Ga4 id={process.env.NEXT_PUBLIC_GA_ID} />
                )}
                {CONSENT_ENABLED && <ConsentBanner />}
                {process.env.VERCEL_ENV && <Analytics />}
                {process.env.VERCEL_ENV && <SpeedInsights />}
            </body>
        </html>
    );
}
