import { ArrowUpRight } from "lucide-react";

interface IBlogData {
    DATE: string;
    TIME: string;
    LINK: string;
    DESCRIPTION: string;
}

export function Blogs({ data }: { data: Record<string, IBlogData> }) {
    return (
        <div id="blogs" className="py-10">
            <h2 className="font-medium text-primary/90 text-base">
                technical blogs.
            </h2>

            <ul className="flex flex-col gap-12 mt-4 font-normal text-primary/90 text-base">
                {Object.entries(data).map(([key, value]) => (
                    <li key={key} className="cursor-target">
                        <div className="pl-4 border-muted-foreground hover:border-primary border-l size-full transition-all duration-300">
                            <p className="text-primary/90 text-lg">
                                {key}{" "}
                                <span className="inline-block bg-secondary max-sm:mb-2 ml-2 px-2 py-1 rounded text-xs">
                                    {value.DATE}
                                </span>
                            </p>

                            <p className="flex items-center gap-1 text-sm">
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                    href={value.LINK}
                                >
                                    Read more <ArrowUpRight size={18} />
                                </a>
                                <span className="px-1 py-px text-xs">
                                    {value.TIME} min read
                                </span>
                            </p>

                            <p className="mt-1 text-muted-foreground text-sm text-justify line-clamp-3">
                                {value.DESCRIPTION}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
