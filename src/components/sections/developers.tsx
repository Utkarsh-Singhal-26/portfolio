import {
    ResponseViewer,
    type Token,
    type ViewerTab,
} from "@/components/features/response-viewer";
import { CornerMarks } from "@/components/ui/blueprint";
import { Reveal } from "@/components/ui/reveal";
import { ENDPOINTS } from "@/content/api";
import { experience, profile, projects, skills } from "@/lib/agent/api";
import { homeMarkdown } from "@/lib/agent/markdown";

const JSON_TOKEN = /("(?:[^"\\]|\\.)*"\s*:?|-?\d+(?:\.\d+)?|true|false|null)/g;

function jsonLine(line: string): Token[] {
    return line
        .split(JSON_TOKEN)
        .filter(Boolean)
        .map((text): Token => {
            if (/^"/.test(text))
                return { text, kind: text.endsWith(":") ? "key" : "str" };
            if (/^(-?\d|true$|false$|null$)/.test(text))
                return { text, kind: "lit" };
            return { text, kind: "plain" };
        });
}

const textLine = (line: string): Token[] => [
    { text: line, kind: /^#/.test(line) ? "head" : "plain" },
];

function tab(
    label: string,
    path: string,
    type: string,
    siteUrl: string,
    body: string,
    json: boolean
): ViewerTab {
    return {
        label,
        path,
        type,
        curl: `curl ${siteUrl}${path}`,
        body,
        bytes: new TextEncoder().encode(body).length,
        lines: body.split("\n").map(json ? jsonLine : textLine),
    };
}

const pretty = (value: unknown) => JSON.stringify(value, null, 2);

export function Developers({ siteUrl }: { siteUrl: string }) {
    const tabs = [
        tab(
            "/llms.txt",
            "/llms.txt",
            "text/plain",
            siteUrl,
            homeMarkdown(),
            false
        ),
        tab(
            "/profile",
            "/api/v1/profile",
            "application/json",
            siteUrl,
            pretty(profile()),
            true
        ),
        tab(
            "/experience",
            "/api/v1/experience",
            "application/json",
            siteUrl,
            pretty(experience()),
            true
        ),
        tab(
            "/projects",
            "/api/v1/projects",
            "application/json",
            siteUrl,
            pretty(projects()),
            true
        ),
        tab(
            "/skills",
            "/api/v1/skills",
            "application/json",
            siteUrl,
            pretty(skills()),
            true
        ),
    ];

    const also = ENDPOINTS.filter(
        (e) => !tabs.some((tab) => tab.path === e.path)
    );

    return (
        <section id="developers" className="w-full scroll-mt-24 cell">
            <Reveal>
                <div className="flex md:flex-row flex-col md:justify-between md:items-end gap-6">
                    <div>
                        <h2 className="font-semibold text-2xl md:text-3xl tracking-tight">
                            developers.
                        </h2>
                        <p className="mt-3 max-w-[48ch] text-muted-foreground text-base leading-relaxed">
                            This site answers in plain text, Markdown and JSON.
                            No keys, no sign-up. Pick an endpoint to see what
                            comes back.
                        </p>
                    </div>
                    <div className="flex gap-5 font-mono text-[12px] uppercase tracking-[0.18em]">
                        <a
                            href="/openapi.json"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-brand underline underline-offset-4"
                        >
                            OpenAPI ↗
                        </a>
                        <a
                            href="/api/v1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-brand underline underline-offset-4"
                        >
                            API index ↗
                        </a>
                    </div>
                </div>

                <div className="relative mt-8">
                    <CornerMarks />
                    <ResponseViewer tabs={tabs} />
                </div>

                <p className="mt-5 font-mono text-[12px] text-muted-foreground leading-loose">
                    <span className="uppercase tracking-[0.22em]">Also </span>
                    {also.map((e, i) => (
                        <span key={e.path}>
                            {i > 0 ? " · " : ""}
                            <a
                                href={e.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground underline-offset-4 hover:underline"
                            >
                                {e.path}
                            </a>
                        </span>
                    ))}
                </p>
            </Reveal>
        </section>
    );
}
