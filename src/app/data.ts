import { StaticImageData } from "next/image";

import {
  AirwatchImage,
  LibraryImage,
  SkygazeImage,
  TodoImage,
  VIPSImage,
  VueBitsImage,
} from "@/assets";

export interface IProjectData {
  LIVE_PREVIEW?: string;
  GITHUB?: string;
  DESCRIPTION: string[];
  NOTE?: string;
  TECH_STACK: string[];
  IMAGE: StaticImageData;
}

export const DATA = {
  HEADER: {
    NAME: "Utkarsh Singhal",
    AGE: "20",
    PRONOUN: "he/him",
    HEADLINE:
      "Passionate about building high-performance and scalable web applications.",
    RESUME:
      "https://drive.google.com/file/d/1piWpArbdbjt4PKF4gZlR0nkD09au_8fE/view",
    EMAIL: "mailto:singhalutkarsh26@gmail.com",
    GITHUB: "https://github.com/Utkarsh-Singhal-26",
    LINKEDIN: "https://www.linkedin.com/in/singhalutkarsh26",
  },

  ABOUT_ME: {
    INTRO:
      "Hey! I'm a full-stack developer who loves building efficient, scalable, and intuitive applications. I thrive on solving complex problems, optimizing performance, and creating seamless user experiences.",
    EXPERTISE:
      "My expertise lies in Next.js, TypeScript, Node.js, and Cloud technologies, and I enjoy working across the stack to bring ideas to life.",
  },

  EXPERIENCE: {
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
    },
    "Mastering TypeScript Generics: Building Flexible and Scalable Code": {
      DATE: "March 8, 2025",
      TIME: "7",
      LINK: "https://www.linkedin.com/pulse/mastering-typescript-generics-building-flexible-scalable-singhal-f77bc/",
      DESCRIPTION:
        "When building robust and scalable applications in TypeScript, flexibility and reusability are key. One of the most powerful features that helps achieve this is Generics. Generics allow developers to create functions, classes, and interfaces that can work with any data type, ensuring that the code is more flexible, reusable, and easier to maintain.",
    },
    "TypeScript and React: Harnessing the Full Power of Types": {
      DATE: "March 11, 2025",
      TIME: "6",
      LINK: "https://www.linkedin.com/pulse/typescript-react-harnessing-full-power-types-utkarsh-singhal-6bxuc/",
      DESCRIPTION:
        "React has become the go-to library for building dynamic user interfaces, and TypeScript has emerged as a powerful tool for adding static types to JavaScript applications. While many developers use TypeScript with React, they often only scratch the surface of its capabilities.",
    },
    "Understanding Utility Types in TypeScript: Supercharging Your Codebase": {
      DATE: "March 10, 2025",
      TIME: "7",
      LINK: "https://www.linkedin.com/pulse/understanding-utility-types-typescript-supercharging-your-singhal-zdxwc/",
      DESCRIPTION:
        "TypeScript is renowned for its ability to enhance JavaScript applications by adding static typing. However, when working with complex types, developers often find themselves repeating type definitions or restructuring types to fit different contexts. This is where Utility Types in TypeScript come to the rescue.",
    },
  },

  SKILLS: {
    Languages: ["JavaScript", "TypeScript", "HTML", "CSS", "Node.js"],
    Frameworks: [
      "React.js",
      "Next.js",
      "Vue.js",
      "Astro",
      "Express.js",
      "React Native",
      "Expo",
      "Electron",
      "PWA",
    ],
    Libraries: [
      "React Query",
      "Tailwind CSS",
      "ShadCN UI",
      "Ant Design",
      "Styled Components",
      "Material UI",
    ],
    "Database & Backend": [
      "MongoDB",
      "Redis",
      "Contentful",
      "Firebase",
      "GraphQL",
      "JWT",
      "Auth.js",
      "Clerk",
    ],
    "Cloud & Deployment": [
      "Google Cloud Platform (GCP)",
      "Amazon Web Services (AWS)",
      "Vercel",
    ],
    "Tools & Platforms": [
      "Git",
      "GitHub",
      "Postman",
      "Docker",
      "Visual Studio Code",
      "Prettier",
      "Sentry",
    ],
    "Package Managers & Build Tools": ["NPM", "PNPM", "Yarn", "Bun", "Vite"],
  },
};
