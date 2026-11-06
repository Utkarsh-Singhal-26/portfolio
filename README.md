# [utkarsh-singhal.is-a.dev](https://utkarsh-singhal.is-a.dev)

Personal portfolio of Utkarsh Singhal, a backend-leaning full-stack developer: shipped work, experience, open source contributions, and writing.

[![Portfolio preview](docs/preview.png)](https://utkarsh-singhal.is-a.dev)

## Stack

- [Next.js](https://nextjs.org) (App Router) with React 19 and TypeScript
- Tailwind CSS v4, `cmdk` command menu, `next-themes` (light/dark)
- Framer Motion, GSAP and Matter.js for motion
- Open source and contribution data fetched from the GitHub API and cached daily
- Vercel Analytics, Speed Insights and (opt-in, consent-gated) Microsoft Clarity

## Run locally

Requires Node 22+ and Yarn 1.

```bash
yarn install
cp .env.sample .env
yarn dev
```

Open http://localhost:3000. Both variables below are optional locally:

| Variable                 | Purpose                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| `GITHUB_TOKEN`           | Raises the GitHub API rate limit for the open source section           |
| `NEXT_PUBLIC_CLARITY_ID` | Enables Microsoft Clarity (production only, behind the consent banner) |

## Scripts

| Command                     | What it does                                             |
| --------------------------- | -------------------------------------------------------- |
| `yarn dev`                  | Start the dev server                                     |
| `yarn build` / `yarn start` | Production build / serve it                              |
| `yarn lint`                 | Lint with Vite+ (oxlint)                                 |
| `yarn type:check`           | TypeScript (run after a build so `next-env.d.ts` exists) |
| `yarn format:check`         | Format check with Vite+ (oxfmt)                          |

Site content (profile, projects, experience, links) lives in [`src/content/data.ts`](src/content/data.ts).

## Project layout

```
src/
  app/                  routes only (page, layout, OG images, sitemap, robots, llms.txt)
  content/data.ts       all site content and the SITE_URL constant
  components/
    ui/                 small reusable building blocks
    layout/             site shell, navbar, footer
    sections/           one file per page section
    features/           self-contained widgets (command menu, mascot, loader, cursor, ...)
    kibo-ui/            vendored component
  lib/
    github/             GitHub data fetching (cached daily)
    og/                 Open Graph image rendering
```

## Security notes

- Security headers, including the Content-Security-Policy, are set in [`next.config.ts`](next.config.ts).
- `GITHUB_TOKEN` only needs read access to public data: use a fine-grained token with no extra permissions.
- `yarn audit` reports advisories against `vite`. They are false positives: `vite` here is an alias for `@voidzero-dev/vite-plus-core`, and the audit matches its version number against old Vite releases.

## License

The **code** is MIT licensed, see [LICENSE](./LICENSE). You're free to use it as a starting point.

The **content** (text, résumé, images, project write-ups, and my name and likeness) is © Utkarsh Singhal, all rights reserved. Please replace all of it with your own before publishing your site.

## Sponsor

Found this useful? [Sponsor me](https://github.com/sponsors/Utkarsh-Singhal-26).
