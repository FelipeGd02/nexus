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

    extends: [...tseslint.configs.recommended],
  },
]);
