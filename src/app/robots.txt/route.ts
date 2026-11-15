import { SITE_URL } from "@/content/data";

// Not robots.ts: Next's MetadataRoute.Robots cannot emit Content-Signal.
// Policy: allow search, AI answers (ai-input) and AI training. Flip a value to "no" to opt out.
const body = `User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

export function GET() {
    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
