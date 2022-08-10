import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["three-vfx", "vfx-composer", "r3f-stage"],
    include: ["react/jsx-runtime"]
  }
})
