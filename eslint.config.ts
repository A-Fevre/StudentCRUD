import * as eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ["src/**/*.ts"],
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/consistent-type-imports": [
                "error",
                { prefer: "type-imports" },
            ],

            "no-console": ["warn", { allow: ["error", "warn", "log"] }],
            "no-duplicate-imports": "error",
            eqeqeq: ["error", "always"],
            "prefer-const": "error",
            "no-var": "error",
        },
    },
    {
        files: ["src/**/*.test.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "no-console": "off",
        },
    },
    {
        ignores: ["node_modules/**", "dist/**", "coverage/**"],
    },
);
