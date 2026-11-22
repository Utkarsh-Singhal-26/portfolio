"use client";

import { ArrowDownIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { Reveal } from "@/components/ui/reveal";
import type { Faq as FaqItem } from "@/content/faq";
import { cn } from "@/lib/utils";

const LABEL =
    "font-mono text-[10px] text-muted-foreground uppercase tracking-[0.22em]";

export function Faq({ data }: { data: FaqItem[] }) {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section id="faq" className="w-full scroll-mt-24 cell">
            <div className="gap-x-12 gap-y-8 grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                <Reveal className="md:top-28 md:sticky md:self-start">
                    <p className={LABEL}>Questions · {data.length}</p>
                    <h2 className="mt-4 max-w-[12ch] font-semibold text-3xl md:text-5xl md:leading-[1.05] tracking-tight">
                        Asked often, answered here.
                    </h2>
                    <p className="mt-4 max-w-[34ch] text-muted-foreground text-base leading-relaxed">
                        Something missing? Fill in the sentence below and it
                        reaches me directly.
                    </p>
                    <a
                        href="#contact"
                        className="group inline-flex items-center gap-2 mt-6 font-mono text-[12px] text-foreground uppercase tracking-[0.18em]"
                    >
                        <span className="underline underline-offset-4">
                            Ask me
                        </span>
                        <ArrowDownIcon
                            size={14}
                            weight="light"
                            aria-hidden="true"
                            className="motion-safe:transition-transform group-hover:translate-y-0.5 duration-300 ease-premium"
                        />
                    </a>
                </Reveal>

                <div className="border-line border-t">
                    {data.map((item, index) => {
                        const isOpen = open === index;
                        return (
                            <Reveal key={item.question} delay={index * 0.05}>
                                <div className="border-line border-b">
                                    <h3>
                                        <button
                                            type="button"
                                            id={`faq-q-${index}`}
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-a-${index}`}
                                            onClick={() =>
                                                setOpen(isOpen ? null : index)
                                            }
                                            className="group flex items-baseline gap-5 py-5 w-full text-left cursor-target"
                                        >
                                            <span
                                                className={cn(
                                                    "w-6 font-mono tabular-nums text-[12px] motion-safe:transition-colors duration-300 shrink-0",
                                                    isOpen
                                                        ? "text-brand"
                                                        : "text-muted-foreground group-hover:text-foreground"
                                                )}
                                            >
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>
                                            <span
                                                className={cn(
                                                    "flex-1 font-medium text-lg md:text-xl tracking-tight motion-safe:transition-colors duration-300",
                                                    isOpen
                                                        ? "text-foreground"
                                                        : "text-foreground/75 group-hover:text-foreground"
                                                )}
                                            >
                                                {item.question}
                                            </span>
                                            <PlusIcon
                                                size={16}
                                                weight="light"
                                                aria-hidden="true"
                                                className={cn(
                                                    "self-center motion-safe:transition-transform duration-500 ease-premium shrink-0",
                                                    isOpen
                                                        ? "rotate-45 text-brand"
                                                        : "text-muted-foreground"
                                                )}
                                            />
                                        </button>
                                    </h3>
                                    <section
                                        id={`faq-a-${index}`}
                                        aria-labelledby={`faq-q-${index}`}
                                        className={cn(
                                            "grid motion-safe:transition-[grid-template-rows] duration-500 ease-premium",
                                            isOpen
                                                ? "grid-rows-[1fr]"
                                                : "grid-rows-[0fr]"
                                        )}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="pb-6 pl-11 max-w-[60ch] text-[15px] text-muted-foreground leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </section>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
