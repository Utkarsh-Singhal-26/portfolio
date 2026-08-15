import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function loadOgFonts() {
    const dir = join(process.cwd(), "src/app/og/fonts");
    const [outfitRegular, outfitSemiBold, geistMono] = await Promise.all([
        readFile(join(dir, "outfit-latin-400-normal.woff")),
        readFile(join(dir, "outfit-latin-600-normal.woff")),
        readFile(join(dir, "geist-mono-latin-400-normal.woff")),
    ]);

    return [
        {
            name: "Outfit",
            data: outfitRegular,
            weight: 400 as const,
            style: "normal" as const,
        },
        {
            name: "Outfit",
            data: outfitSemiBold,
            weight: 600 as const,
            style: "normal" as const,
        },
        {
            name: "Geist Mono",
            data: geistMono,
            weight: 400 as const,
            style: "normal" as const,
        },
    ];
}
