import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";

import { Reveal } from "@/components/ui/reveal";
import type { OpenSourceRepo } from "@/lib/github-opensource";
import { getOpenSource } from "@/lib/github-opensource";
import { cn } from "@/lib/utils";

function cleanDesc(text: string): string {
    return text.replace(/[\u2013\u2014]/g, " - ");
}

function formatStars(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
    return String(n);
}

function splitRepo(fullName: string): { owner: string; name: string } {
    const [owner, name] = fullName.split("/");
    return { owner: owner ?? fullName, name: name ?? fullName };
}

function RepoTile({
    repo,
    featured,
    wide,
}: {
    repo: OpenSourceRepo;
    featured?: boolean;
    wide?: boolean;
}) {
    const { owner, name } = splitRepo(repo.fullName);

    return (
        <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "cursor-target group relative flex h-full flex-col border-b border-line p-5 transition-colors duration-300 hover:bg-foreground/[0.03] md:p-6",
                featured && "sm:col-span-2 md:flex-row md:items-start md:justify-between md:gap-10 md:p-8",
                wide &&
                    "sm:col-span-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8",
                !featured && !wide && "sm:even:border-r"
            )}
        >
            <span className="min-w-0 shrink-0">
                <span className="block font-mono text-[12px] text-muted-foreground">
                    {owner}
                </span>
                <span
                    className={cn(
                        "mt-1 block font-medium tracking-tight",
                        featured ? "text-2xl md:text-3xl" : "text-lg"
                    )}
                >
                    {name}
                </span>
                {repo.description ? (
                    <span
                        className={cn(
                            "mt-2 block text-sm leading-relaxed text-muted-foreground",
                            featured ? "max-w-[46ch]" : "max-w-[42ch]"
                        )}
                    >
                        {cleanDesc(repo.description)}
                    </span>
                ) : null}
            </span>

            <span
                className={cn(
                    "mt-auto flex items-end justify-between gap-4 pt-5",
                    featured && "md:mt-0 md:shrink-0 md:flex-col md:items-end md:pt-0",
                    wide && "sm:mt-0 sm:shrink-0 sm:flex-col sm:items-end sm:pt-0"
                )}
            >
                <span className="flex items-baseline gap-2">
                    <span
                        className={cn(
                            "font-medium tabular-nums tracking-tight",
                            featured
                                ? "text-5xl text-brand md:text-6xl"
                                : "text-2xl"
                        )}
                    >
                        {repo.prCount}
                    </span>
                    <span className="font-mono text-[12px] text-muted-foreground">
                        {repo.prCount === 1 ? "PR" : "PRs"}
                    </span>
                </span>
                <span className="flex items-center gap-3 font-mono text-[12px] text-muted-foreground">
                    {repo.language ? <span>{repo.language}</span> : null}
                    {featured && repo.stars > 0 ? (
                        <span>{formatStars(repo.stars)} stars</span>
                    ) : null}
                    <ArrowUpRight
                        size={16}
                        weight="light"
                        className="transition-transform duration-300 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                </span>
            </span>
        </a>
    );
}

function OpenSourceList({ repos }: { repos: OpenSourceRepo[] }) {
    if (repos.length === 0) {
        return (
            <p className="mt-6 text-sm text-muted-foreground">
                Open source activity could not be loaded right now.
            </p>
        );
    }

    const [featured, ...rest] = repos;

    return (
        <div className="mt-8 grid grid-cols-1 border-t border-line sm:grid-cols-2">
            {featured && <RepoTile repo={featured} featured />}
            {rest.map((repo, i) => (
                <RepoTile
                    key={repo.fullName}
                    repo={repo}
                    wide={rest.length % 2 === 1 && i === rest.length - 1}
                />
            ))}
        </div>
    );
}

async function OpenSourceData() {
    const repos = await getOpenSource();
    return <OpenSourceList repos={repos} />;
}

export function OpenSource() {
    return (
        <section id="open-source" className="cell w-full scroll-mt-24">
            <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    Open source
                </h2>
            </Reveal>
            <Suspense
                fallback={
                    <div
                        className="mt-8 h-48 animate-pulse border border-line bg-foreground/5"
                        aria-hidden="true"
                    />
                }
            >
                <OpenSourceData />
            </Suspense>
        </section>
    );
}
