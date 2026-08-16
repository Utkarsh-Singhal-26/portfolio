import { CtaLink } from "@/components/ui/cta-link";
import { Reveal } from "@/components/ui/reveal";

export function Contact({ data }: { data: Record<string, string> }) {
    return (
        <section id="contact" className="w-full scroll-mt-24 cell">
            <Reveal>
                <h2 className="max-w-[16ch] font-semibold text-3xl md:text-5xl md:leading-[1.1] tracking-tight">
                    Get in touch
                </h2>
                <p className="mt-4 max-w-[52ch] text-muted-foreground text-base leading-relaxed">
                    If you want to talk about a role or a project, email is the
                    fastest way.
                </p>
                <div className="mt-8">
                    <CtaLink href={data.EMAIL}>Email me</CtaLink>
                </div>
            </Reveal>
        </section>
    );
}
