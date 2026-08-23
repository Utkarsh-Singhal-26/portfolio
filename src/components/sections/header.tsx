import {
    GithubLogoIcon,
    LinkedinLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";

import { LOCATION } from "@/app/data";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { MovingElement } from "@/components/navbar";
import { CtaLink } from "@/components/ui/cta-link";
import {
    GitHubContributionFallback,
    GitHubContributionGraph,
} from "@/components/ui/github-contribution";
import { HeaderMeta } from "@/components/ui/header-meta";
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
                <Reveal eager>
                    <HeaderMeta
                        age={data.AGE}
                        pronoun={data.PRONOUN}
                        latitude={LOCATION.latitude}
                        longitude={LOCATION.longitude}
                        timezone={LOCATION.timezone}
                    />
                    <h1 className="mt-2 max-w-[12ch] font-semibold text-foreground text-4xl sm:text-5xl md:text-6xl md:leading-[1.05] tracking-tight">
                        {data.NAME}
                    </h1>
                    <p className="mt-3 max-w-[36ch] text-muted-foreground text-base md:text-lg leading-relaxed">
                        {data.HEADLINE}
                    </p>
                    <div className="flex items-center gap-4 mt-5">
                        <CtaLink href={data.RESUME} external>
                            Resume
                        </CtaLink>
                        <div className="flex items-center gap-1">
                            <MovingElement
                                href={data.GITHUB}
                                ariaLabel="GitHub"
                            >
                                <GithubLogoIcon
                                    size={20}
                                    weight="light"
                                    aria-hidden="true"
                                />
                            </MovingElement>
                            <MovingElement
                                href={data.LINKEDIN}
                                ariaLabel="LinkedIn"
                            >
                                <LinkedinLogoIcon
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
                <div style={{ minHeight: "220px" }}>
                    <Suspense fallback={<GitHubContributionFallback />}>
                        <GitHubContributionGraph
                            contributions={contributions}
                        />
                    </Suspense>
                </div>
            </div>

            <div className="rule-t cell">
                <span className="cross cross-tl" />
                <span className="cross cross-tr" />
                <p className="max-w-[62ch] text-muted-foreground text-base leading-relaxed">
                    {data.INTRO}{" "}
                    <span className="text-foreground">{data.FOCUS}</span>{" "}
                    {data.EXPERTISE}
                </p>
            </div>
        </header>
    );
}
