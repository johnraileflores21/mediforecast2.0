// eslint.config.mjs

import { Linter } from "eslint";
import * as tsParser from "@typescript-eslint/parser";
import * as tsPlugin from "@typescript-eslint/eslint-plugin";

/** @type {Linter.FlatConfig[]} */
const config = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // Your rules here
    },
  },
];

export default config;
