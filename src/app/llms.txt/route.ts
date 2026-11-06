import { format, parse } from "date-fns";

import { DATA, getAge, SITE_URL } from "@/content/data";

export const revalidate = 86400;

const month = (value: string) =>
    format(parse(value, "yyyy-MM", new Date()), "MMM yyyy");

const experience = DATA.experience
    .flatMap((company) =>
        company.roles.map(
            (role) =>
                `- ${company.name}: ${role.title} (${role.type}), ${month(role.start)} to ${role.end ? month(role.end) : "present"}`
        )
    )
    .join("\n");

const projects = DATA.projects
    .map((project) => `- ${project.name} (${project.href}): ${project.summary}`)
    .join("\n");

const writing = DATA.writing
    .map((post) => `- [${post.title}](${post.href}), ${post.date}`)
    .join("\n");

function body() {
    const { header } = DATA;
    return `# ${header.name}

> Software developer. Backend-leaning full-stack, TypeScript/Node/Python across Django, AdonisJS, and Next.js, with production time on Postgres, MongoDB, and Redis.

Personal portfolio: work, experience, open source contributions, and writing.

## About

${getAge()}, based in Delhi NCR, India (Asia/Kolkata). ${header.headline} ${header.focus}

## Experience

${experience}

## Projects

${projects}

## Stack

TypeScript, Node.js, Python, Django, AdonisJS, React, Next.js, PostgreSQL, MongoDB, Redis, AWS, GCP, Firebase, Tailwind CSS.

## Writing

${writing}

## Pages

- [Home](${SITE_URL}/): profile, headline, and all sections below
- [Work](${SITE_URL}/#work): shipped projects
- [Experience](${SITE_URL}/#experience): roles and dates
- [Open Source](${SITE_URL}/#open-source): merged pull requests
- [Writing](${SITE_URL}/#writing): notes on TypeScript

## Contact

- GitHub: ${header.github}
- LinkedIn: ${header.linkedin}
- Email: ${header.email}
`;
}

export function GET() {
    return new Response(body(), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
