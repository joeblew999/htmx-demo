import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Build output, deps and vendored htmx skills are not ours to lint.
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".github/skills/**",
      ".wrangler/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    rules: {
      // `_c` etc. — params kept to satisfy a base-class signature but unused.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
    languageOptions: {
      // Worker code runs on workerd. No Node globals — see AGENTS.md rule 6a.
      globals: {
        D1Database: "readonly",
        Response: "readonly",
        Request: "readonly",
        URL: "readonly",
        console: "readonly",
      },
    },
  },
);
