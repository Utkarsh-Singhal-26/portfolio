import posthog from "posthog-js";

// Single source of truth for product events: snake_case `object_action` names
// and a typed property schema, so a typo fails the build instead of splitting a
// funnel. No personal data: hosts and paths only, never emails or full URLs
// with query strings. Components call these helpers, never posthog directly,
// so the vendor stays swappable.
type Via = "link" | "command_menu";

type Events = {
    resume_clicked: { download: boolean; via: Via };
    contact_clicked: { via: Via };
    outbound_clicked: { host: string; url: string; via: Via };
    command_menu_opened: Record<string, never>;
    theme_changed: { theme: "light" | "dark" };
    accent_changed: { accent: string };
    view_changed: { view: "human" | "agent" };
    copy_clicked: { label: string };
};

export function track<E extends keyof Events>(event: E, props: Events[E]) {
    // Analytics must never break the page. capture() is a no-op until the
    // visitor accepts, so no consent check is needed here.
    try {
        if (posthog.__loaded) posthog.capture(event, props);
    } catch {}
}

/** Classify a clicked or opened URL into the right event, if it has one. */
export function trackHref(href: string, via: Via) {
    let url: URL;
    try {
        url = new URL(href, location.href);
    } catch {
        return;
    }
    if (url.pathname === "/resume.pdf")
        track("resume_clicked", {
            download: url.searchParams.has("download"),
            via,
        });
    else if (url.protocol === "mailto:") track("contact_clicked", { via });
    else if (url.origin !== location.origin && url.protocol.startsWith("http"))
        track("outbound_clicked", {
            host: url.host,
            url: url.origin + url.pathname,
            via,
        });
}
