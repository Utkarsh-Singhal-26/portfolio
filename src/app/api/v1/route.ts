import { ENDPOINTS } from "@/content/api";
import { DATA, SITE_URL } from "@/content/data";
import { json } from "@/lib/agent/api";

export const dynamic = "force-static";

export const GET = () =>
    json({
        name: `${DATA.header.name} site API`,
        version: "v1",
        auth: "none",
        spec: `${SITE_URL}/openapi.json`,
        endpoints: ENDPOINTS.map(({ path, summary, type }) => ({
            url: `${SITE_URL}${path}`,
            summary,
            type,
        })),
    });
