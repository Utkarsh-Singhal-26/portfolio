import {
    ArrowUpRightIcon,
    GithubLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

import type { Project } from "@/app/data";
import { Reveal } from "@/components/ui/reveal";
import { cn, extractDomain } from "@/lib/utils";

function StackList({ stack }: { stack: string[] }) {
    return (
        <ul className="flex flex-wrap gap-1.5 mt-4">
            {stack.map((tech) => (
                <li
                    key={tech}
                    className="bg-foreground/5 px-2 py-1 rounded-md font-mono text-[11px] text-foreground/70"
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
                className="inline-flex items-center gap-1.5 text-foreground text-sm cursor-target"
            >
                {extractDomain(project.href)}
                <ArrowUpRightIcon size={14} weight="light" />
            </a>
            {project.github ? (
                <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm cursor-target"
                >
                    <GithubLogoIcon size={14} weight="light" />
                    Source
                </a>
            ) : null}
        </div>
    );
}

function RoleMark() {
    return (
        <span className="top-0 right-0 z-1 absolute pointer-events-none">
            <span className="relative flex items-stretch bg-background border-line border-b border-l">
                <span className="cross cross-bl" />
                <span
                    aria-hidden="true"
                    className="bg-[repeating-linear-gradient(315deg,hsl(var(--brand)/0.55)_0,hsl(var(--brand)/0.55)_1px,transparent_0,transparent_50%)] w-2.5 bg-size-[6px_6px] shrink-0"
                />
                <span className="px-2.5 py-2.5 font-mono font-medium text-[11px] text-brand uppercase tracking-[0.22em]">
                    Contributor
                </span>
            </span>
        </span>
    );
}

function ProjectTile({ project, index }: { project: Project; index: number }) {
    const contain = project.contribution || project.contain;

    return (
        <article className="flex flex-col border-line sm:odd:border-line sm:odd:border-r border-b h-full">
            <Reveal className="flex flex-col h-full" delay={index * 0.05}>
                <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block relative bg-[#0c0c0e] overflow-hidden cursor-target"
                >
                    <Image
                        src={project.image}
                        alt={`${project.name} preview`}
                        className={cn(
                            "w-full aspect-video",
                            contain
                                ? "object-contain"
                                : "object-cover object-top transition-transform duration-500 ease-premium group-hover:scale-[1.02]"
                        )}
                        sizes="(min-width: 1120px) 559px, (min-width: 640px) 50vw, 100vw"
                        priority={index < 2}
                    />
                    {project.contribution ? <RoleMark /> : null}
                </a>
                <div className="flex flex-col flex-1 p-5 md:p-6">
                    <h3 className="font-medium text-lg md:text-xl tracking-tight">
                        {project.name}
                    </h3>
                    <p className="mt-2 max-w-[42ch] text-muted-foreground text-sm leading-relaxed">
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
            <div className="pb-0 cell">
                <Reveal>
                    <h2 className="font-semibold text-2xl md:text-3xl tracking-tight">
                        selected work.
                    </h2>
                </Reveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 mt-8 border-line border-t">
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
