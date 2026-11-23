// Single source of truth for what the site stores, used by the consent banner
// and the privacy page so the two can never disagree.
export type StorageItem = {
    key: string;
    by: string;
    why: string;
    ttl: string;
};

export const ESSENTIAL_STORAGE: StorageItem[] = [
    {
        key: "consent",
        by: "This site",
        why: "remembers this choice",
        ttl: "until cleared",
    },
    {
        key: "theme, accent",
        by: "This site",
        why: "remembers your look",
        ttl: "until cleared",
    },
    {
        key: "drawn",
        by: "This site",
        why: "skips the intro replay",
        ttl: "session",
    },
];

export const ANALYTICS_STORAGE: StorageItem[] = [
    {
        key: "ph_*",
        by: "PostHog",
        why: "visits, pages, clicks",
        ttl: "1 yr",
    },
    {
        key: "_clck, _clsk, MUID",
        by: "Microsoft",
        why: "clicks, scrolls, replays",
        ttl: "1 d - 13 mo",
    },
];

export const POLICY_UPDATED = "23 Nov 2026";
