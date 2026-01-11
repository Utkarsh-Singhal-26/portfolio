import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface IProjectData {
    LIVE_PREVIEW?: string;
    GITHUB?: string;
    DESCRIPTION: string[];
    NOTE?: string;
    TECH_STACK: string[];
}

export function Projects({ data }: { data: Record<string, IProjectData> }) {
    return (
        <div id="projects" className="py-10">
            <h2 className="font-medium text-primary/90 text-base">projects.</h2>

            <ul className="flex flex-col gap-12 mt-4 font-normal text-primary/90 text-base">
                {Object.entries(data)
                    .slice(0, 3)
                    .map(([key, value]) => (
                        <li key={key} className="cursor-target">
                            <div className="pl-4 border-muted-foreground hover:border-primary border-l size-full transition-all duration-300">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-primary/90 text-lg">
                                            {key}
                                        </p>

                                        <p className="flex items-center gap-1 text-sm">
                                            {value.LIVE_PREVIEW && (
                                                <a
                                                    className="flex items-center gap-1"
                                                    href={value.LIVE_PREVIEW}
                                                >
                                                    live preview{" "}
                                                    <ArrowUpRight size={18} />
                                                </a>
                                            )}
                                            {value.GITHUB && (
                                                <a
                                                    className="flex items-center gap-1"
                                                    href={value.GITHUB}
                                                >
                                                    github{" "}
                                                    <ArrowUpRight size={18} />
                                                </a>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <ul className="space-y-1 mt-1 pl-3 text-muted-foreground text-sm text-justify list-disc">
                                    {value.DESCRIPTION.map((desc, index) => (
                                        <li key={index}>
                                            <span>{desc}</span>
                                        </li>
                                    ))}
                                </ul>

                                <ul className="flex flex-wrap items-center gap-2 mt-2 pl-3">
                                    {value.TECH_STACK.map((tech, index) => (
                                        <li
                                            key={index}
                                            className="bg-muted px-2 py-1 rounded text-xs"
                                        >
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
            </ul>

            <div className="flex justify-center mt-8">
                <Link
                    href={"/projects"}
                    className="inline-flex justify-center items-center bg-background hover:bg-accent disabled:opacity-50 shadow-xs px-4 py-2 border border-input rounded-md focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring h-9 font-medium text-muted-foreground text-sm whitespace-nowrap transition-colors hover:text-accent-foreground cursor-target disabled:pointer-events-none"
                >
                    View all projects
                </Link>
            </div>
        </div>
    );
}
