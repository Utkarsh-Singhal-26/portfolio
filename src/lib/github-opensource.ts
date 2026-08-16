import { unstable_cache } from "next/cache";

import { GITHUB_USERNAME, OPEN_SOURCE_REPOS } from "@/app/data";

export type OpenSourcePr = {
    number: number;
    title: string;
    url: string;
    mergedAt: string | null;
};

export type OpenSourceRepo = {
    fullName: string;
    url: string;
    description: string | null;
    language: string | null;
    stars: number;
    prCount: number;
    lastMergedAt: string | null;
    recentPrs: OpenSourcePr[];
};

export type OpenSourceSnapshot = {
    repos: OpenSourceRepo[];
    searchTotal: number;
};

const RECENT_PR_LIMIT = 3;
const SEARCH_PAGE = 100;
const SEARCH_MAX = 1000;
const EMPTY: OpenSourceSnapshot = { repos: [], searchTotal: 0 };
const SEARCH_QUERY = `author:${GITHUB_USERNAME} type:pr is:merged -user:${GITHUB_USERNAME}`;

type SearchIssue = {
    title?: string;
    number?: number;
    html_url?: string;
    closed_at?: string | null;
    repository_url: string;
    pull_request?: { merged_at?: string | null };
};

type SearchResponse = {
    total_count?: number;
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
    };
};

type GraphQLPull = {
    number?: number;
    title?: string;
    url?: string;
    mergedAt?: string | null;
    repository?: {
        nameWithOwner: string;
        url: string;
        description: string | null;
        stargazerCount: number;
        primaryLanguage?: { name: string } | null;
    } | null;
};

type GraphQLResponse = {
    data?: {
        search?: {
            issueCount?: number;
            pageInfo?: {
                hasNextPage: boolean;
                endCursor: string | null;
            };
            nodes?: Array<GraphQLPull | null>;
        };
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
    } catch {}

    return {
        url: `https://github.com/${fullName}`,
        description: null,
        language: null,
        stars: 0,
    };
}

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

function sortPrs(prs: OpenSourcePr[]): OpenSourcePr[] {
    return [...prs].sort((a, b) => {
        if (a.mergedAt && b.mergedAt)
            return b.mergedAt.localeCompare(a.mergedAt);
        if (a.mergedAt) return -1;
        if (b.mergedAt) return 1;
        return b.number - a.number;
    });
}

function finalizeRepo(repo: OpenSourceRepo): OpenSourceRepo {
    const recentPrs = sortPrs(repo.recentPrs).slice(0, RECENT_PR_LIMIT);
    return {
        ...repo,
        recentPrs,
        lastMergedAt: recentPrs[0]?.mergedAt ?? null,
    };
}

function rankRepos(repos: OpenSourceRepo[]): OpenSourceRepo[] {
    return [...repos].sort((a, b) => {
        if (b.prCount !== a.prCount) return b.prCount - a.prCount;
        return (b.lastMergedAt ?? "").localeCompare(a.lastMergedAt ?? "");
    });
}

function snapshotFrom(
    repos: OpenSourceRepo[],
    searchTotal: number
): OpenSourceSnapshot {
    return {
        repos: rankRepos(repos.map(finalizeRepo)),
        searchTotal,
    };
}

function listedRepos(repos: OpenSourceRepo[]): OpenSourceRepo[] {
    if (OPEN_SOURCE_REPOS.length === 0) return repos;
    const byName = new Map(
        repos.map((repo) => [repo.fullName.toLowerCase(), repo])
    );
    return OPEN_SOURCE_REPOS.map(
        (name) => byName.get(name.toLowerCase()) ?? emptyRepo(name)
    );
}

function emptyRepo(fullName: string, url?: string): OpenSourceRepo {
    return {
        fullName,
        url: url ?? `https://github.com/${fullName}`,
        description: null,
        language: null,
        stars: 0,
        prCount: 0,
        lastMergedAt: null,
        recentPrs: [],
    };
}

function addPr(
    counts: Map<string, OpenSourceRepo>,
    fullName: string,
    repoSeed: Partial<OpenSourceRepo> | null,
    pr: OpenSourcePr | null
) {
    let repo = counts.get(fullName);
    if (!repo) {
        repo = { ...emptyRepo(fullName), ...repoSeed };
        counts.set(fullName, repo);
    }
    repo.prCount += 1;
    if (pr) repo.recentPrs.push(pr);
}

function prFromGraphQL(node: GraphQLPull): OpenSourcePr | null {
    if (!node.number || !node.title || !node.url) return null;
    return {
        number: node.number,
        title: node.title,
        url: node.url,
        mergedAt: node.mergedAt ?? null,
    };
}

function prFromSearch(item: SearchIssue): OpenSourcePr | null {
    if (!item.number || !item.title || !item.html_url) return null;
    return {
        number: item.number,
        title: item.title,
        url: item.html_url,
        mergedAt: item.pull_request?.merged_at ?? item.closed_at ?? null,
    };
}

async function fromGraphQL(): Promise<OpenSourceSnapshot | null> {
    if (!process.env.GITHUB_TOKEN) return null;

    const counts = new Map<string, OpenSourceRepo>();
    let cursor: string | null = null;
    let searchTotal = 0;
    let fetched = 0;

    while (fetched < SEARCH_MAX) {
        if (searchTotal > 0 && fetched >= searchTotal) break;

        const res: Response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                ...githubHeaders(),
                "Content-Type": "application/json",
            },
            cache: "no-store",
            body: JSON.stringify({
                query: `query ($q: String!, $after: String) {
                    search(query: $q, type: ISSUE, first: ${SEARCH_PAGE}, after: $after) {
                        issueCount
                        pageInfo { hasNextPage endCursor }
                        nodes {
                            ... on PullRequest {
                                number
                                title
                                url
                                mergedAt
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
                variables: { q: SEARCH_QUERY, after: cursor },
            }),
        });
        if (!res.ok) break;

        const payload = (await res.json()) as GraphQLResponse;
        const search = payload.data?.search;
        if (searchTotal === 0 && typeof search?.issueCount === "number") {
            searchTotal = search.issueCount;
        }

        const nodes = search?.nodes;
        if (!nodes?.length) break;

        for (const node of nodes) {
            const repo = node?.repository;
            if (!repo) continue;
            addPr(
                counts,
                repo.nameWithOwner,
                {
                    url: repo.url,
                    description: repo.description,
                    language: repo.primaryLanguage?.name ?? null,
                    stars: repo.stargazerCount,
                },
                prFromGraphQL(node)
            );
        }

        fetched += nodes.length;
        if (
            !search?.pageInfo?.hasNextPage ||
            fetched >= Math.min(searchTotal, SEARCH_MAX)
        ) {
            break;
        }
        cursor = search.pageInfo.endCursor;
    }

    if (!counts.size) return null;
    return snapshotFrom([...counts.values()], searchTotal);
}

async function fromRest(): Promise<OpenSourceSnapshot> {
    const counts = new Map<string, OpenSourceRepo>();
    let searchTotal = 0;
    let fetched = 0;

    let page = 1;
    while (fetched < SEARCH_MAX) {
        if (searchTotal > 0 && fetched >= searchTotal) break;

        const search = await githubJson<SearchResponse>(
            `https://api.github.com/search/issues?q=${encodeURIComponent(SEARCH_QUERY)}&per_page=${SEARCH_PAGE}&page=${page}`
        );
        if (!search?.items?.length) break;

        if (searchTotal === 0 && typeof search.total_count === "number") {
            searchTotal = search.total_count;
        }

        for (const item of search.items) {
            const fullName = item.repository_url.replace(
                "https://api.github.com/repos/",
                ""
            );
            addPr(counts, fullName, null, prFromSearch(item));
        }

        fetched += search.items.length;
        if (
            search.items.length < SEARCH_PAGE ||
            fetched >= Math.min(searchTotal, SEARCH_MAX)
        ) {
            break;
        }
        page += 1;
    }

    if (!counts.size) return EMPTY;
    return snapshotFrom([...counts.values()], searchTotal);
}

const loadOpenSource = unstable_cache(
    async (): Promise<OpenSourceSnapshot> => {
        const graphql = await fromGraphQL();
        if (graphql?.repos.length) return graphql;
        return fromRest();
    },
    ["github-open-source-v11"],
    { revalidate: 86400 }
);

export async function getOpenSource(): Promise<OpenSourceSnapshot> {
    const all = await loadOpenSource();
    const repos = listedRepos(all.repos);
    const hydrated = await Promise.all(
        repos.map(async (repo) => {
            if (repo.description !== null) return repo;
            return { ...repo, ...(await repoMeta(repo.fullName)) };
        })
    );
    return { ...all, repos: hydrated };
}
