import { ImageResponse } from "next/og";
import sharp from "sharp";

import { SITE } from "@/content/data";
import { DISPLAY_SIZE, OgCard, SIZE } from "@/lib/og/card";
import { loadOgFonts } from "@/lib/og/fonts";

export const OG_IMAGE_SIZE = DISPLAY_SIZE;
export const OG_IMAGE_CONTENT_TYPE = "image/jpeg";
export const OG_IMAGE_ALT = SITE.ogAlt;

export async function generateOgImage() {
    const png = new ImageResponse(<OgCard />, {
        ...SIZE,
        fonts: await loadOgFonts(),
    });

    const pngBuffer = Buffer.from(await png.arrayBuffer());
    // Drawn at 2x, then downsampled to the size the meta tags declare.
    const jpegBuffer = await sharp(pngBuffer)
        .resize(OG_IMAGE_SIZE.width, OG_IMAGE_SIZE.height)
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
