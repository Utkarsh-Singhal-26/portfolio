import { json, skills } from "@/lib/agent/api";

export const dynamic = "force-static";

export const GET = () => json(skills());
