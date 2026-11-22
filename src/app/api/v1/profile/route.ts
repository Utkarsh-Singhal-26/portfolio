import { json, profile } from "@/lib/agent/api";

export const dynamic = "force-static";

export const GET = () => json(profile());
