import { DATA } from "@/app/data";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { Stripe } from "@/components/ui/blueprint";
import { FloatingMascot } from "@/components/ui/floating-mascot";

export function SiteShell({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <FloatingMascot />
            <main id="content" className="flex flex-col w-full">
                {children}
                <Stripe />
                <Contact data={DATA.HEADER} />
                <Stripe />
                <Footer />
            </main>
        </>
    );
}
