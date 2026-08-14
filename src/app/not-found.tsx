import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { DATA } from "@/app/data";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { Stripe } from "@/components/ui/blueprint";
import { CtaLink } from "@/components/ui/cta-link";

const PLACES = [
    { href: "/", label: "Home", hint: "The whole site lives here" },
    {
        href: "/#work",
        label: "Work",
        hint: "Contributions and things I shipped",
    },
    {
        href: "/#experience",
        label: "Experience",
        hint: "Roles and dates",
    },
    {
        href: "/#open-source",
        label: "Open source",
        hint: "Merged pull requests",
    },
    {
        href: "/#writing",
        label: "Writing",
        hint: "Notes on TypeScript",
    },
    {
        href: DATA.HEADER.RESUME,
        label: "Resume",
        hint: "PDF",
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
                className="relative flex flex-col min-h-[calc(100dvh-3.5rem)]"
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                >
                    <span className="-right-6 sm:-right-4 bottom-10 absolute font-semibold text-[min(48vw,22rem)] text-foreground/4.5 leading-none select-none">
                        404
                    </span>
                </div>

                <div className="z-10 relative flex-1 items-end lg:items-center gap-12 grid lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)] cell">
                    <div>
                        <p className="font-mono tabular-nums text-[13px] text-muted-foreground">
                            404
                        </p>
                        <h1 className="mt-3 max-w-[12ch] font-semibold text-4xl md:text-6xl md:leading-[1.05] tracking-tight">
                            This page does not exist
                        </h1>
                        <p className="mt-4 max-w-[40ch] text-muted-foreground text-base leading-relaxed">
                            This URL does not exist. Home has work, experience,
                            and email.
                        </p>
                        <div className="mt-8">
                            <CtaLink href="/">Home</CtaLink>
                        </div>
                    </div>

                    <nav aria-label="Places that exist">
                        <ul className="border border-line">
                            {PLACES.map((place) => {
                                const external =
                                    place.href.startsWith("http") ||
                                    place.href.startsWith("mailto:");
                                return (
                                    <li
                                        key={place.href}
                                        className="border-line border-b last:border-b-0"
                                    >
                                        {external ? (
                                            <a
                                                href={place.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex justify-between items-baseline gap-4 px-5 py-4 cursor-target"
                                            >
                                                <span className="font-medium text-foreground text-sm tracking-tight">
                                                    {place.label}
                                                </span>
                                                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                                                    {place.hint}
                                                    <ArrowUpRightIcon
                                                        size={12}
                                                        weight="light"
                                                        className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px duration-300 ease-premium"
                                                    />
                                                </span>
                                            </a>
                                        ) : (
                                            <Link
                                                href={place.href}
                                                className="group flex justify-between items-baseline gap-4 px-5 py-4 cursor-target"
                                            >
                                                <span className="font-medium text-foreground text-sm tracking-tight">
                                                    {place.label}
                                                </span>
                                                <span className="font-mono text-[11px] text-muted-foreground">
                                                    {place.hint}
                                                </span>
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                <div className="z-10 relative">
                    <Stripe />
                    <Footer />
                </div>
            </main>
        </>
    );
}
