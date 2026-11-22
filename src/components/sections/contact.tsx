import { format } from "date-fns";
import { Architects_Daughter } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import { ContactBrief } from "@/components/features/contact-brief";
import { PrivacyLink } from "@/components/features/privacy-link";
import { VisitorCount } from "@/components/features/visitor-count";
import { CornerMarks } from "@/components/ui/blueprint";
import { Reveal } from "@/components/ui/reveal";
import { CONTACT_GUIDE } from "@/content/contact";
import { SITE_URL } from "@/content/data";
import { CONSENT_ENABLED } from "@/lib/consent-enabled";
import { cn } from "@/lib/utils";

import pkg from "../../../package.json";

// Below the fold and used once, so it never competes with first paint.
const signature = Architects_Daughter({
    weight: "400",
    subsets: ["latin"],
    preload: false,
});

const LABEL =
    "font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]";

const COMMIT = process.env.BUILD_COMMIT ?? "";
const BUILD_DATE = format(new Date(process.env.BUILD_DATE ?? 0), "dd MMM yyyy");
const STACK = ["next", "react", "tailwindcss"].map((name) => {
    const { dependencies, devDependencies } = pkg as {
        dependencies: Record<string, string>;
        devDependencies: Record<string, string>;
    };
    const version = dependencies[name] ?? devDependencies[name];
    return `${name}@${version.replace(/^\^/, "")}`;
});

function Cell({
    label,
    children,
    className,
}: {
    label: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <dl
            className={cn("px-4 py-3 border-line not-last:border-r", className)}
        >
            <dt className={LABEL}>{label}</dt>
            <dd className="mt-1 font-mono tabular-nums text-[13px] text-foreground whitespace-nowrap">
                {children}
            </dd>
        </dl>
    );
}

const LINK = "underline underline-offset-4";

function TitleBlock({ name, github }: { name: string; github: string }) {
    return (
        <div className="relative border border-line w-full cursor-target">
            <CornerMarks />
            <div className="flex border-line border-b">
                <span
                    aria-hidden="true"
                    className="bg-[repeating-linear-gradient(315deg,hsl(var(--brand)/0.55)_0,hsl(var(--brand)/0.55)_1px,transparent_0,transparent_50%)] border-line border-r w-2.5 bg-size-[6px_6px] shrink-0"
                />
                <div className="flex flex-wrap flex-1 justify-between items-center">
                    <dl className="px-4 py-3 whitespace-nowrap">
                        <dt className={LABEL}>Drawn by</dt>
                        <dd
                            className={`${signature.className} mt-1 text-foreground text-3xl leading-tight`}
                        >
                            {name}
                        </dd>
                    </dl>
                    <VisitorCount />
                </div>
            </div>
            <div className="grid grid-cols-[1fr_1fr_auto] max-[360px]:grid-cols-2 border-line border-b">
                <Cell label="Build">
                    {COMMIT ? (
                        <a
                            className={LINK}
                            href={`${github}/portfolio/commit/${COMMIT}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {COMMIT.slice(0, 7)}
                        </a>
                    ) : (
                        "local"
                    )}
                </Cell>
                <Cell label="Date" className="max-[360px]:border-r-0">
                    {BUILD_DATE}
                </Cell>
                <Cell
                    label="License"
                    className="max-[360px]:col-span-2 max-[360px]:border-line max-[360px]:border-t"
                >
                    <a
                        className={LINK}
                        href={`${github}/portfolio/blob/main/LICENSE`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        MIT
                    </a>
                </Cell>
            </div>
            <div className="max-sm:hidden grid grid-cols-2 sm:grid-cols-[1fr_0.5fr_0.5fr]">
                <Cell
                    label="Stack"
                    className="max-sm:col-span-2 max-sm:border-line max-sm:border-r-0 max-sm:border-b"
                >
                    {STACK.map((item) => (
                        <span key={item} className="block">
                            {item}
                        </span>
                    ))}
                </Cell>
                <Cell label="Typeface">
                    <span className="block">Outfit</span>
                    <span className="block">Geist Mono</span>
                </Cell>
                <Cell label="Privacy">
                    <Link
                        href="/privacy"
                        className="block underline underline-offset-4"
                    >
                        Policy
                    </Link>
                    {CONSENT_ENABLED && <PrivacyLink />}
                </Cell>
            </div>
        </div>
    );
}

function Guide() {
    return (
        <div className="relative flex flex-col border border-line">
            <CornerMarks />
            {CONTACT_GUIDE.map(({ label, items }, index) => (
                <dl
                    key={label}
                    className={cn(
                        "flex-1 sm:items-center gap-x-4 grid sm:grid-cols-[8.5rem_minmax(0,1fr)] not-last:border-line not-last:border-b",
                        // Phones skip the AI-agents line, so the one above it ends the card.
                        index === CONTACT_GUIDE.length - 1 && "max-sm:hidden",
                        index === CONTACT_GUIDE.length - 2 &&
                            "max-sm:border-b-0"
                    )}
                >
                    <dt
                        className={cn(
                            LABEL,
                            "px-4 pt-3 sm:py-3 sm:border-r sm:h-full sm:flex sm:items-center border-line"
                        )}
                    >
                        {label}
                    </dt>
                    <dd className="px-4 sm:px-0 sm:py-3 pt-1 sm:pr-4 pb-3 font-mono text-[12px] text-foreground leading-snug">
                        {items.join(" · ")}
                    </dd>
                </dl>
            ))}
        </div>
    );
}

export function Contact({ data }: { data: Record<string, string> }) {
    return (
        <section id="contact" className="w-full scroll-mt-24 cell">
            <Reveal>
                <h2 className="font-semibold text-3xl md:text-5xl md:leading-[1.1] tracking-tight">
                    Get in touch
                </h2>
                <div className="space-y-6 mt-6">
                    <ContactBrief
                        email={data.email}
                        name={data.name}
                        siteUrl={SITE_URL}
                    />
                    <div className="items-stretch gap-6 grid md:grid-cols-2">
                        <Guide />
                        <TitleBlock name={data.name} github={data.github} />
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
