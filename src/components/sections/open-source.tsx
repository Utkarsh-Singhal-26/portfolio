import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { format, parseISO } from "date-fns";
import { Suspense } from "react";

import { Reveal } from "@/components/ui/reveal";
import type {
    OpenSourcePr,
    OpenSourceRepo,
    OpenSourceSnapshot,
} from "@/lib/github-opensource";
import { getOpenSource } from "@/lib/github-opensource";

function cleanCopy(text: string): string {
    return text
        .replace(/[\u2013\u2014]/g, " - ")
        .replace(/^(?:[\p{Extended_Pictographic}\uFE0F\u200D]\s*)+/u, "")
        .replace(/\s+/g, " ")
        .trim();
}

function formatStars(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
    return String(n);
}

function formatDay(iso: string | null): string | null {
    if (!iso) return null;
    try {
        return format(parseISO(iso), "dd MMM yyyy");
    } catch {
        return null;
    }
}

function splitRepo(fullName: string): { owner: string; name: string } {
    const [owner, name] = fullName.split("/");
    return { owner: owner ?? fullName, name: name ?? fullName };
}

function HatchRail() {
    return (
        <span
            aria-hidden="true"
            className="bg-[repeating-linear-gradient(315deg,hsl(var(--brand)/0.55)_0,hsl(var(--brand)/0.55)_1px,transparent_0,transparent_50%)] w-2.5 bg-size-[6px_6px] shrink-0"
        />
    );
}

function StatPill({ label, value }: { label: string; value: string }) {
    return (
        <span className="inline-flex items-baseline gap-2 bg-foreground/5 px-3 py-1.5 border border-line">
            <span className="font-medium tabular-nums tracking-tight">
                {value}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
                {label}
            </span>
        </span>
    );
}

function LatestPr({ pr }: { pr: OpenSourcePr }) {
    const day = formatDay(pr.mergedAt);

    return (
        <a
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start justify-between gap-3 px-3 py-2.5 hover:bg-foreground/3 border border-line cursor-target"
        >
            <span className="min-w-0">
                <span className="block text-sm tracking-tight line-clamp-2">
                    {cleanCopy(pr.title)}
                </span>
                <span className="block mt-1 font-mono text-[11px] text-muted-foreground">
                    #{pr.number}
                    {day ? (
                        <>
                            {" "}
                            <span className="text-foreground/25">/</span> {day}
                        </>
                    ) : null}
                </span>
            </span>
            <ArrowUpRightIcon
                size={14}
                weight="light"
                className="mt-0.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300 ease-premium"
            />
        </a>
    );
}

function FeaturedRepo({ repo }: { repo: OpenSourceRepo }) {
    const { owner, name } = splitRepo(repo.fullName);
    const day = formatDay(repo.lastMergedAt);
    const recent = repo.recentPrs.slice(0, 3);

    return (
        <article className="flex items-stretch border-line border-t">
            <HatchRail />
            <div className="flex flex-col flex-1 min-w-0 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col justify-between p-5 md:p-7 lg:border-line lg:border-r cursor-target"
                >
                    <div className="min-w-0">
                        <p className="font-mono text-[12px] text-muted-foreground">
                            {owner}
                        </p>
                        <h3 className="mt-1 inline-flex items-center gap-2 font-semibold text-3xl md:text-4xl tracking-tight group-hover:text-brand">
                            {name}
                            <ArrowUpRightIcon
                                size={18}
                                weight="light"
                                className="opacity-60"
                            />
                        </h3>
                        {repo.description ? (
                            <p className="mt-3 max-w-[48ch] text-muted-foreground text-sm md:text-base leading-relaxed">
                                {cleanCopy(repo.description)}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] text-muted-foreground">
                            {repo.language ? (
                                <span>{repo.language}</span>
                            ) : null}
                            {repo.stars > 0 ? (
                                <span>{formatStars(repo.stars)} stars</span>
                            ) : null}
                            {day ? (
                                <time dateTime={repo.lastMergedAt ?? undefined}>
                                    last merged {day}
                                </time>
                            ) : null}
                        </p>
                        <p className="text-right">
                            <span className="block font-medium text-4xl md:text-5xl text-brand tabular-nums tracking-tight">
                                {repo.prCount}
                            </span>
                            <span className="block font-mono text-[11px] text-muted-foreground">
                                merged PRs
                            </span>
                        </p>
                    </div>
                </a>

                {recent.length > 0 ? (
                    <div className="flex flex-col gap-2 p-5 md:p-7 bg-foreground/2">
                        <p className="font-mono text-[11px] text-muted-foreground">
                            recent merges
                        </p>
                        {recent.map((pr) => (
                            <LatestPr key={pr.url} pr={pr} />
                        ))}
                    </div>
                ) : null}
            </div>
        </article>
    );
}

function RepoCard({ repo, index }: { repo: OpenSourceRepo; index: number }) {
    const { owner, name } = splitRepo(repo.fullName);
    const latest = repo.recentPrs[0];
    const day = formatDay(repo.lastMergedAt);

    return (
        <Reveal delay={index * 0.05}>
            <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col h-full p-5 md:p-6 border-line sm:odd:border-r border-b hover:bg-foreground/3 transition-colors duration-300 cursor-target"
            >
                <div className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                        <span className="block font-mono text-[11px] text-muted-foreground">
                            {owner}
                        </span>
                        <span className="block mt-1 font-medium text-lg md:text-xl tracking-tight group-hover:text-brand">
                            {name}
                        </span>
                    </span>
                    <span className="text-right shrink-0">
                        <span className="block font-medium text-2xl text-brand tabular-nums tracking-tight">
                            {repo.prCount}
                        </span>
                        <span className="block font-mono text-[10px] text-muted-foreground">
                            PRs
                        </span>
                    </span>
                </div>

                {latest ? (
                    <p className="mt-4 text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {cleanCopy(latest.title)}
                    </p>
                ) : repo.description ? (
                    <p className="mt-4 text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {cleanCopy(repo.description)}
                    </p>
                ) : null}

                <span className="flex items-center justify-between gap-3 mt-auto pt-4 font-mono text-[11px] text-muted-foreground">
                    <span className="truncate">
                        {repo.language ?? "—"}
                        {day ? (
                            <>
                                {" "}
                                <span className="text-foreground/25">
                                    /
                                </span>{" "}
                                {day}
                            </>
                        ) : null}
                    </span>
                    <ArrowUpRightIcon
                        size={14}
                        weight="light"
                        className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300 ease-premium"
                    />
                </span>
            </a>
        </Reveal>
    );
}

function OpenSourceList({ data }: { data: OpenSourceSnapshot }) {
    if (data.repos.length === 0) {
        return (
            <p className="px-5 sm:px-6 mt-6 text-muted-foreground text-sm">
                Open source activity could not be loaded right now.
            </p>
        );
    }

    const [featured, ...rest] = data.repos;
    const listedPrs = data.repos.reduce((sum, repo) => sum + repo.prCount, 0);
    const showTotal = data.searchTotal > listedPrs;

    return (
        <>
            <div className="px-5 sm:px-6">
                <Reveal>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        <StatPill
                            value={String(listedPrs)}
                            label="PRs in these repos"
                        />
                        <StatPill
                            value={String(data.repos.length)}
                            label="repos shown"
                        />
                        {showTotal ? (
                            <StatPill
                                value={String(data.searchTotal)}
                                label="total merged PRs"
                            />
                        ) : null}
                    </div>
                    <p className="mt-4 max-w-[60ch] text-muted-foreground text-sm leading-relaxed">
                        Merged pull requests in repos I do not own, all time.{" "}
                        {featured
                            ? `${splitRepo(featured.fullName).name} is the heaviest lane here.`
                            : null}
                    </p>
                </Reveal>
            </div>

            <div className="mt-8">
                {featured ? (
                    <Reveal>
                        <FeaturedRepo repo={featured} />
                    </Reveal>
                ) : null}

                {rest.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 border-line border-t">
                        {rest.map((repo, index) => (
                            <RepoCard
                                key={repo.fullName}
                                repo={repo}
                                index={index}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </>
    );
}

async function OpenSourceData() {
    const data = await getOpenSource();
    return <OpenSourceList data={data} />;
}

function OpenSourceFallback() {
    return (
        <div aria-hidden="true">
            <div className="px-5 sm:px-6">
                <div className="flex gap-2 mt-3">
                    <div className="bg-foreground/5 border border-line w-28 h-9 animate-pulse" />
                    <div className="bg-foreground/5 border border-line w-24 h-9 animate-pulse" />
                </div>
            </div>
            <div className="flex mt-8 border-line border-t h-56">
                <div className="bg-brand/25 w-2.5 shrink-0" />
                <div className="flex-1 bg-foreground/5 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 border-line border-t">
                {Array.from({ length: 4 }, (_, i) => (
                    <div
                        key={i}
                        className="bg-foreground/5 border-line sm:odd:border-r border-b h-40 animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}

export function OpenSource() {
    return (
        <section id="open-source" className="w-full scroll-mt-24">
            <div className="pb-0 cell">
                <Reveal>
                    <h2 className="font-semibold text-2xl md:text-3xl tracking-tight">
                        open source.
                    </h2>
                </Reveal>
            </div>
            <Suspense fallback={<OpenSourceFallback />}>
                <OpenSourceData />
            </Suspense>
        </section>
    );
}
