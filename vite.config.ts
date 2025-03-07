import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    // themePlugin(), // Removed as not directly related to path aliases
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./client/src"),
      // "@shared": path.resolve(__dirname, "shared"), // Removed as not present in edited config
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [
      "6518eacd-285a-4a12-8e0f-10c1d5858f28-00-1r3dbzdzv4kw5.pike.replit.dev",
      "localhost", // Optional: Keep localhost for local development
      // Allow all hosts to connect
    ],
  },
});
