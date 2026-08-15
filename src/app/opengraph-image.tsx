import { SITE } from "@/app/data";
import { generateOgImage } from "@/app/og/generate";

export const alt = SITE.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function OpenGraphImage() {
    return generateOgImage();
}
