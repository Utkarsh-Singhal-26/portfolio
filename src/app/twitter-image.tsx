import {
    generateOgImage,
    OG_IMAGE_ALT,
    OG_IMAGE_CONTENT_TYPE,
    OG_IMAGE_RUNTIME,
    OG_IMAGE_SIZE,
} from "@/app/og/generate";

export const alt = OG_IMAGE_ALT;
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;
export const runtime = OG_IMAGE_RUNTIME;

export default async function TwitterImage() {
    return generateOgImage();
}
