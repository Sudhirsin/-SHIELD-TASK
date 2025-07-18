import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "localhost",
      ".csb.app",
      ".codesandbox.io",
      "gjt4d6-5173.csb.app",
    ],
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: [
      "localhost",
      ".csb.app",
      ".codesandbox.io",
      "gjt4d6-5173.csb.app",
    ],
  },
});
