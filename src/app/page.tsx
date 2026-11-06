import { SiteShell } from "@/components/layout/site-shell";
import { Experience } from "@/components/sections/experience";
import { Header } from "@/components/sections/header";
import { OpenSource } from "@/components/sections/open-source";
import { Stack } from "@/components/sections/stack";
import { Work } from "@/components/sections/work";
import { Writing } from "@/components/sections/writing";
import { Stripe } from "@/components/ui/blueprint";
import { DATA } from "@/content/data";
import { getGitHubContributions } from "@/lib/github/contributions";

export default function Page() {
    const contributions = getGitHubContributions();

    return (
        <SiteShell>
            <Header data={DATA.header} contributions={contributions} />
            <Stripe />
            <Work data={DATA.projects} />
            <Stripe />
            <Experience data={DATA.experience} />
            <Stripe />
            <OpenSource />
            <Stripe />
            <Stack />
            <Stripe />
            <Writing data={DATA.writing} />
        </SiteShell>
    );
}
