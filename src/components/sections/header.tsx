"use client";

import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import { Suspense } from "react";

import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { MovingElement } from "@/components/navbar";
import { CtaLink } from "@/components/ui/cta-link";
import {
    GitHubContributionFallback,
    GitHubContributionGraph,
} from "@/components/ui/github-contribution";
import { Reveal } from "@/components/ui/reveal";

export function Header({
    data,
    contributions,
}: {
    data: Record<string, string>;
    contributions: Promise<Activity[]>;
}) {
    return (
        <header className="w-full">
            <div className="cell">
                <Reveal>
                    <p className="font-mono text-[13px] text-muted-foreground tabular-nums">
                        {data.AGE}, {data.PRONOUN}
                    </p>
                    <h1 className="mt-2 max-w-[12ch] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl md:leading-[1.05]">
                        {data.NAME}
                    </h1>
                    <p className="mt-3 max-w-[36ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                        I build backend services and web apps in TypeScript.
                    </p>
                    <div className="mt-5 flex items-center gap-4">
                        <CtaLink href={data.RESUME} external>
                            Resume
                        </CtaLink>
                        <div className="flex items-center gap-1">
                            <MovingElement
                                href={data.GITHUB}
                                ariaLabel="GitHub"
                            >
                                <GithubLogo
                                    size={20}
                                    weight="light"
                                    aria-hidden="true"
                                />
                            </MovingElement>
                            <MovingElement
                                href={data.LINKEDIN}
                                ariaLabel="LinkedIn"
                            >
                                <LinkedinLogo
                                    size={20}
                                    weight="light"
                                    aria-hidden="true"
                                />
                            </MovingElement>
                        </div>
                    </div>
                </Reveal>
            </div>

            <div className="rule-t cell">
                <span className="cross cross-tl" />
                <span className="cross cross-tr" />
                <Suspense fallback={<GitHubContributionFallback />}>
                    <GitHubContributionGraph contributions={contributions} />
                </Suspense>
            </div>

            <div className="rule-t cell">
                <span className="cross cross-tl" />
                <span className="cross cross-tr" />
                <Reveal delay={0.08}>
                    <p className="max-w-[65ch] text-base text-justify leading-relaxed text-muted-foreground">
                        {data.INTRO}{" "}
                        <span className="hidden sm:inline">
                            {data.EXPERTISE}
                        </span>
                    </p>
                </Reveal>
            </div>
        </header>
    );
}
