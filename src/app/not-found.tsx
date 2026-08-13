import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { DATA } from "@/app/data";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { Stripe } from "@/components/ui/blueprint";
import { CtaLink } from "@/components/ui/cta-link";

const PLACES = [
    { href: "/", label: "Home", hint: "The whole site lives here" },
    {
        href: "/#experience",
        label: "Experience",
        hint: "Roles, dates, and stack",
    },
    {
        href: "/#open-source",
        label: "Open source",
        hint: "Merged PRs on other repos",
    },
    {
        href: DATA.HEADER.RESUME,
        label: "Resume",
        hint: "PDF",
        external: true,
    },
    {
        href: DATA.HEADER.EMAIL,
        label: "Email",
        hint: "Fastest way to reach me",
    },
] as const;

export default function NotFound() {
    return (
        <>
            <Navbar />
            <main
                id="content"
                className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                >
                    <span className="absolute -right-6 bottom-10 select-none font-semibold text-[min(48vw,22rem)] leading-none text-foreground/[0.045] sm:-right-4">
                        404
                    </span>
                </div>

                <div className="cell relative z-10 grid flex-1 items-end gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)] lg:items-center">
                    <div>
                        <p className="font-mono text-[13px] text-muted-foreground tabular-nums">
                            404
                        </p>
                        <h1 className="mt-3 max-w-[12ch] text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.05]">
                            This page is not here
                        </h1>
                        <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-muted-foreground">
                            Nothing lives at this URL. Home has experience, open
                            source, and how to reach me.
                        </p>
                        <div className="mt-8">
                            <CtaLink href="/">Home</CtaLink>
                        </div>
                    </div>

                    <nav aria-label="Places that exist">
                        <ul className="border border-line">
                            {PLACES.map((place) => (
                                <li
                                    key={place.href}
                                    className="border-b border-line last:border-b-0"
                                >
                                    {place.external ? (
                                        <a
                                            href={place.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cursor-target group flex items-baseline justify-between gap-4 px-5 py-4"
                                        >
                                            <span className="text-sm font-medium tracking-tight text-foreground">
                                                {place.label}
                                            </span>
                                            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                                                {place.hint}
                                                <ArrowUpRight
                                                    size={12}
                                                    weight="light"
                                                    className="transition-transform duration-300 ease-premium group-hover:translate-x-px group-hover:-translate-y-px"
                                                />
                                            </span>
                                        </a>
                                    ) : (
                                        <Link
                                            href={place.href}
                                            className="cursor-target group flex items-baseline justify-between gap-4 px-5 py-4"
                                        >
                                            <span className="text-sm font-medium tracking-tight text-foreground">
                                                {place.label}
                                            </span>
                                            <span className="font-mono text-[11px] text-muted-foreground">
                                                {place.hint}
                                            </span>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="relative z-10">
                    <Stripe />
                    <Footer />
                </div>
            </main>
        </>
    );
}
