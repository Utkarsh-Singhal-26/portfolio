import { json, type ProjectType, projects } from "@/lib/agent/api";

const TYPES: readonly string[] = ["own", "contribution"];

// Reads the query string, so this one renders per request.
export function GET(request: Request) {
    const type = new URL(request.url).searchParams.get("type");
    if (type && !TYPES.includes(type)) {
        return json(
            { error: "type must be 'own' or 'contribution'", received: type },
            400
        );
    }
    return json(projects((type as ProjectType | null) ?? undefined));
}
