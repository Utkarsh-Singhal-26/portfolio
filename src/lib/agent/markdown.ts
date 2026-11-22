import { format, parse } from "date-fns";

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

## For agents

- [Homepage as Markdown](${SITE_URL}/index.md): this page; it also answers \`Accept: text/markdown\`
- [Full context](${SITE_URL}/llms-full.txt): this file plus role-by-role detail
- [Authentication](${SITE_URL}/auth.md): none needed
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
