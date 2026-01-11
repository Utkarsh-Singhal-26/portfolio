"use client";

import { Github, Linkedin, Mail } from "lucide-react";

import { MovingElement } from "@/components/navbar";

export function Header({ data }: { data: Record<string, string> }) {
    const handleChange = (url: string) => {
        window.open(url, "_blank");
    };

    return (
        <div className="w-full">
            <div className="space-y-2">
                <p className="font-normal text-muted-foreground text-base">
                    hi there👋, I&apos;m
                </p>

                <div>
                    <h1 className="font-bold text-primary/90 text-4xl tracking-tight">
                        {data.NAME}
                    </h1>
                    <h2 className="flex flex-col gap-0 font-normal text-primary/90 text-base">
                        <p>
                            {data.AGE}, {data.PRONOUN}
                        </p>
                        <p>{data.HEADLINE}</p>
                    </h2>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <MovingElement
                        className="inline-flex justify-center items-center bg-primary betterhover:hover:bg-primary/90 disabled:opacity-50 shadow-sm px-4 py-2 rounded-md focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring h-9 font-medium text-primary-foreground text-sm whitespace-nowrap transition-colors disabled:pointer-events-none"
                        change={() => handleChange(data.RESUME)}
                        toChange={false}
                        ariaLabel="Resume"
                    >
                        Resume
                    </MovingElement>
                    <div className="flex gap-2">
                        <MovingElement
                            change={() => handleChange(data.EMAIL)}
                            ariaLabel="Email"
                        >
                            <Mail />
                        </MovingElement>
                        <MovingElement
                            change={() => handleChange(data.GITHUB)}
                            ariaLabel="Github"
                        >
                            <Github />
                        </MovingElement>
                        <MovingElement
                            change={() => handleChange(data.LINKEDIN)}
                            ariaLabel="Linkedin"
                        >
                            <Linkedin />
                        </MovingElement>
                    </div>
                </div>
            </div>

            <h2 className="mt-6 font-medium text-primary/90 text-base">
                about me.
            </h2>
            <p className="flex flex-col gap-2 mt-4 font-normal text-muted-foreground text-base text-justify">
                <span>
                    {data.INTRO}{" "}
                    <span className="hidden sm:inline">{data.EXPERTISE}</span>
                </span>
            </p>
        </div>
    );
}
