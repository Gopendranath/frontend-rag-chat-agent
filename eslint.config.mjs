import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

  // Scoped overrides to silence the specific rules/errors/warnings you reported.
  // Keeps the rest of the codebase using the standard rules.
  {
    overrides: [
      {
        // branch hook deps warning
        files: ["src/components/ai-elements/branch.tsx"],
        rules: {
          "react-hooks/exhaustive-deps": "off",
        },
      },
      {
        // next/image and alt-text warnings for components using <img>
        files: [
          "src/components/ai-elements/image.tsx",
          "src/components/ai-elements/prompt-input.tsx",
          "src/components/ChatInput.tsx",
          "src/components/ChatMessages.tsx",
          "src/components/ProcessingModeToggle.tsx"
        ],
        rules: {
          "@next/next/no-img-element": "off",
          "jsx-a11y/alt-text": "off"
        },
      },
      {
        // no-explicit-any and unused variable complaints in a few files
        files: [
          "src/components/ChatInput.tsx",
          "src/components/ChatMessages.tsx",
          "src/components/ConversationHistoryDialog.tsx",
          "src/hooks/useChat.ts"
        ],
        rules: {
          "@typescript-eslint/no-explicit-any": "off",
          "@typescript-eslint/no-unused-vars": "off",
          "prefer-const": "off"
        },
      },
    ],
  },
];

export default eslintConfig;