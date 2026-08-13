import { unstable_cache } from "next/cache";

import { GITHUB_USERNAME } from "@/app/data";

export type OpenSourceRepo = {
    fullName: string;
    url: string;
    description: string | null;
    language: string | null;
    stars: number;
    prCount: number;
};

type SearchIssue = {
    repository_url: string;
};

type SearchResponse = {
    items?: SearchIssue[];
};

type RepoResponse = {
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
};

type UnghRepo = {
    repo?: {
        description?: string | null;
        stars?: number;
        language?: string | null;
        url?: string;
    };
};

async function repoMeta(fullName: string): Promise<{
    url: string;
    description: string | null;
    language: string | null;
    stars: number;
}> {
    const github = await githubJson<RepoResponse>(
        `https://api.github.com/repos/${fullName}`
    );
    if (github) {
        return {
            url: github.html_url,
            description: github.description,
            language: github.language,
            stars: github.stargazers_count,
        };
    }

    try {
        const res = await fetch(`https://ungh.cc/repos/${fullName}`, {
            cache: "no-store",
        });
        if (res.ok) {
            const ungh = (await res.json()) as UnghRepo;
            if (ungh.repo) {
                return {
                    url: `https://github.com/${fullName}`,
                    description: ungh.repo.description ?? null,
                    language: ungh.repo.language ?? null,
                    stars: ungh.repo.stars ?? 0,
                };
            }
        }
    } catch {
        // Public metadata fallback is optional.
    }

    return {
        url: `https://github.com/${fullName}`,
        description: null,
        language: null,
        stars: 0,
    };
}

type GraphQLResponse = {
    data?: {
        search?: {
            nodes?: Array<{
                repository?: {
                    nameWithOwner: string;
                    url: string;
                    description: string | null;
                    stargazerCount: number;
                    primaryLanguage?: { name: string } | null;
                } | null;
            } | null>;
        };
    };
};

const githubHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "User-Agent": "utkarsh-portfolio",
        "X-GitHub-Api-Version": "2022-11-28",
    };
    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    return headers;
};

async function githubJson<T>(url: string): Promise<T | null> {
    const res = await fetch(url, {
        headers: githubHeaders(),
        cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
}

async function fromGraphQL(): Promise<OpenSourceRepo[] | null> {
    if (!process.env.GITHUB_TOKEN) return null;

    const query = `author:${GITHUB_USERNAME} type:pr is:merged -user:${GITHUB_USERNAME}`;
    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            ...githubHeaders(),
            "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
            query: `query ($q: String!) {
                search(query: $q, type: ISSUE, first: 100) {
                    nodes {
                        ... on PullRequest {
                            repository {
                                nameWithOwner
                                url
                                description
                                stargazerCount
                                primaryLanguage { name }
                            }
                        }
                    }
                }
            }`,
            variables: { q: query },
        }),
    });
    if (!res.ok) return null;

    const json = (await res.json()) as GraphQLResponse;
    const nodes = json.data?.search?.nodes;
    if (!nodes?.length) return null;

    const counts = new Map<string, OpenSourceRepo>();
    for (const node of nodes) {
        const repo = node?.repository;
        if (!repo) continue;
        const existing = counts.get(repo.nameWithOwner);
        if (existing) {
            existing.prCount += 1;
            continue;
        }
        counts.set(repo.nameWithOwner, {
            fullName: repo.nameWithOwner,
            url: repo.url,
            description: repo.description,
            language: repo.primaryLanguage?.name ?? null,
            stars: repo.stargazerCount,
            prCount: 1,
        });
    }

    return [...counts.values()].sort((a, b) => b.prCount - a.prCount).slice(0, 8);
}

async function fromRest(): Promise<OpenSourceRepo[]> {
    const query = `author:${GITHUB_USERNAME} type:pr is:merged -user:${GITHUB_USERNAME}`;
    const search = await githubJson<SearchResponse>(
        `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=100&sort=updated`
    );
    if (!search?.items?.length) return [];

    const counts = new Map<string, number>();
    for (const item of search.items) {
        const fullName = item.repository_url.replace(
            "https://api.github.com/repos/",
            ""
        );
        counts.set(fullName, (counts.get(fullName) ?? 0) + 1);
    }

    const ranked = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

    return Promise.all(
        ranked.map(async ([fullName, prCount]) => {
            const meta = await repoMeta(fullName);
            return {
                fullName,
                prCount,
                ...meta,
            };
        })
    );
}

export const getOpenSource = unstable_cache(
    async (): Promise<OpenSourceRepo[]> => {
        const graphql = await fromGraphQL();
        if (graphql?.length) return graphql;
        return fromRest();
    },
    ["github-open-source-v4"],
    { revalidate: 86400 }
);
