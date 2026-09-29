import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/green-api-react-chat/",
  plugins: [react(), tsconfigPaths(), svgr()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@styles": path.resolve(__dirname, "./src/app/styles"),
    },
  },
  test: {
    globals: true,
    environment: "node",
  },
});
