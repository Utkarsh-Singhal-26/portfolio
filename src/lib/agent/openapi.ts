import { ENDPOINTS } from "@/content/api";
import { DATA, SITE_URL } from "@/content/data";

const str = { type: "string" } as const;
const strList = { type: "array", items: str } as const;

const SCHEMAS = {
    Profile: {
        type: "object",
        properties: {
            name: str,
            pronouns: str,
            age: { type: "integer" },
            headline: str,
            description: str,
            location: {
                type: "object",
                properties: {
                    name: str,
                    latitude: { type: "number" },
                    longitude: { type: "number" },
                    timezone: str,
                },
            },
            current: {
                type: "object",
                properties: { title: str, company: str, website: str },
            },
            links: {
                type: "object",
                properties: {
                    site: str,
                    github: str,
                    linkedin: str,
                    resume: str,
                    email: str,
                },
            },
        },
    },
    Company: {
        type: "object",
        properties: {
            company: str,
            website: str,
            location: str,
            current: { type: "boolean" },
            roles: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        title: str,
                        type: str,
                        start: { type: "string", description: "yyyy-MM" },
                        end: {
                            type: ["string", "null"],
                            description: "yyyy-MM, null when current",
                        },
                        description: strList,
                        stack: strList,
                    },
                },
            },
        },
    },
    Project: {
        type: "object",
        properties: {
            name: str,
            type: { type: "string", enum: ["own", "contribution"] },
            url: str,
            source: { type: ["string", "null"] },
            summary: str,
            stack: strList,
        },
    },
    SkillGroup: {
        type: "object",
        properties: { discipline: str, items: strList },
    },
} as const;

const ref = (name: keyof typeof SCHEMAS) =>
    ({ $ref: `#/components/schemas/${name}` }) as const;

const RESPONSE: Record<string, object> = {
    "/api/v1/profile": ref("Profile"),
    "/api/v1/experience": { type: "array", items: ref("Company") },
    "/api/v1/projects": { type: "array", items: ref("Project") },
    "/api/v1/skills": { type: "array", items: ref("SkillGroup") },
};

export function openapi() {
    const paths = Object.fromEntries(
        ENDPOINTS.filter((e) => e.path !== "/sitemap.xml").map((e) => [
            e.path,
            {
                get: {
                    summary: e.summary,
                    operationId: e.path
                        .replace(/^\/|\.\w+$/g, "")
                        .replace(/^\W+/, "")
                        .replace(/[^a-zA-Z0-9]+(.)?/g, (_, c: string) =>
                            c ? c.toUpperCase() : ""
                        ),
                    ...(e.path === "/api/v1/projects"
                        ? {
                              parameters: [
                                  {
                                      name: "type",
                                      in: "query",
                                      required: false,
                                      schema: {
                                          type: "string",
                                          enum: ["own", "contribution"],
                                      },
                                      description:
                                          "Only projects I built (own) or ones I contribute to (contribution).",
                                  },
                              ],
                          }
                        : {}),
                    responses: {
                        "200": {
                            description: "OK",
                            content: {
                                [e.type]: {
                                    schema: RESPONSE[e.path] ?? str,
                                },
                            },
                        },
                        ...(e.path === "/api/v1/projects"
                            ? { "400": { description: "Unknown type value" } }
                            : {}),
                    },
                },
            },
        ])
    );

    return {
        openapi: "3.1.0",
        info: {
            title: `${DATA.header.name} site API`,
            version: "1.0.0",
            description:
                "Read-only, public data about this portfolio. No keys, no sign-up.",
            contact: { email: DATA.header.email, url: SITE_URL },
        },
        servers: [{ url: SITE_URL }],
        security: [],
        paths,
        components: { schemas: SCHEMAS },
    };
}

export function aiCatalog() {
    const host = new URL(SITE_URL).hostname;
    const urn = (kind: string, name: string) =>
        `urn:ai:${host}:${kind}:${name}`;

    const docs = [
        {
            identifier: urn("doc", "auth"),
            displayName: "Authentication",
            type: "text/markdown",
            url: `${SITE_URL}/auth.md`,
            description:
                "No credentials are needed; everything is public and read-only.",
        },
        {
            identifier: urn("doc", "privacy"),
            displayName: "Privacy summary",
            type: "text/markdown",
            url: `${SITE_URL}/privacy.md`,
            description: "What this site collects, in Markdown.",
        },
    ];

    return {
        specVersion: "1.0",
        host: { displayName: DATA.header.name, identifier: host },
        entries: [
            ...ENDPOINTS.filter(
                (e) => e.path !== "/.well-known/ai-catalog.json"
            ).map((e) => ({
                identifier: urn(
                    e.path.startsWith("/api/") ? "api" : "doc",
                    e.path.replace(
                        /^\/(api\/v1\/|\.well-known\/)?|\.\w+$/g,
                        ""
                    ) || "root"
                ),
                displayName: e.summary,
                type: e.type,
                url: `${SITE_URL}${e.path}`,
                description: e.summary,
            })),
            ...docs,
        ],
    };
}
