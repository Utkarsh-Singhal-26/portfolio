# Contributing

This is a personal portfolio, so most changes are made by the owner. Bug fixes, accessibility fixes, and performance improvements are welcome.

## Before you start

- For anything larger than a small fix, open an issue first so we can agree on the change.
- Content changes (profile, projects, experience) are not accepted; that content is personal.

## Setup

Requires Node 22+ and Yarn 1.

```bash
yarn install
cp .env.sample .env
yarn dev
```

## Before opening a pull request

```bash
yarn lint
yarn format:check
yarn build
yarn type:check
```

All four must pass; CI runs the same checks.

## Pull requests

- Branch from `main` and keep each PR focused on one change.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and PR titles (`feat:`, `fix:`, `chore:`, ...).
- Include screenshots for visual changes, in both light and dark themes.

By contributing, you agree that your contributions are licensed under the project's [LICENSE](../LICENSE) and that you follow the [Code of Conduct](CODE_OF_CONDUCT.md).
