type Endpoint = {
    group: "Read" | "Build" | "Discover";
    path: string;
    summary: string;
    type: string;
};

/** Single source for the API index, the OpenAPI spec and the Developers section. */
export const ENDPOINTS: Endpoint[] = [
    {
        group: "Read",
        path: "/llms.txt",
        summary: "Everything about me, in plain text",
        type: "text/plain",
    },
    {
        group: "Read",
        path: "/llms-full.txt",
        summary: "The same, with every role and project in detail",
        type: "text/plain",
    },
    {
        group: "Read",
        path: "/index.md",
        summary: "The home page as Markdown",
        type: "text/markdown",
    },
    {
        group: "Read",
        path: "/developers.md",
        summary: "This API reference as Markdown",
        type: "text/markdown",
    },
    {
        group: "Read",
        path: "/api/v1/profile",
        summary: "Profile, links and contact",
        type: "application/json",
    },
    {
        group: "Read",
        path: "/api/v1/experience",
        summary: "Work history",
        type: "application/json",
    },
    {
        group: "Build",
        path: "/api/v1/projects",
        summary: "Projects: ?type=own or ?type=contribution",
        type: "application/json",
    },
    {
        group: "Build",
        path: "/api/v1/skills",
        summary: "Skills by discipline",
        type: "application/json",
    },
    {
        group: "Discover",
        path: "/openapi.json",
        summary: "OpenAPI 3.1 description",
        type: "application/json",
    },
    {
        group: "Discover",
        path: "/.well-known/ai-catalog.json",
        summary: "AI catalog",
        type: "application/json",
    },
    {
        group: "Discover",
        path: "/.well-known/api-catalog",
        summary: "API catalog, RFC 9727",
        type: "application/linkset+json",
    },
    {
        group: "Discover",
        path: "/sitemap.xml",
        summary: "Every canonical URL",
        type: "application/xml",
    },
];
