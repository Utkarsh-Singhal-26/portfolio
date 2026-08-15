import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { SITE } from "@/app/data";
import { CommandMenu } from "@/components/command-menu";
import { SiteControls } from "@/components/site-controls";
import { FrameMarks } from "@/components/ui/blueprint";
import { TargetCursorLazy } from "@/components/ui/target-cursor-lazy";

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

const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://utkarsh-singhal.is-a.dev";

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
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
        url: baseUrl,
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
    authors: [
        { name: "Utkarsh Singhal", url: "https://utkarsh-singhal.is-a.dev/" },
    ],
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
            <body
                className={`${outfit.className} min-h-dvh w-full overflow-x-clip bg-background text-foreground antialiased`}
            >
                <a href="#content" className="skip-link">
                    Skip to content
                </a>
                <div className="grain" aria-hidden="true" />

                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <CommandMenu>
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

                {process.env.VERCEL_ENV && <Analytics />}
                {process.env.VERCEL_ENV && <SpeedInsights />}
            </body>
        </html>
    );
}
