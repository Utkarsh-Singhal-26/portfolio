import type { MetadataRoute } from "next";

import { SITE_URL } from "@/content/data";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${SITE_URL}/`,
            lastModified: new Date(process.env.BUILD_DATE ?? Date.now()),
        },
    ];
}
