import { FloatingMascot } from "@/components/features/floating-mascot";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Contact } from "@/components/sections/contact";
import { Stripe } from "@/components/ui/blueprint";
import { DATA } from "@/content/data";

export function SiteShell({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <FloatingMascot />
            <main id="content" className="flex flex-col w-full">
                {children}
                <Stripe />
                <Contact data={DATA.header} />
                <Stripe />
                <Footer />
            </main>
        </>
    );
}
