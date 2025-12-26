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
import { StripedPlaceholder } from "@/components/ui/striped-placeholder";
import TargetCursor from "@/components/ui/target-cursor";
import useMobileDetection from "@/hooks/use-mobile";

export default function Page() {
  const checkMobile = useMobileDetection();

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center w-full">
        <StripedPlaceholder height={60} />
        <Header data={DATA.HEADER} />
        <StripedPlaceholder height={60} />
        <Experience data={DATA.EXPERIENCE} />
        <StripedPlaceholder height={60} />
        <Skills data={DATA.SKILLS} />
        <StripedPlaceholder height={60} />
        <Contact data={DATA.HEADER} />
        <Footer />
      </main>

      {!checkMobile && <TargetCursor spinDuration={2} hideDefaultCursor />}
    </>
  );
}
