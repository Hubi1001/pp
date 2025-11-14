import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // pozwól Vite działać na wszystkich subdomenach .csb.app
    allowedHosts: [".csb.app"],
  },
});
