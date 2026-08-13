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

export const GITHUB_USERNAME = "Utkarsh-Singhal-26";

export const DATA = {
    HEADER: {
        NAME: "Utkarsh Singhal",
        AGE: "21",
        PRONOUN: "he/him",
        HEADLINE:
            "Passionate about building high-performance and scalable web applications.",
        RESUME: "https://drive.google.com/file/d/1piWpArbdbjt4PKF4gZlR0nkD09au_8fE/view",
        EMAIL: "mailto:singhalutkarsh26@gmail.com",
        GITHUB: "https://github.com/Utkarsh-Singhal-26",
        LINKEDIN: "https://www.linkedin.com/in/singhalutkarsh26",
        INTRO: "Hey! I'm a full-stack developer who loves building efficient, scalable, and intuitive applications. I thrive on solving complex problems, optimizing performance, and creating seamless user experiences.",
        EXPERTISE:
            "My expertise lies in Next.js, TypeScript, Node.js, and Cloud technologies, and I enjoy working across the stack to bring ideas to life.",
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
                        "Developed and maintained backend services and APIs to support product features and integrations.",
                        "Worked on reliability, security, and performance improvements across services, including caching and monitoring.",
                        "Collaborated with frontend, platform, and DevOps teams to design APIs, event-driven workflows, and developer-facing documentation.",
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
                        "Joined the backend team as an intern and shipped API and service work on live product features.",
                        "Worked in TypeScript, Django, and AdonisJS before converting to full-time on the same team.",
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
                        "Developed and maintained scalable web applications to enhance user engagement and operational efficiency.",
                        "Hosted and managed servers on AWS EC2, configured domains, and implemented SSL certificates for secure access.",
                        "Collaborated with cross-functional teams to design and implement scalable solutions.",
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
                        "Assisted in the development of full-stack applications to support academic initiatives.",
                        "Implemented cloud-based solutions using Google Cloud Platform services.",
                        "Participated in code reviews and contributed to the optimization of existing codebases.",
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
                        "Researched API testing platforms to evaluate features, security, and integration capabilities.",
                        "Worked with AWS Lambda, Kinesis, S3, API Gateway, and EC2 for infrastructure and security work.",
                        "Built a to-do Chrome extension using the Chrome Storage API.",
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
    { label: "Vue.js", slug: "vuedotjs", bg: "#4FC08D", fg: "#ffffff" },
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
        fg: "#ffffff",
    },
    { label: "shadcn/ui", slug: "shadcnui", bg: "#000000", fg: "#ffffff" },
    { label: "Ant Design", slug: "antdesign", bg: "#0170FE", fg: "#ffffff" },
    { label: "Material UI", slug: "mui", bg: "#007FFF", fg: "#ffffff" },

    // Database & Backend
    { label: "PostgreSQL", slug: "postgresql", bg: "#4169E1", fg: "#ffffff" },
    { label: "MongoDB", slug: "mongodb", bg: "#47A248", fg: "#ffffff" },
    { label: "Redis", slug: "redis", bg: "#FF4438", fg: "#ffffff" },
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
];
