import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      "material-composer",
      "material-composer-r3f",
      "@material-composer/patch-material"
    ]
  }
})
