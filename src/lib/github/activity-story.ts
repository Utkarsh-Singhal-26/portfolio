import { format, parseISO } from "date-fns";

import {
    activeDays,
    busiestDay,
    type Day,
    monthRows,
    streaks,
    total,
    weekdayTotals,
} from "@/lib/github/commit-stats";

const FULL_DAY: Record<string, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
};

const monthName = (key: string) => {
    const [y, m] = key.split("-").map(Number);
    return format(new Date(y, m - 1, 1), "MMMM");
};

const long = (date: string) => format(parseISO(date), "d MMM yyyy");

export function buildStory(days: Day[]) {
    const count = total(days);
    const active = activeDays(days);
    const peak = busiestDay(days);

    const rows = monthRows(days);
    const full = rows.filter((r) => !r.partial);
    const best = rows.reduce((a, b) => (b.count > a.count ? b : a));
    const firstFull = full[0];
    const ratio =
        firstFull && firstFull.key !== best.key && firstFull.count > 0
            ? best.count / firstFull.count
            : null;
    const ups = full.filter(
        (r, i) => i > 0 && r.count > full[i - 1].count
    ).length;

    const { longest, current } = streaks(days);

    const byDay = weekdayTotals(days);
    const dayTotal = byDay.reduce((s, d) => s + d.count, 0);
    const topDay = byDay.reduce((a, b) => (b.count > a.count ? b : a));
    const weekend = byDay
        .filter((d) => d.label === "Sat" || d.label === "Sun")
        .reduce((s, d) => s + d.count, 0);

    return {
        year: {
            count,
            active,
            of: days.length,
            percent: Math.round((active / days.length) * 100),
            perDay: Math.round(count / days.length),
            peakCount: peak.count,
            peakDate: long(peak.date),
        },
        month: {
            name: monthName(best.key),
            count: best.count,
            partial: best.partial,
            ratio: ratio && ratio >= 2 ? Math.round(ratio) : null,
            fromName: firstFull ? monthName(firstFull.key) : "",
        },
        streak: {
            length: longest.length,
            start: longest.length ? long(longest.start) : "",
            end: longest.length ? long(longest.end) : "",
            ongoing: current >= longest.length && longest.length > 0,
        },
        week: {
            name: FULL_DAY[topDay.label] ?? topDay.label,
            share: Math.round((topDay.count / dayTotal) * 100),
            weekendShare: Math.round((weekend / dayTotal) * 100),
            perDay: Math.round(topDay.average),
        },
        months: {
            ups,
            of: Math.max(full.length - 1, 0),
        },
    };
}
