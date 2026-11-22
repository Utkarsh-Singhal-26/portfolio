import type { Metadata } from "next";

import { FloatingMascot } from "@/components/features/floating-mascot";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Developers } from "@/components/sections/developers";
import { Stripe } from "@/components/ui/blueprint";
import { DATA, SITE_URL } from "@/content/data";

export const metadata: Metadata = {
    title: "Developers",
    description: `${DATA.header.name}'s site as plain text, Markdown and JSON: llms.txt, a read-only API and an OpenAPI spec. No keys.`,
    alternates: {
        canonical: `${SITE_URL}/developers`,
        types: { "text/markdown": "/developers.md" },
    },
};

export default function DevelopersPage() {
    return (
        <>
            <Navbar />
            <FloatingMascot />
            <main id="content" className="relative">
                <h1 className="sr-only">Developers</h1>
                <Developers siteUrl={SITE_URL} />
                <Stripe />
                <Footer />
            </main>
        </>
    );
}
