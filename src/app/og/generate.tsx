import { ImageResponse } from "next/og";
import sharp from "sharp";

import { SITE } from "@/app/data";
import { DISPLAY_SIZE, OgCard, SIZE } from "@/app/og/card";
import { loadOgFonts } from "@/app/og/fonts";
import { contributionWeeks, emptyWeeks } from "@/app/og/weeks";
import { getGitHubContributions } from "@/lib/github-contribution";

export const OG_IMAGE_SIZE = DISPLAY_SIZE;
export const OG_IMAGE_CONTENT_TYPE = "image/jpeg";
export const OG_IMAGE_ALT = SITE.ogAlt;
export const OG_IMAGE_RUNTIME = "nodejs" as const;

export async function generateOgImage() {
    const [fonts, weeks] = await Promise.all([
        loadOgFonts(),
        getGitHubContributions()
            .then((days) => contributionWeeks(days, 52))
            .catch(() => emptyWeeks(52)),
    ]);

    const png = new ImageResponse(<OgCard weeks={weeks} />, {
        ...SIZE,
        fonts,
    });

    const pngBuffer = Buffer.from(await png.arrayBuffer());
    const jpegBuffer = await sharp(pngBuffer)
        .jpeg({
            quality: 92,
            mozjpeg: true,
            chromaSubsampling: "4:4:4",
        })
        .toBuffer();

    return new Response(new Uint8Array(jpegBuffer), {
        headers: {
            "Content-Type": OG_IMAGE_CONTENT_TYPE,
            "Cache-Control":
                "public, max-age=86400, stale-while-revalidate=604800",
        },
    });
}
