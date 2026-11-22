import { SITE_URL } from "../../../content/data";

export const revalidate = 86400;

// RFC 9727.
export function GET() {
    const body = {
        linkset: [
            {
                anchor: `${SITE_URL}/api/v1`,
                "service-desc": [
                    {
                        href: `${SITE_URL}/openapi.json`,
                        type: "application/vnd.oai.openapi+json",
                    },
                ],
                "service-doc": [
                    { href: `${SITE_URL}/auth.md`, type: "text/markdown" },
                ],
            },
        ],
    };

    return new Response(JSON.stringify(body, null, 2), {
        headers: {
            "Content-Type":
                'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
        },
    });
}
