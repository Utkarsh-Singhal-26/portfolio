import { SITE } from "@/content/data";
import {
    generateOgImage,
    OG_IMAGE_CONTENT_TYPE,
    OG_IMAGE_SIZE,
} from "@/lib/og/generate";

export const alt = SITE.ogAlt;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const runtime = "nodejs";

export default async function OpenGraphImage() {
    return generateOgImage();
}
