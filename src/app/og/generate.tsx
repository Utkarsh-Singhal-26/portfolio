import { ImageResponse } from "next/og";

import { OgCard, SIZE } from "@/app/og/card";
import { loadOgFonts } from "@/app/og/fonts";
import { contributionWeeks, emptyWeeks } from "@/app/og/weeks";
import { getGitHubContributions } from "@/lib/github-contribution";

export async function generateOgImage() {
    const [fonts, weeks] = await Promise.all([
        loadOgFonts(),
        getGitHubContributions()
            .then((days) => contributionWeeks(days, 52))
            .catch(() => emptyWeeks(52)),
    ]);

    return new ImageResponse(<OgCard weeks={weeks} />, {
        ...SIZE,
        fonts,
    });
}
