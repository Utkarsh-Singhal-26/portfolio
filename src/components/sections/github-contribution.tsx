import { Suspense } from "react";

import {
    GitHubContributionFallback,
    GitHubContributionGraph,
} from "@/components/ui/github-contribution";
import { getGitHubContributions } from "@/lib/github-contribution";

export function GitHubContributions() {
    const contributions = getGitHubContributions();

    return (
        <div id="github-contribution" className="w-full">
            <h2 className="font-medium text-primary/90 text-base mb-4">
                github contributions.
            </h2>

            <Suspense fallback={<GitHubContributionFallback />}>
                <GitHubContributionGraph contributions={contributions} />
            </Suspense>
        </div>
    );
}
