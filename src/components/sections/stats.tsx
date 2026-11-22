import { differenceInYears, parse } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";

import { CountUp } from "@/components/features/count-up";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import { Reveal } from "@/components/ui/reveal";
import { DATA } from "@/content/data";
import { getOpenSource } from "@/lib/github/open-source";

const LABEL =
    "font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]";
const VALUE =
    "mt-2 font-semibold text-3xl md:text-4xl tracking-tight tabular-nums";

const earliest = DATA.experience
    .flatMap((company) => company.roles.map((role) => role.start))
    .sort()[0];
const company = DATA.experience[0];
const role = company.roles[0];

// Full years elapsed since the first role, so it never over-claims.
function getYearsBuilding(now = new Date()) {
    return differenceInYears(now, parse(earliest, "yyyy-MM", now));
}

function Grid({
    commits,
    prs,
}: {
    commits: number | null;
    prs: number | null;
}) {
    const years = getYearsBuilding();

    return (
        <dl className="gap-px grid grid-cols-2 md:grid-cols-4 bg-line">
            {prs ? (
                <div className="bg-background px-5 sm:px-6 py-5">
                    <dt className={LABEL}>Merged PRs</dt>
                    <dd className={VALUE}>
                        <CountUp value={prs} />
                    </dd>
                    <p className="mt-1 text-muted-foreground text-[13px]">
                        in repos I don&apos;t own
                    </p>
                </div>
            ) : null}
            {commits ? (
                <div className="bg-background px-5 sm:px-6 py-5">
                    <dt className={LABEL}>Contributions</dt>
                    <dd className={VALUE}>
                        <CountUp value={commits} />
                    </dd>
                    <p className="mt-1 text-muted-foreground text-[13px]">
                        on GitHub, last year ·{" "}
                        <Link
                            href="/activity"
                            className="text-foreground underline underline-offset-4 hover:text-brand"
                        >
                            see it drawn
                        </Link>
                    </p>
                </div>
            ) : null}
            <div className="bg-background px-5 sm:px-6 py-5">
                <dt className={LABEL}>Years building</dt>
                <dd className={VALUE}>
                    <CountUp value={years} />
                </dd>
                <p className="mt-1 text-muted-foreground text-[13px]">
                    since {earliest.slice(0, 4)}, work and internships
                </p>
            </div>
            <div className="bg-background px-5 sm:px-6 py-5">
                <dt className={LABEL}>Currently</dt>
                <dd className="mt-2 font-semibold text-xl md:text-2xl tracking-tight">
                    {role.title.replace(/\s-\s/, "-")}
                </dd>
                <p className="mt-1 text-muted-foreground text-[13px]">
                    at {company.name}
                </p>
            </div>
        </dl>
    );
}

async function StatsData({
    contributions,
}: {
    contributions: Promise<Activity[]>;
}) {
    const [activity, openSource] = await Promise.all([
        contributions,
        getOpenSource(),
    ]);
    const commits = activity.reduce((sum, day) => sum + day.count, 0);
    return <Grid commits={commits} prs={openSource.searchTotal} />;
}

export function Stats({
    contributions,
}: {
    contributions: Promise<Activity[]>;
}) {
    return (
        <section aria-label="At a glance" className="w-full rule-t">
            <Reveal>
                <Suspense fallback={<Grid commits={null} prs={null} />}>
                    <StatsData contributions={contributions} />
                </Suspense>
            </Reveal>
        </section>
    );
}
