export function FrameMarks() {
    return (
        <div
            className="pointer-events-none sticky top-0 z-45 h-0"
            aria-hidden="true"
        >
            <span className="cross cross-tl" />
            <span className="cross cross-tr" />
            <span className="cross cross-nav-l" />
            <span className="cross cross-nav-r" />
        </div>
    );
}

export function Stripe() {
    return (
        <div className="stripe-band rule-t rule-b" aria-hidden="true">
            <span className="cross cross-tl" />
            <span className="cross cross-tr" />
            <span className="cross cross-bl" />
            <span className="cross cross-br" />
        </div>
    );
}
