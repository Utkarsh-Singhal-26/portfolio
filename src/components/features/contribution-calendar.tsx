"use client";

import { format, parseISO } from "date-fns";
import { use, useEffect, useRef } from "react";

import type { Activity } from "@/components/kibo-ui/contribution-graph";
import {
    ContributionGraph,
    ContributionGraphBlock,
    ContributionGraphCalendar,
    ContributionGraphFooter,
    ContributionGraphLegend,
    ContributionGraphTotalCount,
    useContributionGraph,
} from "@/components/kibo-ui/contribution-graph";
import { WarmTooltipField } from "@/components/ui/warm-tooltip";
import { GITHUB_USERNAME } from "@/content/data";
import { cn } from "@/lib/utils";

const tipLabel = (el: Element) => {
    const count = Number(el.getAttribute("data-count"));
    const date = format(
        new Date(el.getAttribute("data-date") ?? ""),
        "dd.MM.yyyy"
    );
    return `${count} contribution${count === 1 ? "" : "s"} on ${date}`;
};

const peakDate = (activity: Activity) =>
    format(parseISO(activity.date), "dd MMM yyyy");

function PeakTag({ activity }: { activity: Activity }) {
    return (
        <span className="flex items-stretch bg-background border border-line">
            <span className="bg-[repeating-linear-gradient(315deg,hsl(var(--brand)/0.55)_0,hsl(var(--brand)/0.55)_1px,transparent_0,transparent_50%)] w-2.5 bg-size-[6px_6px] shrink-0" />
            <span className="px-2.5 py-1.5 font-mono tabular-nums text-[12px] text-muted-foreground leading-4 whitespace-nowrap">
                <span className="mr-2.5 font-medium text-brand uppercase tracking-[0.22em]">
                    Peak
                </span>
                <span className="font-medium text-foreground">
                    {activity.count} contribution
                    {activity.count === 1 ? "" : "s"}
                </span>
                <span className="mx-2 text-foreground/25">/</span>
                {peakDate(activity)}
            </span>
        </span>
    );
}

// Leader runs in the gap between columns, so later cells never paint over it.
function PeakCallout({
    activity,
    dayIndex,
    weekIndex,
}: {
    activity: Activity;
    dayIndex: number;
    weekIndex: number;
}) {
    const { blockMargin, blockSize, height, labelHeight, weeks, width } =
        useContributionGraph();
    const step = blockSize + blockMargin;
    const x = step * weekIndex;
    const y = labelHeight + step * dayIndex;
    const ring = blockSize + 3;
    const leaderX = x + blockSize + 1.5;
    const leaderStart = y + blockSize + 1.5;
    const groupRef = useRef<SVGGElement>(null);

    // Narrow screens stack the tag in its own row, next to the peak.
    const dir = weekIndex < weeks.length / 2 ? 1 : -1;
    const stackedY = height + 22.5;
    const stackedEnd = leaderX + dir * 20;
    const stackedWidth = 380;

    // Wide screens dock it at the right of the footer row, past the legend.
    const dockWidth = 380;
    const dockTop = height + 13;
    const elbowY = height + 7.5;
    const dockX = Math.min(Math.max(leaderX, width - 280.5), width - 15.5);

    useEffect(() => {
        const scroller = groupRef.current?.closest("section");
        if (!scroller) return;
        scroller.scrollLeft =
            dir === 1 ? leaderX - 40 : leaderX + 40 - scroller.clientWidth;
    }, [dir, leaderX]);

    return (
        <g ref={groupRef} aria-hidden="true" className="pointer-events-none">
            <rect
                className="fill-none stroke-foreground"
                height={ring}
                width={ring}
                x={x - 1.5}
                y={y - 1.5}
            />
            <g className="min-[70rem]:hidden">
                <path
                    className="fill-none stroke-foreground/70"
                    d={`M${leaderX} ${leaderStart}V${stackedY}H${stackedEnd}`}
                />
                <foreignObject
                    height={30}
                    width={stackedWidth}
                    x={
                        dir === 1
                            ? stackedEnd - 0.5
                            : stackedEnd + 0.5 - stackedWidth
                    }
                    y={stackedY - 15.5}
                >
                    <div className={cn("flex", dir === -1 && "justify-end")}>
                        <PeakTag activity={activity} />
                    </div>
                </foreignObject>
            </g>
            <g className="hidden min-[70rem]:inline">
                <path
                    className="fill-none stroke-foreground/70"
                    d={`M${leaderX} ${leaderStart}V${elbowY}H${dockX}V${dockTop}`}
                />
                <foreignObject
                    height={30}
                    width={dockWidth}
                    x={width - dockWidth}
                    y={dockTop}
                >
                    <div className="flex justify-end">
                        <PeakTag activity={activity} />
                    </div>
                </foreignObject>
            </g>
        </g>
    );
}

export function GitHubContributionGraph({
    contributions,
}: {
    contributions: Promise<Activity[]>;
}) {
    const data = use(contributions);
    const busiest: Activity | undefined = data.reduce(
        (best, day) => (day.count >= best.count ? day : best),
        data[0]
    );
    const peak = busiest?.count ? busiest : undefined;

    return (
        <WarmTooltipField selector="rect[data-date]" getLabel={tipLabel}>
            <ContributionGraph
                className="mx-auto py-2 cursor-target"
                data={data}
                blockSize={14}
                blockMargin={5}
                blockRadius={0}
            >
                <ContributionGraphCalendar
                    className="px-2 pb-11 no-scrollbar"
                    title="GitHub Contributions"
                >
                    {({ activity, dayIndex, weekIndex }) => (
                        <>
                            <ContributionGraphBlock
                                activity={activity}
                                dayIndex={dayIndex}
                                weekIndex={weekIndex}
                            />
                            {activity === peak ? (
                                <PeakCallout
                                    activity={activity}
                                    dayIndex={dayIndex}
                                    weekIndex={weekIndex}
                                />
                            ) : null}
                        </>
                    )}
                </ContributionGraphCalendar>

                <ContributionGraphFooter className="min-[70rem]:-mt-8.5 px-2">
                    <ContributionGraphTotalCount>
                        {({ totalCount }) => (
                            <div className="font-mono tabular-nums text-[13px] text-muted-foreground whitespace-normal">
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
                                {peak ? (
                                    <span className="sr-only">
                                        {" "}
                                        Peak: {peak.count} on {peakDate(peak)}.
                                    </span>
                                ) : null}
                            </div>
                        )}
                    </ContributionGraphTotalCount>

                    <ContributionGraphLegend className="min-[70rem]:mr-81" />
                </ContributionGraphFooter>
            </ContributionGraph>
        </WarmTooltipField>
    );
}

export function GitHubContributionFallback() {
    return (
        <div
            className="bg-foreground/5 border border-line w-full h-70 min-[70rem]:h-55 animate-pulse"
            aria-hidden="true"
        />
    );
}
