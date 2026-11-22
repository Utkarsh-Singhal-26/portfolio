import {
    CHIPS,
    DATA,
    getAge,
    LOCATION,
    SITE,
    SITE_URL,
    SKILL_GROUPS,
} from "@/content/data";

export const profile = () => ({
    name: DATA.header.name,
    pronouns: DATA.header.pronoun,
    age: getAge(),
    headline: DATA.header.headline,
    description: SITE.description,
    location: {
        name: LOCATION.name,
        latitude: LOCATION.latitude,
        longitude: LOCATION.longitude,
        timezone: LOCATION.timezone,
    },
    current: {
        title: DATA.experience[0].roles[0].title,
        company: DATA.experience[0].name,
        website: DATA.experience[0].website,
    },
    links: {
        site: SITE_URL,
        github: DATA.header.github,
        linkedin: DATA.header.linkedin,
        resume: DATA.header.resume,
        email: DATA.header.email,
    },
});

export const experience = () =>
    DATA.experience.map((company) => ({
        company: company.name,
        website: company.website,
        location: company.location,
        current: company.current ?? false,
        roles: company.roles.map((role) => ({
            title: role.title,
            type: role.type,
            start: role.start,
            end: role.end ?? null,
            description: role.description,
            stack: role.stack,
        })),
    }));

export type ProjectType = "own" | "contribution";

export const projects = (type?: ProjectType) =>
    DATA.projects
        .filter(
            (project) =>
                !type || (type === "contribution") === !!project.contribution
        )
        .map((project) => ({
            name: project.name,
            type: project.contribution ? "contribution" : "own",
            url: project.href,
            source: project.github ?? null,
            summary: project.summary,
            stack: project.stack,
        }));

export const skills = () => {
    const groups = new Map<string, string[]>();
    for (const { label } of CHIPS) {
        const name =
            Object.entries(SKILL_GROUPS).find(([, labels]) =>
                labels.includes(label)
            )?.[0] ?? "Other";
        groups.set(name, [...(groups.get(name) ?? []), label]);
    }
    return [...groups].map(([discipline, items]) => ({ discipline, items }));
};

/** JSON with open CORS and a day of CDN caching: the data only changes on deploy. */
export const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body, null, 2), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control":
                "public, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
