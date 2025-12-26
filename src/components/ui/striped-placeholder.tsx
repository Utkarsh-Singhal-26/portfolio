import { cn } from "@/lib/utils";

interface StripedPlaceholderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function StripedPlaceholder({
  className,
  width,
  height,
}: StripedPlaceholderProps) {
  return (
    <section
      className={cn(
        "z-50 relative bg-[#f7f5f3] dark:bg-[#070707] p-6 w-full",
        className
      )}
      style={{
        width: width ?? "100%",
        height: height ?? "200px",
      }}
    >
      {/* Top Left Rhombus */}
      <div className="top-0 left-0 absolute bg-primary border-primary size-2 rotate-45 -translate-x-1/2 -translate-y-1/2" />

      {/* Top Right Rhombus */}
      <div className="top-0 right-0 absolute bg-primary border-primary size-2 rotate-45 -translate-y-1/2 translate-x-1/2" />

      {/* Bottom Left Rhombus */}
      <div className="bottom-0 left-0 absolute bg-primary border-primary size-2 rotate-45 -translate-x-1/2 translate-y-1/2" />

      {/* Bottom Right Rhombus */}
      <div className="right-0 bottom-0 absolute bg-primary border-primary size-2 rotate-45 translate-x-1/2 translate-y-1/2" />
    </section>
  );
}
