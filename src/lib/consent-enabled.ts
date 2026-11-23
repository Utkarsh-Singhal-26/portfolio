// Server-only gate for the consent banner and its footer link. Trackers load
// only on Vercel with IDs set; the banner is also shown in dev so it can be
// designed and tested.
export const CONSENT_ENABLED =
    process.env.NODE_ENV === "development" ||
    Boolean(
        process.env.VERCEL_ENV &&
        (process.env.NEXT_PUBLIC_CLARITY_ID ||
            process.env.NEXT_PUBLIC_POSTHOG_KEY)
    );
