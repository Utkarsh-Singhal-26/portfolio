import { json } from "../../../lib/agent/api";
import { aiCatalog } from "../../../lib/agent/openapi";

export const dynamic = "force-static";

export const GET = () => json(aiCatalog());
