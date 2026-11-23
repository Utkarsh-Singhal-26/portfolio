import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Developers } from "@/components/sections/developers";
import { Stripe } from "@/components/ui/blueprint";
import { DATA, SITE_URL } from "@/content/data";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
    title: "Developers",
    description: `${DATA.header.name}'s site as plain text, Markdown and JSON: llms.txt, a read-only API and an OpenAPI spec. No keys.`,
    path: "/developers",
});

export default function DevelopersPage() {
    return (
        <>
            <Navbar />
            <main id="content" className="relative">
                <h1 className="sr-only">Developers</h1>
                <Developers siteUrl={SITE_URL} />
                <Stripe />
                <Footer />
            </main>
        </>
    );
}
