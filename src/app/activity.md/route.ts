import { activityMarkdown, markdownResponse } from "@/lib/agent/markdown";
import { toDays } from "@/lib/github/commit-stats";
import { getGitHubContributions } from "@/lib/github/contributions";
import { getWakaStats } from "@/lib/wakatime";

export const revalidate = 86400;

export async function GET() {
    const [contributions, waka] = await Promise.all([
        getGitHubContributions(),
        getWakaStats(),
    ]);
    return markdownResponse(activityMarkdown(toDays(contributions), waka));
}
