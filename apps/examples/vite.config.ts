import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["vfx", "@react-three/drei"],
    include: ["react/jsx-runtime"]
  }
})
