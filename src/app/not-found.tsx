"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { MovingElement } from "@/components/navbar";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold text-6xl">404</h1>
      <p className="mt-4 text-xl">Page Not Found</p>

      <MovingElement
        change={() => router.push("/")}
        ariaLabel="Navigate to home"
        className="mt-8"
      >
        <Link
          href={"/"}
          className="flex items-center gap-2 font-bold text-xl tracking-tighter"
        >
          <ArrowLeft />
          Go back to home
        </Link>
      </MovingElement>
    </div>
  );
}
