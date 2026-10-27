import { defineConfig } from "vite-plus";

export default defineConfig({
    lint: {
        plugins: ["typescript", "import", "react", "nextjs", "jsx-a11y"],
        categories: { correctness: "error" },
        env: { builtin: true, node: true, browser: true, es2024: true },
        settings: { react: { version: "19" } },
        ignorePatterns: [".next/**", "out/**", "build/**", "next-env.d.ts"],
        rules: {
            "no-empty": ["error", { allowEmptyCatch: true }],
            "import/no-duplicates": "error",
            "typescript/consistent-type-imports": "error",
            "typescript/no-import-type-side-effects": "error",
            "nextjs/no-img-element": "off",
            "react/purity": "off",
            "jsx-a11y/click-events-have-key-events": "off",
            "jsx-a11y/no-static-element-interactions": "off",
            "jsx-a11y/no-noninteractive-element-interactions": "off",
            "jsx-a11y/prefer-tag-over-role": "off",
        },
    },
    fmt: {
        printWidth: 80,
        tabWidth: 4,
        trailingComma: "es5",
        sortImports: {
            internalPattern: ["@/"],
            newlinesBetween: true,
            groups: [
                "builtin",
                "external",
                "internal",
                ["parent", "sibling", "index"],
                "style",
                "unknown",
            ],
        },
        ignorePatterns: [".next/**", "yarn.lock", "next-env.d.ts"],
        overrides: [
            { files: ["*.yml", "*.yaml", "*.md"], options: { tabWidth: 2 } },
        ],
    },
    staged: {
        "*.{ts,tsx,js,jsx,mjs,cjs,json,md}": "vp fmt",
    },
});
