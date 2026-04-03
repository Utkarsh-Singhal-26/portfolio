import type { MetadataRoute } from "next";

const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://utkarsh-singhal.is-a.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoute: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
    ];

    return [...staticRoute];
}
