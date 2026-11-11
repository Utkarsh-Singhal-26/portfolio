import { format } from "date-fns";
import { Architects_Daughter } from "next/font/google";
import type { ReactNode } from "react";

import { CornerMarks } from "@/components/ui/blueprint";
import { CtaLink } from "@/components/ui/cta-link";
import { Reveal } from "@/components/ui/reveal";
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
        <div
            className={cn("px-4 py-3 border-line not-last:border-r", className)}
        >
            <dt className={LABEL}>{label}</dt>
            <dd className="mt-1 font-mono tabular-nums text-[13px] text-foreground whitespace-nowrap">
                {children}
            </dd>
        </div>
    );
}

const LINK = "underline underline-offset-4";

function TitleBlock({ name, github }: { name: string; github: string }) {
    return (
        <dl className="relative border border-line w-full md:w-104 shrink-0 cursor-target">
            <CornerMarks />
            <div className="flex border-line border-b">
                <span
                    aria-hidden="true"
                    className="bg-[repeating-linear-gradient(315deg,hsl(var(--brand)/0.55)_0,hsl(var(--brand)/0.55)_1px,transparent_0,transparent_50%)] border-line border-r w-2.5 bg-size-[6px_6px] shrink-0"
                />
                <div className="px-4 py-3">
                    <dt className={LABEL}>Drawn by</dt>
                    <dd
                        className={`${signature.className} mt-1 text-foreground text-3xl leading-tight`}
                    >
                        {name}
                    </dd>
                </div>
            </div>
            <div className="grid grid-cols-[1fr_1fr_auto] border-line border-b">
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
                <Cell label="Date">{BUILD_DATE}</Cell>
                <Cell label="License">
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
            <div className="grid grid-cols-[1fr_auto]">
                <Cell label="Stack">
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
            </div>
        </dl>
    );
}

export function Contact({ data }: { data: Record<string, string> }) {
    return (
        <section id="contact" className="w-full scroll-mt-24 cell">
            <Reveal>
                <div className="flex md:flex-row flex-col md:justify-between md:items-end gap-10">
                    <div>
                        <h2 className="max-w-[16ch] font-semibold text-3xl md:text-5xl md:leading-[1.1] tracking-tight">
                            Get in touch
                        </h2>
                        <p className="mt-4 max-w-[52ch] text-muted-foreground text-base leading-relaxed">
                            If you want to talk about a role or a project, email
                            is the fastest way.
                        </p>
                        <div className="mt-8">
                            <CtaLink href={`mailto:${data.email}`}>
                                Email me
                            </CtaLink>
                        </div>
                    </div>
                    <TitleBlock name={data.name} github={data.github} />
                </div>
            </Reveal>
        </section>
    );
}
