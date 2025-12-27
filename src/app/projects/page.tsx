"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React from "react";

import { DATA, IProjectData } from "@/app/data";
import { Contact, Footer, Navbar } from "@/components/sections";
import TargetCursor from "@/components/ui/target-cursor";
import useMobileDetection from "@/hooks/use-mobile";

export default function Page() {
  const projectsData: Record<string, IProjectData> = DATA.PROJECTS;
  const checkMobile = useMobileDetection();

  return (
    <>
      <Navbar />

      <div className="px-6 pt-6">
        <section className="pb-10">
          <h1 className="font-medium text-primary/90 text-base">
            my projects.
          </h1>
          <div className="max-w-4xl text-muted-foreground text-sm text-justify leading-relaxed">
            <p className="mt-2 mb-4">
              Passionate about building high-performance and scalable web
              applications. I thrive on solving complex problems, optimizing
              performance, and creating intuitive user experiences. My expertise
              lies in Next.js, TypeScript, and Cloud technologies, with a strong
              focus on delivering quality solutions.
            </p>
          </div>
        </section>

        <div className="space-y-12 mb-12">
          {Object.entries(projectsData).map(([key, value], index) => {
            const isEven = index % 2 === 0;

            return (
              <React.Fragment key={key}>
                <div className="items-start gap-12 grid lg:grid-cols-2 cursor-target">
                  <div className={`${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="relative rounded-lg overflow-hidden">
                      <Image
                        src={value.IMAGE || "/placeholder.svg"}
                        alt={key}
                        width={600}
                        height={400}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  </div>

                  <div
                    className={`space-y-6 border-muted-foreground hover:border-primary border-l size-full transition-all duration-300 pl-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <div>
                      <h2 className="mb-1 font-medium text-2xl">{key}</h2>

                      <p className="flex items-center gap-1 text-sm">
                        {value.LIVE_PREVIEW && (
                          <a
                            className="flex items-center gap-1"
                            href={value.LIVE_PREVIEW}
                          >
                            live preview <ArrowUpRight size={18} />
                          </a>
                        )}
                        {value.GITHUB && (
                          <a
                            className="flex items-center gap-1"
                            href={value.GITHUB}
                          >
                            github <ArrowUpRight size={18} />
                          </a>
                        )}
                      </p>
                    </div>
                    <ul className="space-y-1 mt-1 pl-3 text-muted-foreground text-sm text-justify list-disc">
                      {value.DESCRIPTION.map((desc, index) => (
                        <li key={index}>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>

                    <ul className="flex flex-wrap items-center gap-2 mt-2 pl-3">
                      {value.TECH_STACK.map((tech, index) => (
                        <li
                          key={index}
                          className="bg-muted px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {index < Object.entries(projectsData).length - 1 && (
                  <div className="border-muted-foreground/20 border-t" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <Contact data={DATA.HEADER} />
        <Footer />
      </div>

      {!checkMobile && <TargetCursor spinDuration={2} hideDefaultCursor />}
    </>
  );
}
