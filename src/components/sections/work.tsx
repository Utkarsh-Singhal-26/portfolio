import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

import type { Project } from "@/app/data";
import { Reveal } from "@/components/ui/reveal";
import { cn, extractDomain } from "@/lib/utils";

function StackList({ stack }: { stack: string[] }) {
    return (
        <ul className="mt-4 flex flex-wrap gap-1.5">
            {stack.map((tech) => (
                <li
                    key={tech}
                    className="rounded-md bg-foreground/5 px-2 py-1 font-mono text-[11px] text-foreground/70"
                >
                    {tech}
                </li>
            ))}
        </ul>
    );
}

function ProjectMeta({ project }: { project: Project }) {
    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target inline-flex items-center gap-1.5 text-sm text-foreground"
            >
                {extractDomain(project.href)}
                <ArrowUpRight size={14} weight="light" />
            </a>
            {project.github ? (
                <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-target inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                    <GithubLogo size={14} weight="light" />
                    Source
                </a>
            ) : null}
        </div>
    );
}

function RoleMark() {
    return (
        <span className="pointer-events-none absolute top-0 right-0 z-1">
            <span className="relative flex items-stretch border-b border-l border-line bg-background">
                <span className="cross cross-bl" />
                <span
                    aria-hidden="true"
                    className="w-2.5 shrink-0 bg-[repeating-linear-gradient(315deg,hsl(var(--brand)/0.55)_0,hsl(var(--brand)/0.55)_1px,transparent_0,transparent_50%)] bg-size-[6px_6px]"
                />
                <span className="px-2.5 py-2.5 font-mono text-[11px] font-medium tracking-[0.22em] text-brand uppercase">
                    Contributor
                </span>
            </span>
        </span>
    );
}

function ProjectTile({ project, index }: { project: Project; index: number }) {
    const contain = project.contribution || project.contain;

    return (
        <article className="flex h-full flex-col border-b border-line sm:odd:border-r sm:odd:border-line">
            <Reveal className="flex h-full flex-col" delay={index * 0.05}>
                <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-target group relative block overflow-hidden bg-[#0c0c0e]"
                >
                    <Image
                        src={project.image}
                        alt={`${project.name} preview`}
                        className={cn(
                            "aspect-video w-full",
                            contain
                                ? "object-contain"
                                : "object-cover object-top transition-transform duration-500 ease-premium group-hover:scale-[1.02]"
                        )}
                        sizes="(min-width: 1120px) 559px, 100vw"
                    />
                    {project.contribution ? <RoleMark /> : null}
                </a>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                    <h3 className="text-lg font-medium tracking-tight md:text-xl">
                        {project.name}
                    </h3>
                    <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
                        {project.summary}
                    </p>
                    <StackList stack={project.stack} />
                    <div className="mt-auto pt-5">
                        <ProjectMeta project={project} />
                    </div>
                </div>
            </Reveal>
        </article>
    );
}

export function Work({ data }: { data: Project[] }) {
    return (
        <section id="work" className="w-full scroll-mt-24">
            <div className="cell pb-0">
                <Reveal>
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Selected work
                    </h2>
                </Reveal>
            </div>

            <div className="mt-8 grid grid-cols-1 border-t border-line sm:grid-cols-2">
                {data.map((project, index) => (
                    <ProjectTile
                        key={project.name}
                        project={project}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
}
