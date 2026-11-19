import { DATA, GITHUB_USERNAME, SITE_URL } from "../../../content/data";

// RFC 9116 requires an Expires date. Regenerated daily so it always sits
// about 11 months ahead and never goes stale while the site is up.
export const revalidate = 86400;

const REPO = `https://github.com/${GITHUB_USERNAME}/portfolio`;

export function GET() {
    const expires = new Date();
    expires.setUTCMonth(expires.getUTCMonth() + 11);

    const body = `Contact: mailto:${DATA.header.email}
Contact: ${REPO}/security/advisories/new
Expires: ${expires.toISOString()}
Preferred-Languages: en
Canonical: ${SITE_URL}/.well-known/security.txt
Policy: ${REPO}/blob/main/.github/SECURITY.md
`;

    return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
