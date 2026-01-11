"use client";

import { ArrowUp } from "lucide-react";

export function Footer() {
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <div className="flex max-md:flex-col justify-between items-center max-md:gap-2 pt-4 border-gray-800 border-t w-full">
            <p className="text-muted-foreground text-base text-center">
                &copy; {new Date().getFullYear()} Utkarsh Singhal. All rights
                reserved.
            </p>
            <button
                className="flex items-center gap-2 w-fit text-muted-foreground text-base cursor-pointer"
                onClick={scrollToTop}
            >
                Elevate to the top
                <ArrowUp size={20} />
            </button>
        </div>
    );
}
