import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3000 },
  base: process.env.NODE_ENV === "production" ? "/Node_Chat_App_Demos" : "/",
  plugins: [react()],
  build: { outDir: "build" },
});
