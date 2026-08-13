import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
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
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-foreground transition-colors duration-300 ease-premium group-hover:border-foreground/35 group-hover:bg-foreground/5">
            <ArrowUpRight size={14} weight="light" />
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
        <section id="experience" className="cell w-full scroll-mt-24">
            <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    Experience
                </h2>
            </Reveal>

            <div className="mt-8 grid items-start lg:mt-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                <div className="lg:sticky lg:top-14 lg:pr-10">
                    <Reveal>
                        <p className="max-w-[12ch] text-3xl font-semibold tracking-tight md:text-5xl md:leading-[1.08]">
                            From intern to backend engineer
                        </p>
                        <p className="mt-4 max-w-[36ch] text-base leading-relaxed text-muted-foreground">
                            Full-time since January 2026. I interned on the same
                            team first.
                        </p>
                    </Reveal>

                    <Reveal delay={0.06}>
                        <a
                            href={current.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-target group mt-8 block border border-line p-6 md:p-7"
                        >
                            <p className="font-mono text-[11px] text-brand">
                                now
                            </p>
                            <p className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl md:leading-tight">
                                {current.role.title}
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {current.company.name}
                                <span className="mx-2 text-foreground/25">
                                    /
                                </span>
                                {current.role.type}
                                <span className="mx-2 text-foreground/25">
                                    /
                                </span>
                                <span className="font-mono text-[12px] tabular-nums">
                                    {rangeLabel(
                                        current.role.start,
                                        current.role.end
                                    )}
                                </span>
                            </p>
                            <div className="mt-5 max-w-[46ch] space-y-2 text-sm leading-relaxed text-muted-foreground">
                                {current.role.description.map((line) => (
                                    <p key={line}>{line}</p>
                                ))}
                            </div>
                            <ul className="mt-5 flex flex-wrap gap-1.5">
                                {current.role.stack.slice(0, 6).map((tech) => (
                                    <li
                                        key={tech}
                                        className="rounded-md bg-foreground/5 px-2 py-1 font-mono text-[11px] text-foreground/70"
                                    >
                                        {tech}
                                    </li>
                                ))}
                            </ul>
                            <span className="mt-6 inline-flex items-center gap-2 text-sm text-foreground">
                                {current.company.name}
                                <ArrowUpRight size={14} weight="light" />
                            </span>
                        </a>
                    </Reveal>
                </div>

                <ol className="mt-10 lg:mt-0 lg:border-l lg:border-line lg:pl-10">
                    {earlier.map((entry, index) => (
                        <li
                            key={`${entry.company.name}-${entry.role.title}`}
                            className="border-t border-line first:border-t-0"
                        >
                            <Reveal delay={index * 0.05}>
                                <a
                                    href={entry.company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-target group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-4 py-6 sm:gap-5"
                                >
                                    <span className="pt-1 font-mono text-[12px] text-muted-foreground tabular-nums">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-lg font-medium tracking-tight text-foreground md:text-xl">
                                            {entry.role.title}
                                        </span>
                                        <span className="mt-1 block text-sm text-muted-foreground">
                                            {entry.company.name}
                                            <span className="mx-2 text-foreground/25">
                                                /
                                            </span>
                                            {entry.role.type}
                                            <span className="mx-2 text-foreground/25">
                                                /
                                            </span>
                                            <span className="font-mono text-[12px] tabular-nums">
                                                {rangeLabel(
                                                    entry.role.start,
                                                    entry.role.end
                                                )}
                                            </span>
                                        </span>
                                        <span className="mt-2 block max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
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
