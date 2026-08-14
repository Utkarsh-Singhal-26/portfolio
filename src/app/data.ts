import type { StaticImageData } from "next/image";

import {
    AirwatchImage,
    ContribCirclesImage,
    ReactBitsImage,
    VueBitsImage,
} from "@/assets/projects";

export type ExperienceRole = {
    title: string;
    type: string;
    start: string;
    end?: string;
    description: string[];
    stack: string[];
    open?: boolean;
};

export type ExperienceCompany = {
    name: string;
    website: string;
    location: string;
    current?: boolean;
    roles: ExperienceRole[];
};

export type Project = {
    name: string;
    href: string;
    github?: string;
    contribution?: boolean;
    contain?: boolean;
    summary: string;
    stack: string[];
    image: StaticImageData;
};

export type Writing = {
    title: string;
    date: string;
    minutes: number;
    href: string;
};

export const GITHUB_USERNAME = "Utkarsh-Singhal-26";

export const DATA = {
    HEADER: {
        NAME: "Utkarsh Singhal",
        AGE: "21",
        PRONOUN: "he/him",
        HEADLINE: "I like shipping things people can actually use.",
        RESUME: "https://drive.google.com/file/d/1piWpArbdbjt4PKF4gZlR0nkD09au_8fE/view",
        EMAIL: "mailto:singhalutkarsh26@gmail.com",
        GITHUB: "https://github.com/Utkarsh-Singhal-26",
        LINKEDIN: "https://www.linkedin.com/in/singhalutkarsh26",
        INTRO: "I get restless if I am not building something I can share.",
        FOCUS: "Nights go to open source and small tools.",
        EXPERTISE:
            "I like reading other people's code as much as I like writing my own.",
    },

    EXPERIENCE: [
        {
            name: "Suraasa",
            website: "https://www.suraasa.com/",
            location: "Hybrid",
            current: true,
            roles: [
                {
                    title: "SDE - 1 Backend",
                    type: "Full-time",
                    start: "2026-01",
                    open: true,
                    description: [
                        "I write and maintain product APIs in TypeScript, Django, and AdonisJS.",
                        "Caching, monitoring, and event-driven jobs run against Postgres, MongoDB, and Redis.",
                    ],
                    stack: [
                        "TypeScript",
                        "Node.js",
                        "Python",
                        "Django",
                        "AdonisJS",
                        "PostgreSQL",
                        "MongoDB",
                        "Redis",
                    ],
                },
                {
                    title: "Backend Developer Intern",
                    type: "Intern",
                    start: "2025-10",
                    end: "2025-12",
                    description: [
                        "I joined as an intern and shipped API work on live features, then converted to full-time on the same team.",
                    ],
                    stack: [
                        "TypeScript",
                        "Node.js",
                        "Python",
                        "Django",
                        "AdonisJS",
                        "PostgreSQL",
                    ],
                },
            ],
        },
        {
            name: "Aardo Solutions",
            website: "https://www.aardosolutions.com/",
            location: "Remote",
            roles: [
                {
                    title: "Software Developer",
                    type: "Full-time",
                    start: "2024-11",
                    end: "2025-09",
                    description: [
                        "I built and ran web apps on AWS EC2, including domains and TLS.",
                        "The stack was TypeScript, React, Next.js, Node, and MongoDB.",
                    ],
                    stack: [
                        "TypeScript",
                        "React.js",
                        "Next.js",
                        "Node.js",
                        "MongoDB",
                        "AWS",
                        "GCP",
                    ],
                },
            ],
        },
        {
            name: "VIPS-TC",
            website: "https://vips.edu/",
            location: "Hybrid - Delhi",
            roles: [
                {
                    title: "Software Developer Intern",
                    type: "Intern",
                    start: "2023-11",
                    end: "2025-06",
                    description: [
                        "I worked on campus web apps in React, Firebase, and GCP.",
                    ],
                    stack: [
                        "React.js",
                        "Tailwind CSS",
                        "Material UI",
                        "Firebase",
                        "GCP",
                    ],
                },
            ],
        },
        {
            name: "Requestly",
            website: "https://requestly.com/",
            location: "Hybrid - Delhi",
            roles: [
                {
                    title: "Product Engineer Intern",
                    type: "Intern",
                    start: "2024-08",
                    end: "2024-10",
                    description: [
                        "I researched API testing platforms and worked with AWS Lambda, Kinesis, S3, and API Gateway.",
                        "I also built a to-do Chrome extension with the Chrome Storage API.",
                    ],
                    stack: [
                        "TypeScript",
                        "React.js",
                        "Tailwind CSS",
                        "AWS",
                        "Chrome Extensions",
                    ],
                },
            ],
        },
    ] satisfies ExperienceCompany[],

    PROJECTS: [
        {
            name: "Vue Bits",
            href: "https://vue-bits.dev/",
            github: "https://github.com/DavidHDev/vue-bits",
            contribution: true,
            summary:
                "I send animated Vue components into this library. Seeing them on the site is the part I like.",
            stack: ["Vue.js", "TypeScript", "Tailwind CSS"],
            image: VueBitsImage,
        },
        {
            name: "React Bits",
            href: "https://reactbits.dev",
            github: "https://github.com/DavidHDev/react-bits",
            contribution: true,
            summary:
                "I send TypeScript and Tailwind variants into this library. Same components, more ways to use them.",
            stack: ["React", "TypeScript", "Tailwind CSS"],
            image: ReactBitsImage,
        },
        {
            name: "Contributors Circles",
            href: "https://contrib-circles.vercel.app/",
            contain: true,
            summary:
                "I wanted a nicer way to show who ships a repo, so I made circle-pack badges you embed with one markdown line.",
            stack: ["Next.js", "TypeScript", "Vercel"],
            image: ContribCirclesImage,
        },
        {
            name: "AirWatch",
            href: "https://airwatch-pwa-app.vercel.app/",
            github: "https://github.com/Utkarsh-Singhal-26/airwatch-pwa-app",
            summary:
                "I built this because I wanted live air quality on my phone, with maps, charts, and alerts.",
            stack: ["Next.js", "TypeScript", "Firebase", "PWA"],
            image: AirwatchImage,
        },
    ] satisfies Project[],

    WRITING: [
        {
            title: "ORMs & ODMs: Choosing the Right Tool for Your Database Needs",
            date: "2025-03-24",
            minutes: 4,
            href: "https://www.linkedin.com/pulse/orms-odms-choosing-right-tool-your-database-needs-utkarsh-singhal-dnshc/",
        },
        {
            title: "TypeScript and React: Harnessing the Full Power of Types",
            date: "2025-03-11",
            minutes: 6,
            href: "https://www.linkedin.com/pulse/typescript-react-harnessing-full-power-types-utkarsh-singhal-6bxuc/",
        },
        {
            title: "Understanding Utility Types in TypeScript: Supercharging Your Codebase",
            date: "2025-03-10",
            minutes: 7,
            href: "https://www.linkedin.com/pulse/understanding-utility-types-typescript-supercharging-your-singhal-zdxwc/",
        },
        {
            title: "Mastering TypeScript Generics: Building Flexible and Scalable Code",
            date: "2025-03-08",
            minutes: 7,
            href: "https://www.linkedin.com/pulse/mastering-typescript-generics-building-flexible-scalable-singhal-f77bc/",
        },
    ] satisfies Writing[],
};

export type Chip = {
    label: string;
    slug: string;
    bg: string;
    fg: string;
    darkBg?: boolean;
    iconUrl?: string;
};

export const CHIPS: Chip[] = [
    // Languages
    {
        label: "JavaScript",
        slug: "javascript",
        bg: "#F7DF1E",
        fg: "#000000",
        darkBg: true,
    },
    { label: "TypeScript", slug: "typescript", bg: "#3178C6", fg: "#ffffff" },
    { label: "HTML", slug: "html5", bg: "#E34F26", fg: "#ffffff" },
    {
        label: "CSS",
        slug: "css3",
        bg: "#1572B6",
        fg: "#ffffff",
        iconUrl: "https://svgl.app/library/css.svg",
    },
    { label: "Node.js", slug: "nodedotjs", bg: "#5FA04E", fg: "#ffffff" },
    { label: "Python", slug: "python", bg: "#3776AB", fg: "#ffffff" },

    // Frameworks
    {
        label: "React",
        slug: "react",
        bg: "#61DAFB",
        fg: "#000000",
        darkBg: true,
    },
    { label: "Next.js", slug: "nextdotjs", bg: "#000000", fg: "#ffffff" },
    { label: "Django", slug: "django", bg: "#092E20", fg: "#ffffff" },
    {
        label: "Vue.js",
        slug: "vuedotjs",
        bg: "#4FC08D",
        fg: "#000000",
        darkBg: true,
    },
    { label: "Svelte", slug: "svelte", bg: "#FF3E00", fg: "#ffffff" },
    { label: "Astro", slug: "astro", bg: "#FF5D01", fg: "#ffffff" },
    { label: "Express.js", slug: "express", bg: "#000000", fg: "#ffffff" },
    { label: "AdonisJS", slug: "adonisjs", bg: "#5A45FF", fg: "#ffffff" },
    {
        label: "React Native",
        slug: "react",
        bg: "#61DAFB",
        fg: "#000000",
        darkBg: true,
    },
    { label: "Expo", slug: "expo", bg: "#000020", fg: "#ffffff" },

    // Libraries
    { label: "React Query", slug: "reactquery", bg: "#FF4154", fg: "#ffffff" },
    {
        label: "Tailwind CSS",
        slug: "tailwindcss",
        bg: "#06B6D4",
        fg: "#000000",
        darkBg: true,
    },
    { label: "shadcn/ui", slug: "shadcnui", bg: "#000000", fg: "#ffffff" },
    {
        label: "Ant Design",
        slug: "antdesign",
        bg: "#0170FE",
        fg: "#000000",
        darkBg: true,
    },
    {
        label: "Material UI",
        slug: "mui",
        bg: "#007FFF",
        fg: "#000000",
        darkBg: true,
    },
    { label: "Celery", slug: "celery", bg: "#37814A", fg: "#ffffff" },

    // Database & Backend
    { label: "PostgreSQL", slug: "postgresql", bg: "#4169E1", fg: "#ffffff" },
    {
        label: "MongoDB",
        slug: "mongodb",
        bg: "#47A248",
        fg: "#000000",
        darkBg: true,
    },
    {
        label: "Snowflake",
        slug: "snowflake",
        bg: "#29B5E8",
        fg: "#000000",
        darkBg: true,
    },
    { label: "Redis", slug: "redis", bg: "#FF4438", fg: "#ffffff" },
    { label: "Prisma", slug: "prisma", bg: "#2D3748", fg: "#ffffff" },
    { label: "Contentful", slug: "contentful", bg: "#2478CC", fg: "#ffffff" },
    { label: "Firebase", slug: "firebase", bg: "#DD2C00", fg: "#ffffff" },
    { label: "GraphQL", slug: "graphql", bg: "#E10098", fg: "#ffffff" },
    { label: "Clerk", slug: "clerk", bg: "#6C47FF", fg: "#ffffff" },

    // Cloud & Deployment
    {
        label: "GCP",
        slug: "googlecloud",
        bg: "#4285F4",
        fg: "#ffffff",
        iconUrl: "https://svgl.app/library/google-cloud.svg",
    },
    {
        label: "AWS",
        slug: "amazonaws",
        bg: "#232F3E",
        fg: "#ffffff",
        iconUrl: "https://svgl.app/library/aws_light.svg",
    },
    { label: "Vercel", slug: "vercel", bg: "#000000", fg: "#ffffff" },

    // Tools & Platforms
    { label: "Git", slug: "git", bg: "#F05032", fg: "#ffffff" },
    { label: "GitHub", slug: "github", bg: "#181717", fg: "#ffffff" },
    { label: "Postman", slug: "postman", bg: "#FF6C37", fg: "#ffffff" },
    { label: "Docker", slug: "docker", bg: "#2496ED", fg: "#ffffff" },
    {
        label: "VS Code",
        slug: "visualstudiocode",
        bg: "#007ACC",
        fg: "#ffffff",
        iconUrl: "https://svgl.app/library/vscode.svg",
    },
    {
        label: "Prettier",
        slug: "prettier",
        bg: "#F7B93E",
        fg: "#000000",
        iconUrl: "https://svgl.app/library/prettier-icon-light.svg",
    },
    { label: "Sentry", slug: "sentry", bg: "#362D59", fg: "#ffffff" },
    { label: "Storybook", slug: "storybook", bg: "#FF4785", fg: "#ffffff" },
];
