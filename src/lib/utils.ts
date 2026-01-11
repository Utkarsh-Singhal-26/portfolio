import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function extractDomain(url: string): string {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
}
