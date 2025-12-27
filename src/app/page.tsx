"use client";

import { DATA } from "@/app/data";
import {
  Contact,
  Experience,
  Footer,
  Header,
  Navbar,
  Skills,
} from "@/components/sections";
import TargetCursor from "@/components/ui/target-cursor";
import useMobileDetection from "@/hooks/use-mobile";

export default function Page() {
  const checkMobile = useMobileDetection();

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center gap-12 p-8 w-full">
        <Header data={DATA.HEADER} />
        <Experience data={DATA.EXPERIENCE} />
        <Skills data={DATA.SKILLS} />
        <Contact data={DATA.HEADER} />
        <Footer />
      </main>

      {!checkMobile && <TargetCursor spinDuration={2} hideDefaultCursor />}
    </>
  );
}
