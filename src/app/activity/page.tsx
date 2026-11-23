import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import {
    Accumulation,
    Ledger,
    Streak,
    Terrain,
    Weekdays,
} from "@/components/features/commit-views";
import { CountUp } from "@/components/features/count-up";
import { WakaPanel } from "@/components/features/wakatime-panel";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Stripe } from "@/components/ui/blueprint";
import { Reveal } from "@/components/ui/reveal";
import { DATA, SITE_URL } from "@/content/data";
import { buildStory } from "@/lib/github/activity-story";
import { toDays } from "@/lib/github/commit-stats";
import { getGitHubContributions } from "@/lib/github/contributions";
import { cn } from "@/lib/utils";
import { getWakaStats } from "@/lib/wakatime";

export const metadata: Metadata = {
    title: "Activity",
    description: `${DATA.header.name}'s GitHub contributions for the last year and all-time coding time, told as a short story.`,
    alternates: {
        canonical: `${SITE_URL}/activity`,
        types: { "text/markdown": "/activity.md" },
    },
};

export const revalidate = 86400;

const LABEL =
    "font-mono text-[11px] text-muted-foreground uppercase tracking-[0.22em]";

const B = ({ children }: { children: ReactNode }) => (
    <span className="text-foreground">{children}</span>
);

function Chapter({
    n,
    label,
    big,
    caption,
    flip,
    chart,
    children,
}: {
    n: string;
    label: string;
    big: ReactNode;
    caption: string;
    flip?: boolean;
    chart: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="rule-t cell">
            <span className="cross cross-tl" />
            <span className="cross cross-tr" />
            <div
                className={cn(
                    "items-center gap-x-14 gap-y-8 grid",
                    flip
                        ? "md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
                        : "md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
                )}
            >
                <Reveal className={cn(flip && "md:order-2")}>
                    <p className={LABEL}>
                        {n} · {label}
                    </p>
                    <p className="mt-5 font-semibold text-6xl md:text-8xl tracking-tight tabular-nums leading-none">
                        {big}
                    </p>
                    <p className="mt-3 font-mono text-[12px] text-muted-foreground uppercase tracking-[0.18em]">
                        {caption}
                    </p>
                    <p className="mt-6 max-w-[38ch] text-muted-foreground text-lg leading-relaxed">
                        {children}
                    </p>
                </Reveal>
                <Reveal
                    delay={0.1}
                    className={cn(flip && "md:order-1", "min-w-0")}
                >
                    {chart}
                </Reveal>
            </div>
        </section>
    );
}

export default async function ActivityPage() {
    const [contributions, waka] = await Promise.all([
        getGitHubContributions(),
        getWakaStats(),
    ]);
    const days = toDays(contributions);
    const hasData = days.length > 0;
    const story = hasData ? buildStory(days) : null;

    return (
        <>
            <Navbar />
            <main id="content" className="relative">
                <header className="cell">
                    <p className={LABEL}>FIG. 10 · Activity</p>
                    <h1 className="mt-4 max-w-[14ch] font-semibold text-5xl md:text-7xl md:leading-[1.02] tracking-tight">
                        A year of building.
                    </h1>
                    <p className="mt-5 max-w-[52ch] text-muted-foreground text-lg leading-relaxed">
                        My GitHub contributions for the last year and my
                        all-time coding time, as a short story. Everything is
                        live data, refreshed daily. Point at any chart to read a
                        day.
                    </p>
                    <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.18em]">
                        <Link
                            href="/"
                            className="underline underline-offset-4 hover:text-brand"
                        >
                            ← Back to portfolio
                        </Link>
                    </p>
                </header>

                {!story ? (
                    <section className="rule-t cell">
                        <p className="text-muted-foreground">
                            GitHub didn&apos;t answer just now. Try again in a
                            bit.
                        </p>
                    </section>
                ) : (
                    <>
                        <Chapter
                            n="01"
                            label="The year"
                            big={<CountUp value={story.year.count} />}
                            caption={`contributions in ${story.year.of} days`}
                            chart={<Accumulation days={days} />}
                        >
                            <B>{story.year.active}</B> of {story.year.of} days
                            had at least one, <B>{story.year.percent}%</B> of
                            the year. Roughly <B>{story.year.perDay}</B> a day,
                            with <B>{story.year.peakCount}</B> on the best one,{" "}
                            {story.year.peakDate}.
                        </Chapter>

                        <Chapter
                            n="02"
                            label="Busiest month"
                            big={<CountUp value={story.month.count} />}
                            caption={`in ${story.month.name}${story.month.partial ? ", so far" : ""}`}
                            flip
                            chart={<Terrain days={days} />}
                        >
                            {story.month.name}
                            {story.month.partial ? " so far is" : " was"} the
                            busiest month
                            {story.month.ratio ? (
                                <>
                                    , about <B>{story.month.ratio}×</B>{" "}
                                    {story.month.fromName}
                                </>
                            ) : null}
                            . Each ridge is a month, each peak a day.
                        </Chapter>

                        <Chapter
                            n="03"
                            label="Consistency"
                            big={<CountUp value={story.streak.length} />}
                            caption="days in a row"
                            chart={<Streak days={days} />}
                        >
                            From <B>{story.streak.start}</B> to{" "}
                            <B>{story.streak.end}</B>
                            {story.streak.ongoing ? ", and still going" : ""}.
                            Every bar is a day, and the highlighted run is that
                            streak.
                        </Chapter>

                        <Chapter
                            n="04"
                            label="Rhythm"
                            big={story.week.name}
                            caption={`${story.week.share}% of everything`}
                            flip
                            chart={<Weekdays days={days} />}
                        >
                            Weekends are <B>{story.week.weekendShare}%</B> of
                            the total, so Saturday and Sunday aren&apos;t days
                            off. {story.week.name}s average about{" "}
                            <B>{story.week.perDay}</B> contributions.
                        </Chapter>

                        <Chapter
                            n="05"
                            label="Month by month"
                            big={`${story.months.ups} of ${story.months.of}`}
                            caption="months beat the one before"
                            chart={<Ledger days={days} />}
                        >
                            A daily sparkline for every month, with the change
                            against the previous one. Partial months aren&apos;t
                            compared.
                        </Chapter>

                        {waka ? (
                            <Chapter
                                n="06"
                                label="In the editor"
                                big={waka.total.replace(/\s*\d+\s*mins?$/, "")}
                                caption="all-time coding time"
                                flip
                                chart={<WakaPanel stats={waka} />}
                            >
                                About <B>{waka.dailyAverage}</B> a day since{" "}
                                {waka.since
                                    ? new Date(waka.since).toLocaleDateString(
                                          "en",
                                          { month: "short", year: "numeric" }
                                      )
                                    : "the start"}
                                . <B>{waka.languages[0]?.name}</B> is{" "}
                                {waka.languages[0]?.percent.toFixed(0)}% of it.
                            </Chapter>
                        ) : null}
                    </>
                )}

                <Stripe />
                <Footer />
            </main>
        </>
    );
}
