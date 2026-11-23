import type { Logger } from "@opentelemetry/api-logs";
import type { LoggerProvider } from "@opentelemetry/sdk-logs";

// Server-side logs to PostHog via OpenTelemetry. Production only, and only when
// the project key is set. Not tied to the consent banner: log nothing personal.
let logger: Logger | undefined;
let loggerProvider: LoggerProvider | undefined;

export async function register() {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (
        process.env.NEXT_RUNTIME !== "nodejs" ||
        !process.env.VERCEL_ENV ||
        !key
    )
        return;

    const [{ OTLPLogExporter }, { resourceFromAttributes }, sdk] =
        await Promise.all([
            import("@opentelemetry/exporter-logs-otlp-http"),
            import("@opentelemetry/resources"),
            import("@opentelemetry/sdk-logs"),
        ]);
    const provider = new sdk.LoggerProvider({
        resource: resourceFromAttributes({ "service.name": "portfolio" }),
        processors: [
            // Simple, not batch: serverless can freeze before a batch flushes.
            new sdk.SimpleLogRecordProcessor({
                exporter: new OTLPLogExporter({
                    url: "https://us.i.posthog.com/i/v1/logs",
                    headers: { Authorization: `Bearer ${key}` },
                }),
            }),
        ],
    });
    loggerProvider = provider;
    logger = provider.getLogger("portfolio");
}

// Next calls this for every unhandled server error (render, route handler, action).
export async function onRequestError(
    err: unknown,
    request: { path: string; method: string }
) {
    logger?.emit({
        severityText: "ERROR",
        body: err instanceof Error ? err.message : String(err),
        attributes: { path: request.path, method: request.method },
    });
    // Awaited so a serverless function is not frozen before the log is sent.
    await loggerProvider?.forceFlush();
}
