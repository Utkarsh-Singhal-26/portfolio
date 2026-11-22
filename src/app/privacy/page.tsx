import type { Metadata } from "next";
import type { ReactNode } from "react";

import { FloatingMascot } from "@/components/features/floating-mascot";
import { PrivacyLink } from "@/components/features/privacy-link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Stripe } from "@/components/ui/blueprint";
import { DATA, SITE_URL } from "@/content/data";
import {
    PRIVACY_SECTIONS as SECTIONS,
    PRIVACY_SUMMARY,
} from "@/content/privacy";
import {
    ANALYTICS_STORAGE,
    ESSENTIAL_STORAGE,
    POLICY_UPDATED,
    type StorageItem,
} from "@/content/storage";
import { CONSENT_ENABLED } from "@/lib/consent-enabled";

export const metadata: Metadata = {
    title: "Privacy & cookies",
    description: `What ${DATA.header.name}'s portfolio stores, what it measures, who receives data, and how to change your choice.`,
    alternates: {
        canonical: `${SITE_URL}/privacy`,
        types: { "text/markdown": "/privacy.md" },
    },
};

const LINK = "underline underline-offset-4 hover:text-foreground";
const P =
    "text-muted-foreground text-[15px] leading-relaxed text-justify hyphens-none";
const B = "font-medium text-foreground";

function Section({
    id,
    title,
    children,
}: {
    id: (typeof SECTIONS)[number][0];
    title: string;
    children: ReactNode;
}) {
    const n = String(SECTIONS.findIndex(([key]) => key === id) + 1).padStart(
        2,
        "0"
    );
    return (
        <section
            id={id}
            className="gap-x-8 gap-y-3 grid md:grid-cols-[15rem_minmax(0,1fr)] py-8 border-line border-t scroll-mt-20"
        >
            <div>
                <p className="font-mono text-[11px] text-muted-foreground tracking-[0.22em]">
                    {n}
                </p>
                <h2 className="mt-1 font-semibold text-foreground text-lg text-balance tracking-tight">
                    {title}
                </h2>
            </div>
            <div className="space-y-3">{children}</div>
        </section>
    );
}

/** Generic mono table: header row plus rows of equal-length cells. */
function Grid({
    head,
    rows,
    cols,
}: {
    head: string[];
    rows: ReactNode[][];
    cols: string;
}) {
    const row = `gap-3 grid px-3 py-2 ${cols}`;
    return (
        <div className="border border-line overflow-x-auto font-mono text-[12px]">
            <div className="divide-y divide-line min-w-136">
                <div className={`${row} py-1.5 text-muted-foreground`}>
                    {head.map((h) => (
                        <span key={h}>{h}</span>
                    ))}
                </div>
                {rows.map((cells, i) => (
                    <div key={i} className={row}>
                        {cells.map((cell, j) => (
                            <span
                                key={j}
                                className={
                                    j === 0
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                }
                            >
                                {cell}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function StorageTable({ rows }: { rows: StorageItem[] }) {
    return (
        <Grid
            cols="grid-cols-[1.2fr_0.8fr_1.4fr_0.9fr]"
            head={["KEY", "SET BY", "PURPOSE", "LASTS"]}
            rows={rows.map(({ key, by, why, ttl }) => [key, by, why, ttl])}
        />
    );
}

const ext = (href: string, label: string) => (
    <a className={LINK} href={href} target="_blank" rel="noopener noreferrer">
        {label}
    </a>
);

export default function PrivacyPage() {
    const email = DATA.header.email;
    const mail = (
        <a className={LINK} href={`mailto:${email}`}>
            {email}
        </a>
    );
    const settings = CONSENT_ENABLED ? (
        <PrivacyLink className={LINK}>cookie settings</PrivacyLink>
    ) : (
        "cookie settings"
    );

    return (
        <>
            <Navbar />
            <FloatingMascot />
            <main id="content" className="relative">
                <div className="cell">
                    <p className="font-mono text-[11px] text-muted-foreground tracking-[0.22em]">
                        FIG. 99 · PRIVACY · UPDATED{" "}
                        {POLICY_UPDATED.toUpperCase()}
                    </p>
                    <h1 className="mt-3 max-w-[14ch] font-semibold text-4xl md:text-6xl md:leading-[1.05] tracking-tight">
                        Privacy &amp; cookies
                    </h1>

                    <ul className="space-y-1.5 mt-5 max-w-[68ch] text-[15px] text-muted-foreground leading-relaxed list-disc list-inside">
                        {PRIVACY_SUMMARY.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>

                    {CONSENT_ENABLED && (
                        <div className="mt-6">
                            <PrivacyLink className="hover:bg-foreground px-4 py-2 border border-line font-mono text-[12px] hover:text-background motion-safe:transition-colors cursor-target">
                                [ OPEN COOKIE SETTINGS ]
                            </PrivacyLink>
                        </div>
                    )}

                    <nav
                        aria-label="Contents"
                        className="mt-10 border border-line"
                    >
                        <div className="flex justify-between px-4 py-2 border-line border-b font-mono text-[11px] text-muted-foreground tracking-[0.22em]">
                            <span>CONTENTS</span>
                            <span>{SECTIONS.length} SECTIONS</span>
                        </div>
                        <ol className="gap-px grid md:grid-cols-3 bg-line">
                            {SECTIONS.map(([id, title], i) => (
                                <li key={id} className="bg-background">
                                    <a
                                        href={`#${id}`}
                                        className="group flex items-baseline gap-3 hover:bg-muted px-4 py-3 motion-safe:transition-colors cursor-target"
                                    >
                                        <span className="font-mono text-[11px] text-muted-foreground group-hover:text-brand">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-[13px] text-foreground">
                                            {title}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <div className="mt-10">
                        <Section id="who" title="Who I am and scope">
                            <p className={P}>
                                I am {DATA.header.name}, an individual based in
                                India. I run this website and decide how its
                                data is handled. That makes me the
                                &ldquo;controller&rdquo; under the EU and UK
                                GDPR and the &ldquo;data fiduciary&rdquo; under
                                India&apos;s Digital Personal Data Protection
                                Act 2023 (DPDP Act). Contact: {mail}.
                            </p>
                            <p className={P}>
                                This policy covers this website only. Sites I
                                link to, such as GitHub, LinkedIn and Google
                                Drive, have their own policies.
                            </p>
                        </Section>

                        <Section id="collect" title="What I collect and why">
                            <Grid
                                cols="grid-cols-[1.1fr_1.5fr_1fr_1fr]"
                                head={[
                                    "DATA",
                                    "PURPOSE",
                                    "LEGAL BASIS",
                                    "WHEN",
                                ]}
                                rows={[
                                    [
                                        "IP address, browser, device (technical)",
                                        "deliver the page, keep it secure",
                                        "legitimate interest",
                                        "every visit",
                                    ],
                                    [
                                        "Page-load count (no identifier)",
                                        "show the visitor counter",
                                        "legitimate interest",
                                        "every visit",
                                    ],
                                    [
                                        "Theme, accent, your choice here",
                                        "remember your preferences",
                                        "legitimate interest",
                                        "every visit",
                                    ],
                                    [
                                        "Pages, clicks, scrolls, replays, approximate location",
                                        "see what works, fix what does not",
                                        "your consent",
                                        "only if you accept",
                                    ],
                                    [
                                        "Your email address and message",
                                        "reply to you",
                                        "legitimate interest",
                                        "only if you email me",
                                    ],
                                ]}
                            />
                            <p className={P}>
                                Under the DPDP Act, the personal data processed
                                and the purposes are the ones listed above. I do
                                not use any of it for advertising, profiling or
                                sale.
                            </p>
                        </Section>

                        <Section id="device" title="Stored on your device">
                            <p className={P}>
                                Essential items remember your preferences and
                                this choice. They hold no personal data and are
                                never sent to analytics.
                            </p>
                            <StorageTable rows={ESSENTIAL_STORAGE} />
                            <p className={P}>
                                Analytics items are created only if you accept:
                            </p>
                            <StorageTable rows={ANALYTICS_STORAGE} />
                            <p className={P}>
                                &ldquo;Until cleared&rdquo; means the item stays
                                until you delete this site&apos;s data in your
                                browser. Lifetimes for third-party cookies are
                                set by their owners and can change; see{" "}
                                {ext(
                                    "https://learn.microsoft.com/en-us/clarity/cookie-list",
                                    "Microsoft’s Clarity cookie list"
                                )}{" "}
                                and{" "}
                                {ext(
                                    "https://policies.google.com/technologies/cookies",
                                    "Google’s cookie page"
                                )}
                                .
                            </p>
                        </Section>

                        <Section
                            id="analytics"
                            title="Analytics (only if you accept)"
                        >
                            <p className={P}>
                                <strong className={B}>
                                    Google Analytics 4
                                </strong>{" "}
                                (Google) counts visits and pages and shows
                                roughly where and on what device the site is
                                used.{" "}
                                <strong className={B}>Microsoft Clarity</strong>{" "}
                                records clicks, scrolls and mouse movement, and
                                can replay a session. The site has no forms or
                                accounts; its only text field is the search in
                                the command menu.
                            </p>
                            <p className={P}>
                                The purpose is to see what works on the site and
                                fix what does not. The legal basis is your
                                consent (GDPR Art. 6(1)(a)), which you can
                                withdraw as easily as you gave it, via{" "}
                                {settings}. There are no ads, no advertising
                                profiles and nothing is sold.
                            </p>
                            <p className={P}>
                                <strong className={B}>If you reject:</strong> no
                                analytics cookies are set and no replay
                                recording starts. The Google tag still loads in
                                a denied state under Google Consent Mode, so
                                Google may receive anonymous, cookieless
                                signals, such as a page view, with no identifier
                                stored on your device.
                            </p>
                        </Section>

                        <Section
                            id="always-on"
                            title="Always on, no consent needed"
                        >
                            <p className={P}>
                                <strong className={B}>
                                    Hosting and performance.
                                </strong>{" "}
                                The site is hosted on Vercel, which also
                                provides Vercel Analytics and Speed Insights.
                                Vercel states that its analytics uses no cookies
                                and identifies visits with a hash that resets
                                daily. Vercel processes your IP address to
                                deliver the page and keeps standard security
                                logs.
                            </p>
                            <p className={P}>
                                <strong className={B}>Visitor counter.</strong>{" "}
                                A visitor counter adds 1 to a total on each page
                                load. Nothing about you is stored with it.
                            </p>
                        </Section>

                        <Section id="email" title="If you email me">
                            <p className={P}>
                                If you write to {mail}, I receive your email
                                address and whatever you send. I use it only to
                                reply and keep it for as long as the
                                conversation needs, plus a reasonable time after
                                in case you follow up. Your message is handled
                                by my email provider (Google Mail).
                            </p>
                        </Section>

                        <Section id="recipients" title="Who receives data">
                            <Grid
                                cols="grid-cols-[0.9fr_1.5fr_1.4fr_0.8fr]"
                                head={["PROVIDER", "ROLE", "DATA", "POLICY"]}
                                rows={[
                                    [
                                        "Vercel",
                                        "hosting, analytics, speed",
                                        "IP, request details",
                                        ext(
                                            "https://vercel.com/legal/privacy-notice",
                                            "link"
                                        ),
                                    ],
                                    [
                                        "Google",
                                        "Analytics (if accepted), email",
                                        "usage data, your messages",
                                        ext(
                                            "https://policies.google.com/privacy",
                                            "link"
                                        ),
                                    ],
                                    [
                                        "Microsoft",
                                        "Clarity (if accepted)",
                                        "clicks, scrolls, replays",
                                        ext(
                                            "https://privacy.microsoft.com/en-us/privacystatement",
                                            "link"
                                        ),
                                    ],
                                    [
                                        "Upstash",
                                        "stores the visitor total",
                                        "a number only, no personal data",
                                        ext(
                                            "https://upstash.com/trust/privacy.pdf",
                                            "link"
                                        ),
                                    ],
                                    [
                                        "svgl.app",
                                        "serves technology icons",
                                        "IP, when icons load",
                                        ext("https://svgl.app", "site"),
                                    ],
                                ]}
                            />
                            <p className={P}>
                                Fonts are served from this site. The open-source
                                and contribution data comes from GitHub, fetched
                                by the server and not with your details. I do
                                not sell data or share it with anyone else.
                            </p>
                        </Section>

                        <Section id="transfers" title="International transfers">
                            <p className={P}>
                                Google, Microsoft and Vercel operate globally,
                                so your data may be processed outside your
                                country, including in the United States. These
                                providers rely on their own safeguards, such as
                                the EU-US Data Privacy Framework and standard
                                contractual clauses.
                            </p>
                        </Section>

                        <Section id="retention" title="How long it is kept">
                            <p className={P}>
                                Storage on your device lasts as shown in the
                                tables above. Data held by Google Analytics and
                                Microsoft Clarity is kept under the retention
                                settings of those services (Google lets event
                                data be kept for up to 14 months). Vercel keeps
                                technical logs for a short period under its own
                                terms. The visitor total is a number with no
                                personal data and is kept as long as the site
                                runs. Emails are kept as described above.
                            </p>
                        </Section>

                        <Section id="security" title="Security">
                            <p className={P}>
                                The site is served over HTTPS only, with HSTS
                                and strict browser security headers. A content
                                security policy limits which services the site
                                can load, and the site stores no accounts or
                                passwords. If you find a vulnerability, please
                                report it through{" "}
                                <a
                                    className={LINK}
                                    href="/.well-known/security.txt"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    security.txt
                                </a>
                                .
                            </p>
                        </Section>

                        <Section id="rights" title="Your rights and choices">
                            <p className={P}>
                                Change or withdraw consent at any time with{" "}
                                {settings} (also in the footer), or clear this
                                site&apos;s data in your browser. Withdrawing
                                does not affect processing done before.
                            </p>
                            <p className={P}>
                                <strong className={B}>GDPR (EU and UK).</strong>{" "}
                                You may ask for access, correction, deletion,
                                restriction or portability of your data, and
                                object to processing based on legitimate
                                interest.
                            </p>
                            <p className={P}>
                                <strong className={B}>DPDP Act (India).</strong>{" "}
                                You may ask for access to a summary of your
                                data, correction, completion, updating and
                                erasure, withdraw consent, and nominate someone
                                to act for you.
                            </p>
                            <p className={P}>
                                To use any of these, email {mail}. I aim to
                                reply within 30 days. Analytics data is not
                                linked to your name, so I can only find it if
                                you send me your Google Analytics client ID (the{" "}
                                <code className="font-mono text-[13px]">
                                    _ga
                                </code>{" "}
                                cookie value).
                            </p>
                        </Section>

                        <Section
                            id="optional"
                            title="Optional data, no automation"
                        >
                            <p className={P}>
                                You do not have to give me any data to use this
                                site. Accepting analytics is optional, and the
                                site works the same either way. I make no
                                automated decisions about you and do no
                                profiling.
                            </p>
                        </Section>

                        <Section id="children" title="Children">
                            <p className={P}>
                                This site is not aimed at children and I do not
                                knowingly collect their data. If you believe a
                                child has sent me data, email me and I will
                                delete it.
                            </p>
                        </Section>

                        <Section id="changes" title="Changes to this policy">
                            <p className={P}>
                                I will update this page if the site&apos;s data
                                practices change, and the date at the top will
                                change with it. Material changes that need your
                                consent will bring the consent banner back.
                            </p>
                        </Section>

                        <Section id="contact" title="Contact and complaints">
                            <p className={P}>
                                Questions, requests or grievances: {mail}. I
                                will try to resolve it first. If you are not
                                satisfied, you may complain to your local data
                                protection authority in the EU or UK, or to the
                                Data Protection Board of India under the DPDP
                                Act.
                            </p>
                        </Section>
                    </div>
                </div>
                <Stripe />
                <Footer />
            </main>
        </>
    );
}
