import type { StaticImageData } from "next/image";

import {
    OrmsOdmsImage,
    TsGenericsImage,
    TsReactImage,
    UtilityTypesImage,
} from "@/assets/blogs";
import {
    AirwatchImage,
    LibraryImage,
    SkygazeImage,
    TodoImage,
    VIPSImage,
    VueBitsImage,
} from "@/assets/projects";

export interface IProjectData {
    LIVE_PREVIEW?: string;
    GITHUB?: string;
    DESCRIPTION: string[];
    NOTE?: string;
    TECH_STACK: string[];
    IMAGE: StaticImageData;
}

export interface IBlogData {
    DATE: string;
    TIME: string;
    LINK: string;
    DESCRIPTION: string;
    IMAGE?: StaticImageData;
}

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

    EXPERIENCE: {
        Suraasa: {
            WEBSITE: "https://www.suraasa.com/",
            POSITION: "SDE - 1 Backend",
            LOCATION: "Hybrid",
            DURATION: "Oct, 2025 - Present",
            DESCRIPTION: [
                "Developed and maintained backend services and APIs to support product features and integrations.",
                "Worked on reliability, security, and performance improvements across services, including caching and monitoring.",
                "Collaborated with frontend, platform, and DevOps teams to design APIs, event-driven workflows, and developer-facing documentation.",
            ],
            TECH_STACK: [
                "TypeScript",
                "Node.js",
                "Python",
                "Django",
                "AdonisJS",
                "PostgreSQL",
                "MongoDB",
                "Redis",
                "Git & GitHub",
            ],
        },
        "Aardo Solutions": {
            WEBSITE: "https://www.aardosolutions.com/",
            POSITION: "Software Developer",
            LOCATION: "Remote",
            DURATION: "Nov, 2024 - Sep, 2025",
            DESCRIPTION: [
                "Developed and maintained scalable web applications to enhance user engagement and operational efficiency.",
                "Hosted and managed servers on AWS EC2, configured domains, and implemented SSL certificates for secure access.",
                "Collaborated with cross-functional teams to design and implement scalable solutions.",
                "Utilized modern frameworks and libraries to ensure responsive and dynamic user interfaces.",
            ],
            TECH_STACK: [
                "TypeScript",
                "React.js",
                "Next.js",
                "Tailwind CSS",
                "ShadCN",
                "Node.js",
                "Express.js",
                "MongoDB",
                "Firebase",
                "Contentful",
                "AWS",
                "GCP",
                "Vercel",
                "Nginx",
                "Git & Github",
            ],
        },
        "Vivekananda Institute of Professional Studies - Technical Campus (VIPS-TC)":
            {
                WEBSITE: "https://vips.edu/",
                POSITION: "Software Developer Intern",
                LOCATION: "Hybrid - Delhi, India",
                DURATION: "Nov, 2023 - Jun, 2025",
                DESCRIPTION: [
                    "Assisted in the development of full-stack applications to support academic initiatives.",
                    "Implemented cloud-based solutions using Google Cloud Platform (GCP) services.",
                    "Participated in code reviews and contributed to the optimization of existing codebases.",
                ],
                TECH_STACK: [
                    "React.js",
                    "Tailwind CSS",
                    "Material UI",
                    "Firebase",
                    "GCP",
                    "Vercel",
                    "Git & Github",
                ],
            },
        Requestly: {
            WEBSITE: "https://requestly.com/",
            POSITION: "Product Engineer Intern",
            LOCATION: "Hybrid - Delhi, India",
            DURATION: "Aug, 2024 - Oct, 2024",
            DESCRIPTION: [
                "Researched and analyzed various API testing platforms (Kubesense, LevoAI, Wallarm, Traceable, Safe Security, Keploy) to evaluate features, security, and integration capabilities.",
                "Worked extensively with AWS services (Lambda, Kinesis, S3, API Gateway, EC2, Route 53) to manage infrastructure, automate processes, and optimize security configurations.",
                "Built a To-Do Chrome Extension using Chrome Storage API, enabling users to save and manage tasks directly within their browser.",
            ],
            TECH_STACK: [
                "TypeScript",
                "React.js",
                "Tailwind CSS",
                "AWS",
                "Chrome Extensions",
                "Git & Github",
            ],
        },
    },

    PROJECTS: {
        "VIPS-TC": {
            LIVE_PREVIEW: "https://vips.edu",
            DESCRIPTION: [
                "Contributed to the development and maintenance of the main VIPS-TC website.",
                "Implemented various front-end features using modern React and Material UI libraries.",
                "Ensured responsive design and cross-browser compatibility for a seamless user experience.",
                "Collaborated with the team to enhance website performance and accessibility.",
            ],
            TECH_STACK: [
                "React.js",
                "Material UI",
                "Axios",
                "Firebase",
                "Styled Components",
                "Razorpay",
                "XLSX",
            ],
            IMAGE: VIPSImage,
        },
        "Vue Bits": {
            SLUG: "vue-bits",
            LIVE_PREVIEW: "https://vue-bits.dev/",
            GITHUB: "https://github.com/DavidHDev/vue-bits",
            DESCRIPTION: [
                "Contributed 20+ components to the largest and most creative library of animated Vue components.",
                "Helped develop highly customizable animated UI elements for modern web projects, including text animations, backgrounds, and interactive visuals.",
                "Components are designed for seamless integration with Vue.js and Nuxt projects, providing minimal dependencies and flexible prop-based customization.",
                "Open-source collection growing weekly, inspired by the React Bits project.",
            ],
            TECH_STACK: ["Vue.js", "TypeScript", "Tailwind CSS"],
            IMAGE: VueBitsImage,
        },
        "Digital Library, VIPS-TC": {
            LIVE_PREVIEW: "https://btech.library.vips.edu/",
            DESCRIPTION: [
                "Developed and launched a functional library website for a technical institution.",
                "Implemented user-friendly interface to improve accessibility of library resources.",
                "Designed responsive layout ensuring compatibility across desktop and mobile devices",
            ],
            TECH_STACK: ["React.js", "Tailwind CSS", "Firebase"],
            IMAGE: LibraryImage,
        },
        "Skygaze India": {
            LIVE_PREVIEW: "https://www.skygazeindia.com/",
            DESCRIPTION: [
                "Integrated the Razorpay payment gateway to enable secure and seamless transactions",
                "Built a high-performance UI using Next.js and TypeScript, optimizing user experience and system efficiency.",
            ],
            TECH_STACK: [
                "React.js",
                "Next.js",
                "TypeScript",
                "Tailwind CSS",
                "Razorpay",
                "Firebase",
                "GCP",
            ],
            IMAGE: SkygazeImage,
        },
        "AirWatch PWA": {
            LIVE_PREVIEW: "https://airwatch-pwa-app.vercel.app/",
            GITHUB: "https://github.com/Utkarsh-Singhal-26/airwatch-pwa-app",
            DESCRIPTION: [
                "Built a fully responsive, offline-capable Progressive Web App (PWA) using Next.js 15 to monitor air quality in real-time.",
                "Integrated Firebase Cloud Messaging for push notifications and AI-powered smart insights using Groq SDK.",
                "Implemented interactive charts with Recharts and Google Maps for detailed visualizations.",
                "Designed a beautiful UI using TailwindCSS, ShadCN UI, and Lucide Icons with strong TypeScript typing and scalable architecture.",
            ],
            TECH_STACK: [
                "Next.js",
                "ShadCN UI",
                "Tailwind CSS",
                "TypeScript",
                "Firebase",
                "Recharts",
                "Google Maps API",
                "Groq SDK",
                "PWA",
            ],
            IMAGE: AirwatchImage,
        },
        "ToDo Extension with Chrome Storage API": {
            LIVE_PREVIEW: "https://todo-extension-webapp.vercel.app/",
            GITHUB: "https://github.com/Utkarsh-Singhal-26/todo-extension",
            DESCRIPTION: [
                "Developed and launched a Chrome extension for task management using Chrome Storage API.",
                "Implemented user-friendly interface to enhance productivity and task tracking.",
                "Designed responsive layout ensuring seamless experience across different screen sizes and browsers.",
                "Integrated message broadcasting for real-time updates and synchronization",
            ],
            NOTE: "Note: The extension is not published on the Chrome Web Store.",
            TECH_STACK: [
                "TypeScript",
                "React.js",
                "Tailwind CSS",
                "Borwser Extension",
                "Chrome Storage API",
                "Message Broadcasting",
            ],
            IMAGE: TodoImage,
        },
    },

    BLOGS: {
        "ORMs & ODMs: Choosing the Right Tool for Your Database Needs": {
            DATE: "March 24, 2025",
            TIME: "4",
            LINK: "https://www.linkedin.com/pulse/orms-odms-choosing-right-tool-your-database-needs-utkarsh-singhal-dnshc/",
            DESCRIPTION:
                "Object-Relational Mappers (ORMs) and Object-Document Mappers (ODMs) play a crucial role in modern application development by abstracting database interactions and simplifying data management. Whether you're working with relational databases like PostgreSQL and MySQL or NoSQL databases like MongoDB, selecting the right ORM or ODM can significantly impact performance, scalability, and maintainability.",
            IMAGE: OrmsOdmsImage,
        },
        "Mastering TypeScript Generics: Building Flexible and Scalable Code": {
            DATE: "March 8, 2025",
            TIME: "7",
            LINK: "https://www.linkedin.com/pulse/mastering-typescript-generics-building-flexible-scalable-singhal-f77bc/",
            DESCRIPTION:
                "When building robust and scalable applications in TypeScript, flexibility and reusability are key. One of the most powerful features that helps achieve this is Generics. Generics allow developers to create functions, classes, and interfaces that can work with any data type, ensuring that the code is more flexible, reusable, and easier to maintain.",
            IMAGE: TsGenericsImage,
        },
        "TypeScript and React: Harnessing the Full Power of Types": {
            DATE: "March 11, 2025",
            TIME: "6",
            LINK: "https://www.linkedin.com/pulse/typescript-react-harnessing-full-power-types-utkarsh-singhal-6bxuc/",
            DESCRIPTION:
                "React has become the go-to library for building dynamic user interfaces, and TypeScript has emerged as a powerful tool for adding static types to JavaScript applications. While many developers use TypeScript with React, they often only scratch the surface of its capabilities.",
            IMAGE: TsReactImage,
        },
        "Understanding Utility Types in TypeScript: Supercharging Your Codebase":
            {
                DATE: "March 10, 2025",
                TIME: "7",
                LINK: "https://www.linkedin.com/pulse/understanding-utility-types-typescript-supercharging-your-singhal-zdxwc/",
                DESCRIPTION:
                    "TypeScript is renowned for its ability to enhance JavaScript applications by adding static typing. However, when working with complex types, developers often find themselves repeating type definitions or restructuring types to fit different contexts. This is where Utility Types in TypeScript come to the rescue.",
                IMAGE: UtilityTypesImage,
            },
    },
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
