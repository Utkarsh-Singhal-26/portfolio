type Day = { date: string; level: number };

export function contributionWeeks(
    activities: Day[],
    weekCount = 52
): number[][] {
    if (activities.length === 0) {
        return emptyWeeks(weekCount);
    }

    const sorted = [...activities].sort((a, b) => a.date.localeCompare(b.date));
    const needed = weekCount * 7;
    const days = sorted.slice(-needed);
    const pad = (7 - (days.length % 7)) % 7;
    const padded = [
        ...Array.from({ length: pad }, () => ({ date: "", level: 0 })),
        ...days,
    ];

    const weeks: number[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
        weeks.push(
            padded.slice(i, i + 7).map((day) => Math.min(4, day.level || 0))
        );
    }

    return weeks.slice(-weekCount);
}

export function emptyWeeks(weekCount = 52): number[][] {
    return Array.from({ length: weekCount }, () =>
        Array.from({ length: 7 }, () => 0)
    );
}
