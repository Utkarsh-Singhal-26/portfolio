import { format, parse } from "date-fns";

import { ENDPOINTS } from "@/content/api";
import { CONTACT_GUIDE } from "@/content/contact";
import {
    DATA,
    getAge,
    LOCATION,
    OPEN_SOURCE_REPOS,
    SITE,
    SITE_URL,
} from "@/content/data";
import { FAQ } from "@/content/faq";
import { PRIVACY_SECTIONS, PRIVACY_SUMMARY } from "@/content/privacy";
import { POLICY_UPDATED } from "@/content/storage";
import { skills } from "@/lib/agent/api";
import { buildStory } from "@/lib/github/activity-story";
import type { Day } from "@/lib/github/commit-stats";
import type { WakaStats } from "@/lib/wakatime";

const month = (value: string) =>
    format(parse(value, "yyyy-MM", new Date()), "MMM yyyy");

export function homeMarkdown(): string {
    const { header } = DATA;

    const experience = DATA.experience
        .flatMap((company) =>
            company.roles.map(
                (role) =>
                    `- ${company.name}: ${role.title} (${role.type}), ${month(role.start)} to ${role.end ? month(role.end) : "present"}`
            )
        )
        .join("\n");

    const projects = DATA.projects
        .map(
            (project) =>
                `- ${project.name} (${project.href}): ${project.summary}`
        )
        .join("\n");

    const writing = DATA.writing
        .map((post) => `- [${post.title}](${post.href}), ${post.date}`)
        .join("\n");

    return `# ${header.name}

> ${SITE.description}

Personal portfolio: work, experience, open source contributions, and writing.

## About

${getAge()}, based in ${LOCATION.name} (${LOCATION.timezone}). ${header.headline} ${header.focus}

## Experience

${experience}

## Projects

${projects}

## Stack

${skills()
    .map((group) => `- ${group.discipline}: ${group.items.join(", ")}`)
    .join("\n")}

## Writing

${writing}

## FAQ

${FAQ.map(({ question, answer }) => `### ${question}\n\n${answer}`).join("\n\n")}

## Pages

- [Home](${SITE_URL}/): profile, headline, and all sections below
- [Work](${SITE_URL}/#work): shipped projects
- [Experience](${SITE_URL}/#experience): roles and dates
- [Open Source](${SITE_URL}/#open-source): merged pull requests
- [Writing](${SITE_URL}/#writing): notes on TypeScript
- [Developers](${SITE_URL}/developers): the API, OpenAPI spec and agent files
- [Activity](${SITE_URL}/activity): GitHub contributions for the last year and all-time coding time, as charts

## For agents

- [Homepage as Markdown](${SITE_URL}/index.md): this page; it also answers \`Accept: text/markdown\`
- [Full context](${SITE_URL}/llms-full.txt): this file plus role-by-role detail
- [API index](${SITE_URL}/api/v1): JSON for profile, experience, projects and skills
- [OpenAPI spec](${SITE_URL}/openapi.json): OpenAPI 3.1 description of the API
- [AI catalog](${SITE_URL}/.well-known/ai-catalog.json): every machine-readable resource
- [Authentication](${SITE_URL}/auth.md): none needed
- [API catalog](${SITE_URL}/.well-known/api-catalog): RFC 9727 linkset
- [Sitemap](${SITE_URL}/sitemap.xml): every canonical URL
- [Privacy](${SITE_URL}/privacy.md): what this site collects

## Contact

- GitHub: ${header.github}
- LinkedIn: ${header.linkedin}
- Email: ${header.email}

${CONTACT_GUIDE.map(({ label, items }) => `### ${label}\n\n${items.map((item) => `- ${item}`).join("\n")}`).join("\n\n")}
`;
}

export function fullMarkdown(): string {
    const roles = DATA.experience
        .map((company) => {
            const items = company.roles
                .map(
                    (role) =>
                        `### ${role.title} (${role.type}), ${month(role.start)} to ${role.end ? month(role.end) : "present"}\n\n${role.description.map((line) => `- ${line}`).join("\n")}\n\nStack: ${role.stack.join(", ")}`
                )
                .join("\n\n");
            return `## ${company.name}\n\n${company.website} · ${company.location}\n\n${items}`;
        })
        .join("\n\n");

    const projects = DATA.projects
        .map(
            (project) =>
                `### ${project.name}\n\n${project.summary}\n\n- Site: ${project.href}${project.github ? `\n- Source: ${project.github}` : ""}${project.contribution ? "\n- Open source contribution, not a solo project" : ""}\n- Stack: ${project.stack.join(", ")}`
        )
        .join("\n\n");

    const repos = OPEN_SOURCE_REPOS.map(
        (repo) => `- https://github.com/${repo}`
    ).join("\n");

    return `${homeMarkdown()}
---

# Detail

${roles}

# Projects in detail

${projects}

# Open source repositories

Repositories this portfolio lists under open source, in display order:

${repos}
`;
}

export function authMarkdown(): string {
    return `# Authentication

None. Everything on ${SITE_URL} is public and read-only: no API keys, no accounts, no sign-up.

- Send plain \`GET\` requests. The JSON API starts at ${SITE_URL}/api/v1 and is described in ${SITE_URL}/openapi.json.
- Ask for Markdown with \`Accept: text/markdown\`, or add \`.md\` where a page has one.
- Be considerate: cache responses and avoid tight loops.

Need something this site doesn't offer, or higher volume? Email ${DATA.header.email}.
`;
}

// ponytail: summary only; the full policy lives in the page. Port it here if agents need the tables.
export function privacyMarkdown(): string {
    const sections = PRIVACY_SECTIONS.map(
        ([id, title], i) => `${i + 1}. [${title}](${SITE_URL}/privacy#${id})`
    ).join("\n");

    return `# Privacy & cookies

Updated ${POLICY_UPDATED}. Full policy: ${SITE_URL}/privacy

${PRIVACY_SUMMARY.map((item) => `- ${item}`).join("\n")}

## Sections

${sections}

## Contact

Questions, requests or grievances: ${DATA.header.email}
`;
}

export const markdownResponse = (body: string) =>
    new Response(body, {
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            Vary: "Accept",
        },
    });

export function developersMarkdown(): string {
    const lines = ENDPOINTS.map(
        (e) => `- [${e.path}](${SITE_URL}${e.path}): ${e.summary} (${e.type})`
    ).join("\n");

    return `# Developers

This site answers in plain text, Markdown and JSON. No keys, no sign-up. See ${SITE_URL}/auth.md.

## Endpoints

${lines}

Any page also answers \`Accept: text/markdown\`.
`;
}

export function activityMarkdown(days: Day[], waka: WakaStats | null): string {
    if (days.length === 0)
        return "# Activity\n\nGitHub did not answer. Try again later.\n";
    const s = buildStory(days);
    const coding = waka
        ? `
## In the editor

All-time coding time from WakaTime: ${waka.total}, about ${waka.dailyAverage} a day.

- Languages: ${waka.languages.map((l) => `${l.name} ${l.percent.toFixed(1)}%`).join(", ")}
- Editors: ${waka.editors.map((e) => `${e.name} ${e.percent.toFixed(1)}%`).join(", ")}
`
        : "";

    return `# Activity

GitHub contributions for the last ${s.year.of} days.

## The year

- ${s.year.count} contributions, ${s.year.active} active days (${s.year.percent}%)
- About ${s.year.perDay} a day, best day ${s.year.peakCount} on ${s.year.peakDate}

## Busiest month

${s.month.name}${s.month.partial ? " so far" : ""}: ${s.month.count} contributions.

## Consistency

Longest streak: ${s.streak.length} days, ${s.streak.start} to ${s.streak.end}${s.streak.ongoing ? ", ongoing" : ""}.

## Rhythm

${s.week.name} is the busiest weekday (${s.week.share}%). Weekends are ${s.week.weekendShare}% of the total.

## Month by month

${s.months.ups} of ${s.months.of} months beat the month before.
${coding}`;
}
