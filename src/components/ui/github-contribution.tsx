"use client";

import { format } from "date-fns";
import { use } from "react";

import { GITHUB_USERNAME } from "@/app/data";
import {
    TooltipContent,
    TooltipProvider,
    TooltipRoot,
    TooltipTrigger,
} from "@/components/base-ui/tooltip";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import {
    ContributionGraph,
    ContributionGraphBlock,
    ContributionGraphCalendar,
    ContributionGraphFooter,
    ContributionGraphLegend,
    ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";

export function GitHubContributionGraph({
    contributions,
}: {
    contributions: Promise<Activity[]>;
}) {
    const data = use(contributions);

    return (
        <TooltipProvider>
            <ContributionGraph
                className="mx-auto cursor-target py-2"
                data={data}
                blockSize={14}
                blockMargin={5}
                blockRadius={0}
            >
                <ContributionGraphCalendar
                    className="no-scrollbar px-2"
                    title="GitHub Contributions"
                >
                    {({ activity, dayIndex, weekIndex }) => (
                        <TooltipRoot>
                            <TooltipTrigger render={<g />}>
                                <ContributionGraphBlock
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            </TooltipTrigger>

                            <TooltipContent className="font-sans">
                                <p>
                                    {activity.count} contribution
                                    {activity.count === 1 ? "" : "s"} on{" "}
                                    {format(
                                        new Date(activity.date),
                                        "dd.MM.yyyy"
                                    )}
                                </p>
                            </TooltipContent>
                        </TooltipRoot>
                    )}
                </ContributionGraphCalendar>

                <ContributionGraphFooter className="px-2">
                    <ContributionGraphTotalCount>
                        {({ totalCount }) => (
                            <div className="font-mono text-[13px] text-muted-foreground tabular-nums">
                                {totalCount.toLocaleString("en")} contributions
                                in the last year on{" "}
                                <a
                                    className="font-medium underline underline-offset-4"
                                    href={`https://github.com/${GITHUB_USERNAME}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub
                                </a>
                                .
                            </div>
                        )}
                    </ContributionGraphTotalCount>

                    <ContributionGraphLegend />
                </ContributionGraphFooter>
            </ContributionGraph>
        </TooltipProvider>
    );
}

export function GitHubContributionFallback() {
    return (
        <div
            className="h-40 w-full animate-pulse border border-line bg-foreground/5"
            aria-hidden="true"
        />
    );
}
