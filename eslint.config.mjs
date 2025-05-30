import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    plugins: { js },
    languageOptions: {
      globals: globals.browser,
    },
    extends: ["js/recommended"],
  },
  {

    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
    },
    
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
    extends: [
      ...tseslint.configs.recommended,
    ],
  },
]);
