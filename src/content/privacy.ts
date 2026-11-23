export const PRIVACY_SECTIONS = [
    ["who", "Who I am and scope"],
    ["collect", "What I collect and why"],
    ["device", "Stored on your device"],
    ["analytics", "Analytics (only if you accept)"],
    ["always-on", "Always on, no consent needed"],
    ["email", "If you email me"],
    ["recipients", "Who receives data"],
    ["transfers", "International transfers"],
    ["retention", "How long it is kept"],
    ["security", "Security"],
    ["rights", "Your rights and choices"],
    ["optional", "Optional data, no automation"],
    ["children", "Children"],
    ["changes", "Changes to this policy"],
    ["contact", "Contact and complaints"],
] as const;

export const PRIVACY_SUMMARY = [
    "This is a personal portfolio. I collect as little as I can and never sell data.",
    "Analytics (PostHog, Microsoft Clarity) stays off until you accept.",
    "Hosting and a visitor counter run for everyone, with no cookies and no profile of you.",
    "You can change your choice any time and ask me to act on your data.",
] as const;
