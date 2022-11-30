import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      "shader-composer",
      "@shader-composer/r3f",
      "shader-composer-toybox"
    ],
    include: ["react/jsx-runtime"]
  }
})
