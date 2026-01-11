import { DATA } from "@/app/data";
import {
    Contact,
    Experience,
    Footer,
    GitHubContributions,
    Header,
    Navbar,
    Skills,
} from "@/components/sections";
import { CursorManager } from "@/components/ui/cursor-manager";

export default function Page() {
    return (
        <>
            <Navbar />

            <main className="flex flex-col items-center gap-12 p-8 w-full">
                <Header data={DATA.HEADER} />
                <Experience data={DATA.EXPERIENCE} />
                <GitHubContributions />
                <Skills data={DATA.SKILLS} />
                <Contact data={DATA.HEADER} />
                <Footer />
            </main>

            <CursorManager />
        </>
    );
}
