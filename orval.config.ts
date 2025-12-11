import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "./swagger.json",
    },
    output: {
      target: "./src/api/generated",
      schemas: "./src/api/generated/models",
      client: "react-query",
      mode: "tags-split",
      override: {
        mutator: {
          path: "./src/api/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
});
