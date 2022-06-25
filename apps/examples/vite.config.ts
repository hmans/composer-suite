import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["three-vfx", "randomish", "shadenfreude"],
    include: ["react/jsx-runtime"]
  }
})
