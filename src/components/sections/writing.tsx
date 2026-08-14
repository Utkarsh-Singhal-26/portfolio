import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { format, parseISO } from "date-fns";

import type { Writing as WritingItem } from "@/app/data";
import { Reveal } from "@/components/ui/reveal";

export function Writing({ data }: { data: WritingItem[] }) {
    return (
        <section id="writing" className="w-full scroll-mt-24 cell">
            <Reveal>
                <h2 className="font-semibold text-2xl md:text-3xl tracking-tight">
                    writing.
                </h2>
            </Reveal>

            <ol className="mt-8 border-line border-t">
                {data.map((item, index) => (
                    <li key={item.href} className="border-line border-b">
                        <Reveal delay={index * 0.05}>
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group items-baseline gap-1 sm:gap-6 grid grid-cols-1 sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] py-5 cursor-target"
                            >
                                <time
                                    dateTime={item.date}
                                    className="font-mono tabular-nums text-[12px] text-muted-foreground"
                                >
                                    {format(parseISO(item.date), "dd MMM yyyy")}
                                </time>
                                <span className="font-medium text-foreground text-base md:text-lg tracking-tight">
                                    {item.title}
                                </span>
                                <span className="inline-flex items-center gap-2 font-mono text-[12px] text-muted-foreground">
                                    {item.minutes} min
                                    <ArrowUpRightIcon
                                        size={14}
                                        weight="light"
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-300 ease-premium"
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
