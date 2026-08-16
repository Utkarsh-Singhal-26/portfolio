import type { MetadataRoute } from "next";

const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://utkarsh-singhal.is-a.dev";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${baseUrl}/`,
            changeFrequency: "weekly",
            priority: 1.0,
        },
    ];
}
