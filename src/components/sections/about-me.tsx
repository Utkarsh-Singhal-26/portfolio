export function AboutMe({ data }: { data: Record<string, string> }) {
  return (
    <div id="aboutme" className="py-10">
      <h2 className="font-medium text-primary/90 text-base">about me.</h2>

      <p className="flex flex-col gap-2 mt-4 font-normal text-muted-foreground text-base text-justify">
        <span>
          {data.INTRO}{" "}
          <span className="hidden sm:inline">{data.EXPERTISE}</span>
        </span>
      </p>
    </div>
  );
}
