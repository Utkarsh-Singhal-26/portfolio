import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    prettier,
    {
        files: ["**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-import-type-side-effects": "error",
            "@next/next/no-img-element": "off",
        },
    },
    {
        plugins: {
            import: importPlugin,
        },
        rules: {
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        ["parent", "sibling", "index"],
                    ],

                    pathGroups: [
                        {
                            pattern: "@/**",
                            group: "internal",
                            position: "after",
                        },
                    ],

                    "newlines-between": "always",

                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],

            "import/newline-after-import": ["error", { count: 1 }],
        },
    },

    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
