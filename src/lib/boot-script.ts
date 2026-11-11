function boot() {
    const root = document.documentElement;

    try {
        const reduceMotion = matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (sessionStorage.getItem("drawn") || reduceMotion) {
            root.dataset.loader = "skip";
        }
    } catch {}

    try {
        const accent = localStorage.getItem("accent");
        if (accent) root.dataset.accent = accent;
    } catch {}
}

export const bootScript = `(${boot.toString()})()`;
