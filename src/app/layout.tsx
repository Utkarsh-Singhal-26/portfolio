import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { FrameMarks } from "@/components/ui/blueprint";
import { TargetCursor } from "@/components/ui/target-cursor";

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
    title: "Utkarsh Singhal | Software Developer",
    description:
        "SDE-1 backend at Suraasa. TypeScript, Django, and Node. Contributor to Vue Bits and React Bits.",
    alternates: {
        canonical: "/",
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Utkarsh Singhal | Software Developer",
        description:
            "SDE-1 backend at Suraasa. TypeScript, Django, and Node. Contributor to Vue Bits and React Bits.",
        url: baseUrl,
        type: "website",
        images: [
            {
                url: "https://utkarsh-singhal.is-a.dev/opengraph-image.png",
                width: 1200,
                height: 630,
                alt: "Utkarsh Singhal | Software Developer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        creator: "@Utkarsh_2604",
    },
    authors: [
        { name: "Utkarsh Singhal", url: "https://utkarsh-singhal.is-a.dev/" },
    ],
    keywords: [
        "Utkarsh Singhal",
        "Software Developer",
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
                    <div className="w-full overflow-x-clip">
                        <div className="relative mx-auto w-full max-w-280 border-x border-line">
                            <FrameMarks />
                            {children}
                        </div>
                    </div>
                    <TargetCursor />
                </ThemeProvider>

                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
