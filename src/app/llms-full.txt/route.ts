import { fullMarkdown } from "@/lib/agent/markdown";

export const revalidate = 86400;

export function GET() {
    return new Response(fullMarkdown(), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
}
