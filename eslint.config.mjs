import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        HTMLFormElement: "readonly",
        process: "readonly",
        URLSearchParams: "readonly",
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        React: "readonly",
      },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "no-unused-vars": "off",
    },
  },
];
