import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { format, parseISO } from "date-fns";

import type { Writing as WritingItem } from "@/app/data";
import { Reveal } from "@/components/ui/reveal";

export function Writing({ data }: { data: WritingItem[] }) {
    return (
        <section id="writing" className="cell w-full scroll-mt-24">
            <Reveal>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    Writing
                </h2>
            </Reveal>

            <ol className="mt-8 border-t border-line">
                {data.map((item, index) => (
                    <li key={item.href} className="border-b border-line">
                        <Reveal delay={index * 0.05}>
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-target group grid grid-cols-1 items-baseline gap-1 py-5 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:gap-6"
                            >
                                <time
                                    dateTime={item.date}
                                    className="font-mono text-[12px] text-muted-foreground tabular-nums"
                                >
                                    {format(parseISO(item.date), "dd MMM yyyy")}
                                </time>
                                <span className="text-base font-medium tracking-tight text-foreground md:text-lg">
                                    {item.title}
                                </span>
                                <span className="inline-flex items-center gap-2 font-mono text-[12px] text-muted-foreground">
                                    {item.minutes} min
                                    <ArrowUpRight
                                        size={14}
                                        weight="light"
                                        className="transition-transform duration-300 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </span>
                            </a>
                        </Reveal>
                    </li>
                ))}
            </ol>
        </section>
    );
}
