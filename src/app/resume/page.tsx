import { format, parse } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Stripe } from "@/components/ui/blueprint";
import { DATA, LOCATION, SITE, SITE_URL } from "@/content/data";
import { skills } from "@/lib/agent/api";
import { getOpenSource } from "@/lib/github/open-source";

export const metadata: Metadata = {
    title: "Resume",
    description: `${DATA.header.name}'s resume: experience, projects, open source and skills.`,
    alternates: {
        canonical: `${SITE_URL}/resume`,
        types: { "text/markdown": "/resume.md" },
    },
};

export const revalidate = 86400;

const LABEL =
    "font-mono text-[11px] text-muted-foreground uppercase tracking-[0.22em]";

const month = (value: string) =>
    format(parse(value, "yyyy-MM", new Date()), "MMM yyyy");

const handle = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

function Block({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h2 className={`${LABEL} pb-2 border-line border-b`}>{title}</h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

const Tags = ({ items }: { items: string[] }) => (
    <ul className="flex flex-wrap gap-1.5 mt-3">
        {items.map((item) => (
            <li
                key={item}
                className="px-2 py-0.5 border border-line font-mono text-[11px]"
            >
                {item}
            </li>
        ))}
    </ul>
);

export default async function ResumePage() {
    const { header } = DATA;
    const openSource = await getOpenSource();
    const repoNames = openSource.repos
        .slice(0, 5)
        .map((r) => r.fullName.split("/")[1]);

    const roles = DATA.experience.flatMap((company) =>
        company.roles.map((role) => ({ company, role }))
    );

    return (
        <>
            <Navbar />
            <main id="content" className="relative">
                <div>
                    <header className="cell">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10">
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:bg-foreground px-4 py-2 border border-line font-mono text-[12px] text-foreground hover:text-background uppercase tracking-[0.18em] motion-safe:transition-colors cursor-target"
                            >
                                [ Print / Save PDF ↗ ]
                            </a>
                            <Link
                                href="/resume.pdf?download=1"
                                prefetch={false}
                                className="font-mono text-[12px] uppercase tracking-[0.18em] underline underline-offset-4 hover:text-brand"
                            >
                                Download
                            </Link>
                            <Link
                                href="/"
                                className="font-mono text-[12px] uppercase tracking-[0.18em] underline underline-offset-4 hover:text-brand"
                            >
                                ← Back to portfolio
                            </Link>
                        </div>
                        <p className={LABEL}>FIG. 11 · Resume</p>
                        <h1 className="mt-3 font-semibold text-5xl md:text-7xl md:leading-[1.02] tracking-tight">
                            {header.name}
                        </h1>
                        <p className="mt-3 font-medium text-foreground/80 text-xl md:text-2xl">
                            {header.role}
                        </p>
                        <p className="mt-5 max-w-[62ch] text-muted-foreground text-lg leading-relaxed">
                            {SITE.description}
                        </p>
                    </header>

                    <div className="rule-t cell">
                        <span className="cross cross-tl" />
                        <span className="cross cross-tr" />
                        <div className="gap-x-14 gap-y-12 grid md:grid-cols-[15rem_minmax(0,1fr)]">
                            <aside className="space-y-10 max-md:order-2">
                                <Block title="Contact">
                                    <ul className="space-y-1.5 font-mono text-[12px] break-all">
                                        <li>
                                            <a href={`mailto:${header.email}`}>
                                                {header.email}
                                            </a>
                                        </li>
                                        <li>
                                            <a href={header.github}>
                                                {handle(header.github)}
                                            </a>
                                        </li>
                                        <li>
                                            <a href={header.linkedin}>
                                                {handle(header.linkedin)}
                                            </a>
                                        </li>
                                        <li>
                                            <a href={SITE_URL}>
                                                {handle(SITE_URL)}
                                            </a>
                                        </li>
                                        <li className="text-muted-foreground">
                                            {LOCATION.name}
                                            <br />
                                            {LOCATION.timezone}
                                        </li>
                                    </ul>
                                </Block>

                                <Block title="Skills">
                                    <dl className="space-y-3">
                                        {skills().map((group) => (
                                            <div key={group.discipline}>
                                                <dt className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.14em]">
                                                    {group.discipline}
                                                </dt>
                                                <dd className="mt-0.5 text-[13px] leading-snug">
                                                    {group.items.join(", ")}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </Block>

                                <Block title="Open source">
                                    <p className="text-[13px] leading-snug">
                                        {openSource.searchTotal > 0 ? (
                                            <>
                                                <span className="font-semibold text-xl">
                                                    {openSource.searchTotal}
                                                </span>{" "}
                                                merged pull requests in
                                                repositories I don&apos;t own
                                            </>
                                        ) : (
                                            "Merged pull requests in repositories I don't own"
                                        )}
                                        {repoNames.length
                                            ? `, including ${repoNames.join(", ")}.`
                                            : "."}
                                    </p>
                                </Block>

                                <Block title="Writing">
                                    <ul className="space-y-3 text-[13px] leading-snug">
                                        {DATA.writing.map((post) => (
                                            <li key={post.href}>
                                                {post.title}
                                                <span className="block mt-0.5 font-mono text-[11px] text-muted-foreground">
                                                    {format(
                                                        parse(
                                                            post.date,
                                                            "yyyy-MM-dd",
                                                            new Date()
                                                        ),
                                                        "MMM yyyy"
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </Block>
                            </aside>

                            <div className="space-y-12 min-w-0">
                                <Block title="Experience">
                                    <ol className="relative ml-1 border-line border-l">
                                        {roles.map(({ company, role }) => (
                                            <li
                                                key={`${company.name}-${role.start}`}
                                                className="relative pb-9 last:pb-0 pl-6"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="top-1.5 -left-1.25 absolute bg-brand size-2.25"
                                                />
                                                <p className={LABEL}>
                                                    {month(role.start)} –{" "}
                                                    {role.end
                                                        ? month(role.end)
                                                        : "Present"}
                                                </p>
                                                <h3 className="mt-1 font-semibold text-lg tracking-tight">
                                                    {role.title.replace(
                                                        /\s-\s/,
                                                        "-"
                                                    )}
                                                    <span className="font-normal text-muted-foreground">
                                                        {" "}
                                                        · {company.name}
                                                    </span>
                                                </h3>
                                                <p className="text-[13px] text-muted-foreground">
                                                    {role.type} ·{" "}
                                                    {company.location}
                                                </p>
                                                <ul className="space-y-1.5 mt-3 ml-4 list-disc">
                                                    {role.description.map(
                                                        (line) => (
                                                            <li key={line}>
                                                                {line}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                                <Tags items={role.stack} />
                                            </li>
                                        ))}
                                    </ol>
                                </Block>

                                <Block title="Projects">
                                    <ul className="gap-x-8 gap-y-7 grid sm:grid-cols-2">
                                        {DATA.projects.map((project) => (
                                            <li key={project.name}>
                                                <h3 className="font-semibold tracking-tight">
                                                    {project.name}
                                                    {project.contribution ? (
                                                        <span className="ml-2 font-mono font-normal text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                                                            contributor
                                                        </span>
                                                    ) : null}
                                                </h3>
                                                <p className="font-mono text-[11px] text-muted-foreground">
                                                    {handle(project.href)}
                                                </p>
                                                <p className="mt-2 text-[14px] leading-snug">
                                                    {project.summary}
                                                </p>
                                                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                                                    {project.stack.join(" · ")}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </Block>
                            </div>
                        </div>
                    </div>
                </div>
                <Stripe />
                <Footer />
            </main>
        </>
    );
}
