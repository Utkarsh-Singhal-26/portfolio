import { DATA } from "@/app/data";
import {
    Experience,
    Header,
    OpenSource,
    SiteShell,
    Stack,
    Work,
    Writing,
} from "@/components/sections";
import { Stripe } from "@/components/ui/blueprint";
import { getGitHubContributions } from "@/lib/github-contribution";

export default function Page() {
    const contributions = getGitHubContributions();

    return (
        <SiteShell>
            <Header data={DATA.HEADER} contributions={contributions} />
            <Stripe />
            <Work data={DATA.PROJECTS} />
            <Stripe />
            <Experience data={DATA.EXPERIENCE} />
            <Stripe />
            <OpenSource />
            <Stripe />
            <Stack />
            <Stripe />
            <Writing data={DATA.WRITING} />
        </SiteShell>
    );
}
