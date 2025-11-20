"use client";

import { DATA } from "@/app/data";
import {
  AboutMe,
  Contact,
  Experience,
  Footer,
  Header,
  Navbar,
  Skills,
} from "@/components/sections";
import GridPattern from "@/components/ui/grid-pattern";
import TargetCursor from "@/components/ui/target-cursor";
import useMobileDetection from "@/hooks/use-mobile";

export default function Page() {
  const checkMobile = useMobileDetection();

  return (
    <div className="mx-auto px-4 pt-6 sm:pt-12 w-full lg:w-2/3 xl:w-1/2 text-foreground">
      <Navbar />

      <GridPattern
        width={32}
        height={32}
        x={-1}
        y={-1}
        className="[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
      />

      <main className="px-4 min-h-lvh">
        <Header data={DATA.HEADER} />
        <AboutMe data={DATA.ABOUT_ME} />
        <Experience data={DATA.EXPERIENCE} />
        <Skills data={DATA.SKILLS} />
        <Contact data={DATA.HEADER} />
        <Footer />
      </main>

      {!checkMobile && <TargetCursor spinDuration={2} hideDefaultCursor />}
    </div>
  );
}
