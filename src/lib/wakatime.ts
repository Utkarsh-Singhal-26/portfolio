import { unstable_cache } from "next/cache";

export type WakaItem = {
    name: string;
    percent: number;
    seconds: number;
    text: string;
};

export type WakaStats = {
    total: string;
    dailyAverage: string;
    since: string;
    bestDay: { date: string; text: string } | null;
    languages: WakaItem[];
    editors: WakaItem[];
};

type RawItem = {
    name?: string;
    percent?: number;
    total_seconds?: number;
    text?: string;
};

type RawStats = {
    data?: {
        human_readable_total?: string;
        human_readable_daily_average?: string;
        start?: string;
        best_day?: { date?: string; text?: string } | null;
        languages?: RawItem[];
        editors?: RawItem[];
    };
};

const items = (raw: RawItem[] | undefined, limit: number): WakaItem[] =>
    (raw ?? [])
        .filter((i) => i.name && i.name !== "Other")
        .slice(0, limit)
        .map((i) => ({
            name: i.name as string,
            percent: i.percent ?? 0,
            seconds: i.total_seconds ?? 0,
            text: i.text ?? "",
        }));

// Throws on failure so unstable_cache never stores an empty result for a day.
const loadStats = unstable_cache(
    async (): Promise<WakaStats> => {
        // Same secret and endpoint as the profile README workflow.
        const token = process.env.WAKATIME_OAUTH_TOKEN;
        if (!token) throw new Error("WAKATIME_OAUTH_TOKEN not set");
        const res = await fetch(
            "https://wakatime.com/api/v1/users/current/stats/all_time",
            {
                headers: { Authorization: `Bearer ${token}` },
                signal: AbortSignal.timeout(10000),
            }
        );
        if (!res.ok) throw new Error(`wakatime ${res.status}`);
        const { data } = (await res.json()) as RawStats;
        if (!data?.languages?.length) throw new Error("no wakatime data");
        return {
            total: data.human_readable_total ?? "",
            dailyAverage: data.human_readable_daily_average ?? "",
            since: data.start ?? "",
            bestDay:
                data.best_day?.date && data.best_day.text
                    ? { date: data.best_day.date, text: data.best_day.text }
                    : null,
            languages: items(data.languages, 5),
            editors: items(data.editors, 5),
        };
    },
    ["wakatime-all-time-v2"],
    { revalidate: 86400 }
);

export async function getWakaStats(): Promise<WakaStats | null> {
    if (!process.env.WAKATIME_OAUTH_TOKEN) return null;
    try {
        return await loadStats();
    } catch {
        return null;
    }
}
