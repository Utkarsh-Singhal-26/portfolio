import type { MetadataRoute } from "next";

const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://utkarsh-singhal.is-a.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
    ];
}
