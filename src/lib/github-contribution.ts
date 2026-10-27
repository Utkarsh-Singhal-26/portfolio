import { unstable_cache } from "next/cache";

import { GITHUB_USERNAME } from "@/app/data";
import type { Activity } from "@/components/kibo-ui/contribution-graph";

type GitHubContributionsResponse = {
    contributions?: Activity[];
};

// Throws on failure so unstable_cache never stores an empty result for 24h.
const loadContributions = unstable_cache(
    async (): Promise<Activity[]> => {
        const res = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
        );
        if (!res.ok) throw new Error(`contributions API ${res.status}`);
        const data = (await res.json()) as GitHubContributionsResponse;
        if (!data.contributions?.length) throw new Error("no contributions");
        return data.contributions;
    },
    ["github-contributions"],
    { revalidate: 86400 }
);

export async function getGitHubContributions(): Promise<Activity[]> {
    try {
        return await loadContributions();
    } catch {
        return [];
    }
}
