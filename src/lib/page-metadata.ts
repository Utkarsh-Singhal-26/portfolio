import type { Metadata } from "next";

import { DATA, SITE_URL } from "@/content/data";

// Next does not merge openGraph/twitter from the layout, so pages restate them.
export function pageMetadata({
    title,
    description,
    path,
}: {
    title: string;
    description: string;
    path: string;
}): Metadata {
    const url = `${SITE_URL}${path}`;
    return {
        title,
        description,
        alternates: {
            canonical: url,
            types: { "text/markdown": `${path}.md` },
        },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            locale: "en_US",
            siteName: DATA.header.name,
        },
        twitter: { card: "summary_large_image", title, description },
    };
}
