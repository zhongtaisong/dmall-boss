import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
  resolve: {
    alias: {
      "@utils": path.join(__dirname, "src/utils"),
      "@router": path.join(__dirname, "src/router"),
      "@assets": path.join(__dirname, "src/assets"),
      "@app": path.join(__dirname, "src/app"),
      "@pages": path.join(__dirname, "src/pages"),
      "@axios": path.join(__dirname, "src/axios"),
      "@components": path.join(__dirname, "src/components"),
    },
  },
})
