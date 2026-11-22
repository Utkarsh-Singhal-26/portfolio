import type { Activity } from "@/components/kibo-ui/contribution-graph";

export type Day = Activity & { week: number; weekday: number };

const parts = (date: string) => date.split("-").map(Number);
const weekdayOf = (date: string) => {
    const [y, m, d] = parts(date);
    return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
};

/** Sunday-first weeks, like GitHub's graph. The first day sets week 0. */
export function toDays(activity: Activity[]): Day[] {
    if (activity.length === 0) return [];
    const offset = weekdayOf(activity[0].date);
    return activity.map((day, i) => ({
        ...day,
        week: Math.floor((i + offset) / 7),
        weekday: (i + offset) % 7,
    }));
}

export const total = (days: Day[]) => days.reduce((s, d) => s + d.count, 0);

const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

type MonthRow = {
    key: string;
    label: string;
    count: number;
    active: number;
    partial: boolean;
    days: { day: number; date: string; count: number }[];
};

export function monthRows(days: Day[]): MonthRow[] {
    const rows: (MonthRow & { y: number; m: number })[] = [];
    for (const d of days) {
        const [y, m, dd] = parts(d.date);
        const key = `${y}-${m}`;
        let row = rows[rows.length - 1];
        if (!row || row.key !== key) {
            row = {
                key,
                y,
                m,
                label: `${MONTHS[m - 1]} ${String(y).slice(2)}`,
                count: 0,
                active: 0,
                partial: false,
                days: [],
            };
            rows.push(row);
        }
        row.days.push({ day: dd, date: d.date, count: d.count });
        row.count += d.count;
        if (d.count > 0) row.active += 1;
    }
    return rows.map(({ y, m, ...row }) => ({
        ...row,
        partial: row.days.length < new Date(Date.UTC(y, m, 0)).getUTCDate(),
    }));
}

export function weekdayTotals(days: Day[]) {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const rows = names.map((label) => ({ label, count: 0, seen: 0 }));
    for (const d of days) {
        rows[d.weekday].count += d.count;
        rows[d.weekday].seen += 1;
    }
    return rows.map((r) => ({ ...r, average: r.seen ? r.count / r.seen : 0 }));
}

export function cumulative(days: Day[]) {
    let sum = 0;
    return days.map((d) => (sum += d.count));
}

export function streaks(days: Day[]) {
    let longest = { length: 0, start: "", end: "" };
    let run = { length: 0, start: "" };
    for (const day of days) {
        if (day.count > 0) {
            if (run.length === 0) run.start = day.date;
            run.length += 1;
            if (run.length > longest.length) {
                longest = {
                    length: run.length,
                    start: run.start,
                    end: day.date,
                };
            }
        } else {
            run = { length: 0, start: "" };
        }
    }
    // Current streak: trailing active days. Today may not have a commit yet, so
    // a zero on the very last day doesn't break it.
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].count > 0) current += 1;
        else if (i === days.length - 1) continue;
        else break;
    }
    return { longest, current };
}

export function busiestDay(days: Day[]) {
    return days.reduce((best, d) => (d.count > best.count ? d : best), days[0]);
}

export const activeDays = (days: Day[]) =>
    days.filter((d) => d.count > 0).length;
