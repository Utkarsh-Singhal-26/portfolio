import type { MetadataRoute } from "next";

import { SITE_URL } from "@/content/data";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${SITE_URL}/`,
            changeFrequency: "weekly",
            priority: 1.0,
        },
    ];
}
