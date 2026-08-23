"use client";

import { useEffect, useState } from "react";

type Location = {
    latitude: number;
    longitude: number;
    timezone: string;
};

function formatCoordinate(value: number, axis: "lat" | "lon") {
    const absolute = Math.abs(value).toFixed(4);
    const direction =
        axis === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";

    return `${absolute}°${direction}`;
}

function formatLocalTime(date: Date, timezone: string) {
    const parts = new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: timezone,
        timeZoneName: "short",
    }).formatToParts(date);

    const time = parts
        .filter(
            (part) =>
                part.type === "hour" ||
                part.type === "minute" ||
                part.type === "second" ||
                part.type === "literal",
        )
        .map((part) => part.value)
        .join("")
        .trim();

    const zone =
        parts.find((part) => part.type === "timeZoneName")?.value ?? timezone;

    return `${time} ${zone}`;
}

export function HeaderMeta({
    age,
    pronoun,
    latitude,
    longitude,
    timezone,
}: Location & {
    age: string;
    pronoun: string;
}) {
    const coordinates = `${formatCoordinate(latitude, "lat")}, ${formatCoordinate(longitude, "lon")}`;
    const [localTime, setLocalTime] = useState("");

    useEffect(() => {
        function tick() {
            setLocalTime(formatLocalTime(new Date(), timezone));
        }

        tick();
        const intervalId = window.setInterval(tick, 1000);

        return () => window.clearInterval(intervalId);
    }, [timezone]);

    return (
        <p className="font-mono tabular-nums text-[13px] text-muted-foreground">
            {age}, {pronoun}
            <span aria-hidden="true"> · </span>
            <span>{coordinates}</span>
            {localTime ? (
                <>
                    <span aria-hidden="true"> · </span>
                    <time suppressHydrationWarning>{localTime}</time>
                </>
            ) : null}
        </p>
    );
}
