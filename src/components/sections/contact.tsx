import { CtaLink } from "@/components/ui/cta-link";
import { Reveal } from "@/components/ui/reveal";

export function Contact({ data }: { data: Record<string, string> }) {
    return (
        <section className="cell w-full">
            <Reveal>
                <h2 className="max-w-[16ch] text-3xl font-semibold tracking-tight md:text-5xl md:leading-[1.1]">
                    Open to the next role
                </h2>
                <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
                    Backend-leaning full-stack. TypeScript, Django, and Node.
                    Email is the fastest way to reach me.
                </p>
                <div className="mt-8">
                    <CtaLink href={data.EMAIL}>Email me</CtaLink>
                </div>
            </Reveal>
        </section>
    );
}
