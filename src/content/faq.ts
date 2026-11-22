import { format, parse } from "date-fns";

import { DATA, LOCATION, OPEN_SOURCE_REPOS } from "@/content/data";

export type Faq = { question: string; answer: string };

const { header } = DATA;
const company = DATA.experience[0];
const role = company.roles[0];
const since = format(parse(role.start, "yyyy-MM", new Date()), "MMMM yyyy");
const repos = OPEN_SOURCE_REPOS.slice(0, 3).map((repo) => repo.split("/")[1]);

export const FAQ: Faq[] = [
    {
        question: `Who is ${header.name}?`,
        answer: `A ${header.role.toLowerCase()} based in ${LOCATION.name}. Since ${since} he has worked as ${role.title.replace(/\s-\s/, "-")} at ${company.name}.`,
    },
    {
        question: "What does he work with?",
        answer: `Day to day: ${role.stack.join(", ")}. The Stack section lists the rest.`,
    },
    {
        question: "Is he open to roles or freelance work?",
        answer: "Roles, contract projects and open-source collaboration are all welcome. The quickest way is the sentence form in the Get in touch section, which opens an email. Bulk recruiter mail and sales pitches aren't.",
    },
    {
        question: "What open source has he contributed to?",
        answer: `Merged pull requests across repositories such as ${repos.join(", ")}. The open-source section lists each repository with its merged pull requests.`,
    },
    {
        question: "Where is he based, and which timezone?",
        answer: `${LOCATION.name}, timezone ${LOCATION.timezone}.`,
    },
    {
        question: "Can an AI agent read this site?",
        answer: "Yes. Start with /llms.txt, or request any page with the header Accept: text/markdown to get it as Markdown. No keys or sign-up are needed.",
    },
];
