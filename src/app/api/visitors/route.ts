import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const KEY = "portfolio:visitors"; // namespaced: the DB may be shared with other apps
// Vercel's Upstash integration names these KV_REST_API_*.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

// Upstash Redis over REST in production. Without it, a local file so dev and
// `next start` work; on read-only hosts the write throws and the UI hides.
async function redis(cmd: "incr" | "get") {
    const res = await fetch(`${url}/${cmd}/${KEY}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    const { result } = (await res.json()) as { result: string | number | null };
    return Number(result ?? 0);
}

const file = path.join(process.cwd(), ".next", "visitors.json");
async function local(cmd: "incr" | "get") {
    let n = 0;
    try {
        n = Number(await readFile(file, "utf8")) || 0;
    } catch {}
    if (cmd === "incr") {
        n += 1;
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, String(n));
    }
    return n;
}

async function count(cmd: "incr" | "get") {
    try {
        const count = await (url && token ? redis(cmd) : local(cmd));
        return Response.json(
            { count },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch {
        return Response.json({ count: null });
    }
}

// POST = new visitor (client sends it once per browser), GET = just read.
export const GET = () => count("get");
export const POST = () => count("incr");
