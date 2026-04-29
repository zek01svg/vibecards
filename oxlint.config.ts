import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "off",
  },
  env: {
    builtin: true,
  },
  settings: {
    react: {
      version: "19.2.4",
    },
  },
  ignorePatterns: [
    "node_modules/**",
    ".github/**",
    ".vercel/**",
    "coverage/**",
    "playwright/**",
    "**/env.ts",
    "**/playwright.config.ts",
  ],
  overrides: [
    {
      files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
      plugins: ["react", "import", "jsx-a11y"],
      env: {
        browser: true,
        node: true,
      },
      globals: {
        AudioWorkletGlobalScope: "readonly",
        AudioWorkletProcessor: "readonly",
        currentFrame: "readonly",
        currentTime: "readonly",
        registerProcessor: "readonly",
        sampleRate: "readonly",
        WorkletGlobalScope: "readonly",
      },
      rules: {
        "react/display-name": "error",
        "react/jsx-key": "error",
        "react/jsx-no-comment-textnodes": "error",
        "react/jsx-no-duplicate-props": "error",
        "react/jsx-no-target-blank": "off",
        "react/jsx-no-undef": "error",
        "react/no-children-prop": "error",
        "react/no-danger-with-children": "error",
        "react/no-direct-mutation-state": "error",
        "react/no-find-dom-node": "error",
        "react/no-is-mounted": "error",
        "react/no-render-return-value": "error",
        "react/no-string-refs": "error",
        "react/no-unescaped-entities": "error",
        "react/no-unknown-property": "off",
        "react/no-unsafe": "off",
        "react/react-in-jsx-scope": "off",
        "import/no-anonymous-default-export": "warn",
        "jsx-a11y/alt-text": [
          "warn",
          {
            elements: ["img"],
            img: ["Image"],
          },
        ],
        "jsx-a11y/aria-props": "warn",
        "jsx-a11y/aria-proptypes": "warn",
        "jsx-a11y/aria-unsupported-elements": "warn",
        "jsx-a11y/role-has-required-aria-props": "warn",
        "jsx-a11y/role-supports-aria-props": "warn",
        "react/rules-of-hooks": "error",
        "react/exhaustive-deps": "warn",
      },
    },
    {
      files: ["**/*.js", "**/*.ts", "**/*.tsx"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            name: "process",
            importNames: ["env"],
            message:
              "Use `import { env } from '@/lib/env'` instead to ensure validated types.",
          },
        ],
      },
    },
  ],
});
