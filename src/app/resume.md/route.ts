import { markdownResponse, resumeMarkdown } from "@/lib/agent/markdown";

export const revalidate = 86400;

export const GET = () => markdownResponse(resumeMarkdown());
