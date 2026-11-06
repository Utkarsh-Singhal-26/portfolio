import {
    GithubLogoIcon,
    LinkedinLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";

import {
    GitHubContributionFallback,
    GitHubContributionGraph,
} from "@/components/features/contribution-calendar";
import { HeaderMeta } from "@/components/features/header-meta";
import { TechText } from "@/components/features/tech-text";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { CtaLink } from "@/components/ui/cta-link";
import { MovingElement } from "@/components/ui/moving-element";
import { Reveal } from "@/components/ui/reveal";
import { getAge, LOCATION } from "@/content/data";

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
                        age={String(getAge())}
                        pronoun={data.pronoun}
                        latitude={LOCATION.latitude}
                        longitude={LOCATION.longitude}
                        timezone={LOCATION.timezone}
                    />
                    <h1 className="mt-2 h-26 sm:h-31 md:h-35 text-foreground">
                        <TechText
                            text={data.name}
                            fontSize={120}
                            align="left"
                            letterSpacing={-0.04}
                            guides
                            intro="metrics"
                            introDuration={0.9}
                            accentColor="color-mix(in srgb, var(--color-brand) 65%, var(--color-foreground))"
                        />
                    </h1>
                    <p className="mt-3 max-w-[36ch] text-muted-foreground text-base md:text-lg leading-relaxed">
                        {data.headline}
                    </p>
                    <div className="flex items-center gap-4 mt-5">
                        <CtaLink href={data.resume} external>
                            Resume
                        </CtaLink>
                        <div className="flex items-center gap-1">
                            <MovingElement
                                href={data.github}
                                ariaLabel="GitHub"
                            >
                                <GithubLogoIcon
                                    size={20}
                                    weight="light"
                                    aria-hidden="true"
                                />
                            </MovingElement>
                            <MovingElement
                                href={data.linkedin}
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
                    {data.intro}{" "}
                    <span className="text-foreground">{data.focus}</span>{" "}
                    {data.expertise}
                </p>
            </div>
        </header>
    );
}
