"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React from "react";

import { DATA, IBlogData } from "@/app/data";
import { Contact, Footer, Navbar } from "@/components/sections";
import TargetCursor from "@/components/ui/target-cursor";
import useMobileDetection from "@/hooks/use-mobile";

export default function Page() {
  const blogsData: Record<string, IBlogData> = DATA.BLOGS;
  const checkMobile = useMobileDetection();

  return (
    <>
      <Navbar />

      <div className="px-6 pt-6">
        <section className="pb-10">
          <h1 className="font-medium text-primary/90 text-base">
            technical blogs.
          </h1>
          <div className="max-w-4xl text-muted-foreground text-sm text-justify leading-relaxed">
            <p className="mt-2 mb-4">
              I write about web development, TypeScript, and best practices I
              discover while building apps. Here are some of my technical posts
              — feel free to read more on the original links.
            </p>
          </div>
        </section>

        <div className="space-y-12 mb-12">
          {Object.entries(blogsData).map(([key, value], index) => {
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
                      <span className="top-4 lg:right-4 max-lg:left-4 absolute bg-secondary px-3 py-1.5 rounded text-xs">
                        {value.DATE}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`space-y-6 border-muted-foreground hover:border-primary border-l size-full transition-all duration-300 pl-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <div>
                      <p className="mb-1 text-primary/90 text-lg">{key}</p>

                      <p className="flex items-center gap-1 text-sm">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                          href={value.LINK}
                        >
                          Read more <ArrowUpRight size={18} />
                        </a>
                        <span className="px-1 py-px text-xs">
                          {value.TIME} min read
                        </span>
                      </p>
                    </div>

                    <p className="mt-1 text-muted-foreground text-sm text-justify line-clamp-3">
                      {value.DESCRIPTION}
                    </p>
                  </div>
                </div>

                {index < Object.entries(blogsData).length - 1 && (
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
