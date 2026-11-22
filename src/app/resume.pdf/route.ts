import { DATA } from "@/content/data";

const FILE_NAME = `${DATA.header.name.replace(/ /g, "_")}.pdf`;

// The Drive link on the site is the viewer page; the download URL needs the file id.
const driveId = DATA.header.resume.match(/\/d\/([^/]+)/)?.[1];

export async function GET(request: Request) {
    const download = new URL(request.url).searchParams.has("download");

    if (driveId) {
        try {
            const res = await fetch(
                `https://drive.google.com/uc?export=download&id=${driveId}`,
                {
                    next: { revalidate: 86400 },
                    signal: AbortSignal.timeout(10000),
                }
            );
            const bytes = await res.arrayBuffer();
            // Drive answers an HTML page, not a PDF, when the file isn't shared.
            if (
                res.ok &&
                new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-"
            ) {
                return new Response(bytes, {
                    headers: {
                        "Content-Type": "application/pdf",
                        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${FILE_NAME}"`,
                        "Cache-Control":
                            "public, s-maxage=86400, stale-while-revalidate=604800",
                    },
                });
            }
        } catch {}
    }

    return Response.redirect(DATA.header.resume, 302);
}
