import { json } from "@/lib/agent/api";
import { openapi } from "@/lib/agent/openapi";

export const dynamic = "force-static";

export const GET = () => json(openapi());
