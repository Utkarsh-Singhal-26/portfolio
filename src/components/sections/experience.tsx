"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { format, parse } from "date-fns";

import type { ExperienceCompany, ExperienceRole } from "@/app/data";
import { Reveal } from "@/components/ui/reveal";

function monthLabel(value: string) {
    return format(parse(value, "yyyy-MM", new Date()), "MMM yyyy");
}

function rangeLabel(start: string, end?: string) {
    return `${monthLabel(start)} - ${end ? monthLabel(end) : "Present"}`;
}

type RoleEntry = {
    company: ExperienceCompany;
    role: ExperienceRole;
};

function flatten(data: ExperienceCompany[]): RoleEntry[] {
    return data.flatMap((company) =>
        company.roles.map((role) => ({ company, role }))
    );
}

function ArrowHit() {
    return (
        <span className="flex justify-center items-center group-hover:bg-foreground/5 border border-line group-hover:border-foreground/35 rounded-full size-9 text-foreground transition-colors duration-300 ease-premium shrink-0">
            <ArrowUpRightIcon size={14} weight="light" />
        </span>
    );
}

export function Experience({ data }: { data: ExperienceCompany[] }) {
    const entries = flatten(data);
    const current =
        entries.find((entry) => entry.role.open) ??
        entries.find((entry) => entry.company.current) ??
        entries[0];
    const earlier = entries.filter((entry) => entry !== current);

    return (
        <section id="experience" className="w-full scroll-mt-24 cell">
            <Reveal>
                <h2 className="font-semibold text-2xl md:text-3xl tracking-tight">
                    experience.
                </h2>
            </Reveal>

            <div className="items-start grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] mt-8 lg:mt-10">
                <div className="lg:top-14 lg:sticky lg:pr-10">
                    <Reveal>
                        <p className="max-w-[12ch] font-semibold text-3xl md:text-5xl md:leading-[1.08] tracking-tight">
                            From intern to backend engineer
                        </p>
                        <p className="mt-4 max-w-[36ch] text-muted-foreground text-base leading-relaxed">
                            Full-time since January 2026. I interned on the same
                            team first.
                        </p>
                    </Reveal>

                    <Reveal delay={0.06}>
                        <a
                            href={current.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block mt-8 p-6 md:p-7 border border-line cursor-target"
                        >
                            <p className="font-mono text-[11px] text-brand">
                                now
                            </p>
                            <p className="mt-4 font-semibold text-2xl md:text-3xl md:leading-tight tracking-tight">
                                {current.role.title}
                            </p>
                            <p className="mt-2 text-muted-foreground text-sm">
                                {current.company.name}
                                <span className="mx-2 text-foreground/25">
                                    /
                                </span>
                                {current.role.type}
                                <span className="mx-2 text-foreground/25">
                                    /
                                </span>
                                <span className="font-mono tabular-nums text-[12px]">
                                    {rangeLabel(
                                        current.role.start,
                                        current.role.end
                                    )}
                                </span>
                            </p>
                            <div className="space-y-2 mt-5 max-w-[46ch] text-muted-foreground text-sm leading-relaxed">
                                {current.role.description.map((line) => (
                                    <p key={line}>{line}</p>
                                ))}
                            </div>
                            <ul className="flex flex-wrap gap-1.5 mt-5">
                                {current.role.stack.slice(0, 6).map((tech) => (
                                    <li
                                        key={tech}
                                        className="bg-foreground/5 px-2 py-1 rounded-md font-mono text-[11px] text-foreground/70"
                                    >
                                        {tech}
                                    </li>
                                ))}
                            </ul>
                            <span className="inline-flex items-center gap-2 mt-6 text-foreground text-sm">
                                {current.company.name}
                                <ArrowUpRightIcon size={14} weight="light" />
                            </span>
                        </a>
                    </Reveal>
                </div>

                <ol className="mt-10 lg:mt-0 lg:pl-10 lg:border-line lg:border-l">
                    {earlier.map((entry, index) => (
                        <li
                            key={`${entry.company.name}-${entry.role.title}`}
                            className="border-line border-t first:border-t-0"
                        >
                            <Reveal delay={index * 0.05}>
                                <a
                                    href={entry.company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group items-start gap-4 sm:gap-5 grid grid-cols-[2rem_minmax(0,1fr)_auto] py-6 cursor-target"
                                >
                                    <span className="pt-1 font-mono tabular-nums text-[12px] text-muted-foreground">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block font-medium text-foreground text-lg md:text-xl tracking-tight">
                                            {entry.role.title}
                                        </span>
                                        <span className="block mt-1 text-muted-foreground text-sm">
                                            {entry.company.name}
                                            <span className="mx-2 text-foreground/25">
                                                /
                                            </span>
                                            {entry.role.type}
                                            <span className="mx-2 text-foreground/25">
                                                /
                                            </span>
                                            <span className="font-mono tabular-nums text-[12px]">
                                                {rangeLabel(
                                                    entry.role.start,
                                                    entry.role.end
                                                )}
                                            </span>
                                        </span>
                                        <span className="block mt-2 max-w-[48ch] text-muted-foreground text-sm leading-relaxed">
                                            {entry.role.description.join(" ")}
                                        </span>
                                    </span>
                                    <ArrowHit />
                                </a>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
