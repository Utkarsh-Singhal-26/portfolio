import { DATA, LOCATION, SITE, SITE_URL } from "@/content/data";
import { FAQ } from "@/content/faq";

// Node ids stay under this site's own domain, even for things other people own.
const PERSON_ID = `${SITE_URL}/#person`;
const slug = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
const current = DATA.experience[0];
const currentRole = {
    ...current.roles[0],
    title: current.roles[0].title.replace(/\s-\s/, "-"),
};

const SKILLS = [
    ...new Set(DATA.experience.flatMap((c) => c.roles.flatMap((r) => r.stack))),
];

export const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Person",
            "@id": PERSON_ID,
            name: DATA.header.name,
            url: SITE_URL,
            email: `mailto:${DATA.header.email}`,
            jobTitle: currentRole.title,
            description: SITE.description,
            homeLocation: {
                "@type": "Place",
                name: LOCATION.name,
                geo: {
                    "@type": "GeoCoordinates",
                    latitude: LOCATION.latitude,
                    longitude: LOCATION.longitude,
                },
            },
            worksFor: {
                "@type": "Organization",
                name: current.name,
                url: current.website,
            },
            hasOccupation: {
                "@type": "Occupation",
                name: currentRole.title,
                skills: SKILLS.join(", "),
            },
            knowsAbout: [...SKILLS, "Open source software"],
            sameAs: [
                DATA.header.github,
                DATA.header.linkedin,
                `https://x.com/${SITE.twitterCreator.slice(1)}`,
            ],
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: SITE.title,
            description: SITE.description,
            publisher: { "@id": PERSON_ID },
        },
        {
            "@type": "ProfilePage",
            "@id": `${SITE_URL}/#profilepage`,
            url: SITE_URL,
            name: SITE.title,
            isPartOf: { "@id": `${SITE_URL}/#website` },
            mainEntity: { "@id": PERSON_ID },
        },
        {
            "@type": "FAQPage",
            "@id": `${SITE_URL}/#faq`,
            url: `${SITE_URL}/#faq`,
            mainEntity: FAQ.map(({ question, answer }) => ({
                "@type": "Question",
                name: question,
                acceptedAnswer: { "@type": "Answer", text: answer },
            })),
        },
        ...DATA.writing.map((post) => ({
            "@type": "Article",
            "@id": `${SITE_URL}/#article-${slug(post.title)}`,
            url: post.href,
            headline: post.title,
            datePublished: post.date,
            timeRequired: `PT${post.minutes}M`,
            author: { "@id": PERSON_ID },
            publisher: { "@id": PERSON_ID },
        })),
        ...DATA.projects.map((project) => ({
            "@type": "SoftwareApplication",
            "@id": `${SITE_URL}/#project-${slug(project.name)}`,
            name: project.name,
            url: project.href,
            description: project.summary,
            applicationCategory: "WebApplication",
            operatingSystem: "Web",
            keywords: project.stack.join(", "),
            ...(project.github ? { sameAs: project.github } : {}),
            // Contribution projects belong to someone else; credit, don't claim.
            [project.contribution ? "contributor" : "author"]: {
                "@id": PERSON_ID,
            },
        })),
    ],
};
