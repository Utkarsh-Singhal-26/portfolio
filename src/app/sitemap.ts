import type { MetadataRoute } from "next";

import { SITE_URL } from "@/content/data";

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date(process.env.BUILD_DATE ?? Date.now());
    return [
        {
            url: `${SITE_URL}/`,
            lastModified,
        },
        {
            url: `${SITE_URL}/developers`,
            lastModified,
        },
        {
            url: `${SITE_URL}/activity`,
            lastModified,
        },
        {
            url: `${SITE_URL}/privacy`,
            lastModified,
        },
    ];
}
