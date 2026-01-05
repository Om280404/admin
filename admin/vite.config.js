import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,      // 👈 change to any port you want
    strictPort: true // 👈 fail if port is already in use
  }
});
