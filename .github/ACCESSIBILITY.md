# Accessibility

The goal is for https://utkarsh-singhal.is-a.dev to meet [WCAG 2.2](https://www.w3.org/TR/WCAG22/) level AA.

## What is in place

- Full keyboard access: a "Skip to content" link, every link and button reachable with Tab, and a visible focus ring
- Command menu (`⌘K` or `/`) and shortcuts help (`?`) trap focus while open, close with Escape, and return focus where it was
- Section shortcuts and menu jumps move keyboard focus to the section, so Tab continues from there
- Every interactive element has an accessible name; landmarks (`header`, `nav`, `main`, `footer`) and a single `h1` structure the page
- Light and dark themes
- Accent color switcher (footer row and `⌘K`): swatches are buttons with an accessible name and `aria-pressed`, grouped under a labelled fieldset; every accent keeps at least 4.6:1 contrast against the page background in both themes
- `prefers-reduced-motion` turns off the page loader, name intro, reveal animations, physics and custom cursor
- Decorative visuals (mascot, physics stack, custom cursor, blueprint drawings) are hidden from assistive technology

## Supported environments

Built for the latest versions of Chrome, Edge, Firefox and Safari, on desktop and mobile. Screen reader support is not formally tested yet; reports are welcome.

## Known limitations

- The contribution graph and open source section load from the GitHub API and show a placeholder until the data arrives.

## Reporting a barrier

Open a [bug report](https://github.com/Utkarsh-Singhal-26/portfolio/issues/new?template=bug_report.yml) with the page, what you tried to do, and the browser and assistive technology you used, or email singhalutkarsh26@gmail.com.
